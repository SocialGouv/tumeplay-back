import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { IOrder, IOrderMainView, IOrderInputDTO } from '../../interfaces/IOrder';
import { IShippingMode, IShippingModeDTO } from '../../interfaces/IShippingMode';
import ShippingModeService from '../../services/shipping.mode';
import { celebrate, Joi } from 'celebrate';
import middlewares from '../middlewares';
import { IOrderZoneDTO } from '../../interfaces/IOrderZone';

import OrderService             from '../../services/order';
import ExportGeneratorService   from '../../services/export.generator';
import DateFormatterService     from '../../services/date.formatter';
import ProductService           from '../../services/product';
import ProductOrderService      from '../../services/product.order';
import MondialRelayService      from '../../services/mondial.relay';
import UserService              from '../../services/user';
import PoiService               from '../../services/poi';
import BoxService               from '../../services/box';

const route = Router();

export default (app: Router) => {
    const routes = {
        ORDERS_ROOT: '/orders',
        ORDER_MANAGEMENT_ROOT: '/management',
        SHIPPING_MODE_ROOT: '/shipping-mode',
        USER_REVIEW_ROOT: '/user-review',
    };
    const aclSection = 'orders';

    const pageNames = {
        shipping: {
            viewList: 'page-shipping-mode',
            addEdit: 'page-shipping-mode-edit',
        },
        orderManagement: {
            viewList: 'page-order-management',
            addEdit: 'page-order-management-edit',
        },
        review: {
            viewList: 'page-user-review',
            addEdit: 'page-order-management-edit',
        },
    };

    app.use(routes.ORDERS_ROOT, route);

    /**
     * @description Order management routes
     */

    route.get(
    	`${routes.ORDER_MANAGEMENT_ROOT}/export/csv`, 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
    	try {
    		const logger: any 	= Container.get('logger');
    		
    		
    		const dateService   = Container.get(DateFormatterService);
			const exportService = Container.get(ExportGeneratorService);	
			
			const orderModel  	= Container.get("orderModel");
			
			const dbOrders		= await orderModel.findAll({ include: ['shippingAddress', 'profile', 'availability_zone']});
			
			const orders = dbOrders.map(item => {
				const dateObject = new Date(item.orderDate);
				const date 		 = dateService.format(item.orderDate);
				
				return [
					item.id,
                    item.availability_zone && item.availability_zone[0] ? item.availability_zone[0].name : '',
					date.day + "/" + date.month + "/" + date.year,
					item.boxId,
					item.profile.name,
					item.profile.surname,
					item.profile.email,
				]
			});
			
			const headers = [
				"Num",
                "Zone",
				"Date",
				"Box commandée",
				"Prénom",
				"Nom",
				"E-Mail"
			]; 
			
			orders.unshift(headers);
			   
			logger.debug("Got orders.");
			
			const { tmpFile }   = await exportService.generateCsv(orders);
			
			const date  = dateService.format(new Date());
			
			res.download(tmpFile, 'Export-Commandes-' + date.year + date.month + date.day + '.csv');
    	}
    	catch(e) {
			console.log(e);	
    	}
	});
    
    route.get(
	    routes.ORDER_MANAGEMENT_ROOT, 
	    middlewares.isAuth,
	    middlewares.isAllowed(aclSection, 'global', 'view'),   
	    async (req: Request, res: Response) => {
        try {

            const { orders } = await Container.get(OrderService).findAllOrdersMainView();
            const zones 	 = await Container.get(UserService).getAllowedZones(req);
            return res.render(pageNames.orderManagement.viewList, {
                orders,
                zones
            });
        } catch (e) {
            throw e;
        }
    });
    
    route.get(
        `${routes.ORDER_MANAGEMENT_ROOT}/generate-mondial-relay/:id`,
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),
        async (req: Request, res: Response) => {
            try {
                const orderServiceInstance = Container.get(OrderService);
		                
		        const { order } = await orderServiceInstance.findByIdDetailled(req.params.id);
		        console.log(order);
		        
		        if( order )
		        {
			        const variables = {
			            firstName: order.profileFirstName,
			            name: order.profileName,
			            orderId: String(order.id).padStart(3, '0'),
			            boxId: order.box.id,
			            boxName: order.box.title,
			            shippingMethodReadable: (order.shippingModeText == 'home') ? 'À domicile' : 'Point Relais',
			            shippingMethod: order.shippingModeText,
			            pickup: order.pickup,
			            shippingAddress: order.shipping,
			            products: order.products,
			            hostname: req.protocol + '://' + req.get('host'), // I'm a bit nervous using this one.
			            email: order.profileEmail,
			        };
			        
			        const mondialRelay   = Container.get(MondialRelayService);
			        const datetime  	 = new Date(order.createdAt);
					const orderReference = datetime.getTime().toString() + '-' + order.id;        
					
			        variables.labelFile = await mondialRelay.createRemoteLabel(
			            orderReference, 
			            order.profileFullName, 
			            order.profileEmail, 
			            order.shippingModeText, 
			            order.pickup,
			            order.shipping
			        );
			        
			        variables.labelFilename = variables.orderId + '-' + variables.boxId + ".pdf"; 
			        
			        if( variables.labelFile )
			        {
						return res.json({ success : true, path : variables.labelFile }).status(200);
			        }
			        else
			        {
						return res.json({ success : false }).status(200);
			        }
			        
				}
		        return res.json({ success : false }).status(200);
            } catch (e) {
                throw e;
            }
        },
    );

    
    route.get(
        `${routes.ORDER_MANAGEMENT_ROOT}/add`,
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),
        async (req: Request, res: Response) => {
            try {
                const zones  = await Container.get(UserService).getAllowedZones(req);
                const pois   = await Container.get(PoiService).findAllFiltered(req, {include: [ 'availability_zone' ], order: ['name']});
                const boxs   = await Container.get(BoxService).findAll(req, {
                    where: {
                        deleted: false,
                    },
                    include: ['picture', 'availability_zone'],
                });
                const products = await Container.get(ProductService).findAll(req, {
                    where: {
                        deleted: false,
                    },
                });
                return res.render(pageNames.orderManagement.addEdit, {
                    zones,
                    pois,
                    boxs,
                    products
                });
            } catch (e) {
                throw e;
            }
        },
    );                     
    
    
    route.get(
        `${routes.ORDER_MANAGEMENT_ROOT}/edit/:id`,
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),
        async (req: Request, res: Response) => {
            try {
                const documentId = +req.params.id;
                const zones 	 = await Container.get(UserService).getAllowedZones(req);
                
                const orderModelService: OrderService = Container.get(OrderService);

                const { order } = await orderModelService.findByIdDetailled(documentId);
                
                order.zoneIds = order.availability_zone.map(item => {
					return item.id;
	            });
	            
	            const products = await Container.get(ProductService).findAll(req, {
                    where: {
                        deleted: false,
                    },
                });
                    
                
                return res.render(pageNames.orderManagement.addEdit, {
                    order,
                    zones,
                    products
                });
            } catch (e) {
                throw e;
            }
        },
    );                     
    
    route.post(
        `${routes.ORDER_MANAGEMENT_ROOT}/edit/:id`,
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),    
        /*celebrate({
            body: Joi.object({
                sent: Joi.string().allow(null),
                delivered: Joi.string().allow(null),
            }),
        }), */
        async (req: Request, res: Response) => {
            const logger: any = Container.get('logger');
            logger.debug('Calling Front edit order with body: %o', req.body);

            try {
                const orderInput: Partial<IOrderInputDTO> = {
                    sent: req.body.sent ? req.body.sent === 'on' : false,
                    delivered: req.body.delivered ? req.body.delivered === 'on' : false,
                };
                
                const id = +req.params.id;

                console.log(req.body);
                
                await Container.get(OrderService).update(id, orderInput);
                
                let targetZones = [];
	            const zones = await Container.get(UserService).getAllowedZones(req);
                if( zones && zones.length == 1 )
                {
					targetZones = [zones[0].id];
                }   
                else
                {
					targetZones = req.body.zoneId;
                }                                                                                                                                                             
                
                await Container.get(OrderService).handleZones(id, targetZones);
                
                const { orderProducts } = await Container.get(ProductOrderService).findByOrder(id);

                
                await releaseProductsStocks(orderProducts);
                
                const productZones: IProductZone[] = await Container.get('productOrderModel').destroy({
                    where: {
                        orderId: id,
                    },
                });                
                
                await Container.get(OrderService).handleOrderProducts(req.body, id);
                
                return res.redirect(`${routes.ORDERS_ROOT}${routes.ORDER_MANAGEMENT_ROOT}`);
            } catch (e) {
                logger.error('🔥 error: %o', e);
                throw e;
            }
        },
    );
    

    route.post(
	    `${routes.ORDER_MANAGEMENT_ROOT}/delete/:id`, 
	    middlewares.isAuth, 
	    middlewares.isAllowed(aclSection, 'global', 'edit'),    
	    async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Delete Order endpoint with body: %o', req.body);

        try {
            const orderId = req.params.id;

            const orderInput: Partial<IOrderInputDTO> = {
                deleted: true,
                updatedAt: new Date(),
            };
            

            await Container.get(OrderService).update(orderId, orderInput);
            
            const { orderProducts } = await Container.get(ProductOrderService).findByOrder(orderId);
            
            logger.debug("Got " + orderProducts.length + " item to increase.");
            
            const productService: ProductService = Container.get(ProductService);
            
            
            await releaseProductsStocks(orderProducts);
            
            return res.redirect(routes.ORDERS_ROOT + routes.ORDER_MANAGEMENT_ROOT);
        } catch (e) {
            throw e;
        }
    });
    
    const releaseProductsStocks = async(orderProducts) => 
    {
        const productService = Container.get(ProductService);
        
        if( orderProducts && orderProducts.length > 0 )
        {
            for( let i = 0; i < orderProducts.length; i++ )
            {
                const product = orderProducts[i];
                await productService.increaseStock(product.productId, product.qty); 
            }
        }
    }
    
    const handleOrderProducts = async(bodyRequest, orderId) => 
    {
        const boxProducts    = [];
        const _orderProducts = [];
        if( 
            bodyRequest.products && bodyRequest.products.length > 0 &&
            bodyRequest.qty && bodyRequest.qty.length > 0 && 
            bodyRequest.products.length == bodyRequest.qty.length
        )
        {
            const productService = Container.get(ProductService);
            bodyRequest.products.forEach(async (item, index) => {
                if( item != "" && typeof item !== "undefined" )
                {
                    _orderProducts.push({
                        productId: item,
                        orderId: orderId,
                        qty: bodyRequest.qty[index], 
                    });
                    
                    await productService.decreaseStock(item, bodyRequest.qty[index]);    

                }                                                                
            });
            
            await  Container.get('productOrderModel').bulkCreate(_orderProducts);
        }
    }
    
    /**
     * @description Shipping mode routes
     */

    route.get(
	    routes.SHIPPING_MODE_ROOT, 
	    middlewares.isAuth,
	    middlewares.isAllowed(aclSection, 'global', 'edit'),     
	    async (req: Request, res: Response) => {
        try {

            const shippingModes: IShippingMode[] = await Container.get('shippingModeModel').findAll({
                where: {
                    deleted: false,
                },
            });
            return res.render(pageNames.shipping.viewList, {
                shippingModes,
            });
        } catch (e) {
            throw e;
        }
    });

    route.get(
    	`${routes.SHIPPING_MODE_ROOT}/add`, 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),    
    	async (req: Request, res: Response) => {
        try {
            return res.render(pageNames.shipping.addEdit, {
            });
        } catch (e) {
            throw e;
        }
    });

    route.get(
    		`${routes.SHIPPING_MODE_ROOT}/edit/:id`, 
    		middlewares.isAuth, 
    		middlewares.isAllowed(aclSection, 'global', 'edit'),    
    		async (req: Request, res: Response) => {
        try {
            const documentId = +req.params.id;
            const ShippingModeModel: ShippingModeService = Container.get(ShippingModeService);

            const { shippingMode } = await ShippingModeModel.findById(documentId);
            return res.render(pageNames.shipping.addEdit, {  
                shippingMode,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
        `${routes.SHIPPING_MODE_ROOT}/add`,
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),    
        celebrate({
            body: Joi.object({
                title: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response) => {
            const logger: any = Container.get('logger');
            logger.debug('Calling API new shipping mode with body: %o', req.body);

            try {
                const shippingModeItem: Partial<IShippingModeDTO> = {
                    title: req.body.title,
                };
                const ShippingModeModel: ShippingModeService = Container.get(ShippingModeService);
                await ShippingModeModel.create(shippingModeItem);
                return res.redirect(`${routes.ORDERS_ROOT}${routes.SHIPPING_MODE_ROOT}`);
            } catch (e) {
                logger.error('🔥 error: %o', e);
                throw e;
            }
        },
    );

    route.post(
        `${routes.SHIPPING_MODE_ROOT}/edit/:id`,
        celebrate({
            body: Joi.object({
                title: Joi.string().required(),
            }),
        }),
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),    
        async (req: Request, res: Response) => {
            const logger: any = Container.get('logger');
            logger.debug('Calling API new shipping mode with body: %o', req.body);

            try {
                const shippingModeItem: Partial<IShippingModeDTO> = {
                    title: req.body.title,
                };
                const id = +req.params.id;

                const ShippingModeModel: ShippingModeService = Container.get(ShippingModeService);
                await ShippingModeModel.update(id, shippingModeItem);
                return res.redirect(`${routes.ORDERS_ROOT}${routes.SHIPPING_MODE_ROOT}`);
            } catch (e) {
                logger.error('🔥 error: %o', e);
                throw e;
            }
        },
    );

    route.post(
    	`${routes.SHIPPING_MODE_ROOT}/delete/:id`, 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'delete'),    
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            const documentId = req.params.id;

            await Container.get(ShippingModeService).update(documentId, { deleted: true });

            return res.redirect(`${routes.ORDERS_ROOT}${routes.SHIPPING_MODE_ROOT}`);
        } catch (e) {
            logger.error('🔥 error: %o', e);
            throw e;
        }
    });


    /**
     * @description review routes
     */

    route.get(
    	routes.USER_REVIEW_ROOT, 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),    
    	async (req: Request, res: Response) => {
        try {
            const ShippingModeModel: any = Container.get('shippingModeModel');

            const shippingModes: IShippingMode[] = await ShippingModeModel.findAll({
                where: {
                    deleted: false,
                },
            });
            return res.render(pageNames.review.viewList, {
                shippingModes,
            });
        } catch (e) {
            throw e;
        }
    });
};
