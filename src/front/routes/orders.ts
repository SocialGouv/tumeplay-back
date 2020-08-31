import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { IOrder, IOrderMainView, IOrderInputDTO } from '../../interfaces/IOrder';
import { IShippingMode, IShippingModeDTO } from '../../interfaces/IShippingMode';
import ShippingModeService from '../../services/shipping.mode';
import { celebrate, Joi } from 'celebrate';
import middlewares from '../middlewares';
import OrderService from '../../services/order';
import ExportGeneratorService from '../../services/export.generator';
import DateFormatterService from '../../services/date.formatter';
import ProductService from '../../services/product';
import ProductOrderService from '../../services/product.order';
import UserService from '../../services/user';
import { IOrderZoneDTO } from '../../interfaces/IOrderZone';
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
			
			const  dbOrders		= await orderModel.findAll({ include: ['shippingAddress', 'profile']});
			
			const orders = dbOrders.map(item => {
				const dateObject = new Date(item.orderDate);
				const date 		 = dateService.format(item.orderDate);
				
				return [
					item.id,
					date.day + "/" + date.month + "/" + date.year,
					item.boxId,
					item.profile.name,
					item.profile.surname,
					item.profile.email,
				]
			});
			
			const headers = [
				"Num",
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
                username: req['session'].name,
                orders,
                zones
            });
        } catch (e) {
            throw e;
        }
    });

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
                
                return res.render(pageNames.orderManagement.addEdit, {
                    username: req['session'].name,
                    order,
                    zones
                });
            } catch (e) {
                throw e;
            }
        },
    );
    const handleZones = async (currentOrder, zoneId) => {
        const OrderServiceInstance = Container.get(OrderService);

        await OrderServiceInstance.bulkDeleteZone(currentOrder);

        zoneId = typeof zoneId != 'undefined' && Array.isArray(zoneId) ? zoneId : [zoneId];
        var filteredZones = zoneId.filter(function(el) {
            return el != 0;
        });
        let zonesItems: IOrderZoneDTO[] = filteredZones.map(zoneItem => {
            return {
                orderId: currentOrder,
                availabilityZoneId: zoneItem,
            };
        });

        if (zonesItems.length > 0) {
            // Creating zones
            await OrderServiceInstance.bulkCreateZone(zonesItems);
        }
    };
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
                
                await handleZones(id, targetZones);
                
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
            
            if( orderProducts && orderProducts.length > 0 )
            {
				for( let i = 0; i < orderProducts.length; i++ )
				{
					const product = orderProducts[i];
					await productService.increaseStock(product.productId, product.qty); 
				}
            }
            
            return res.redirect(routes.ORDERS_ROOT + routes.ORDER_MANAGEMENT_ROOT);
        } catch (e) {
            throw e;
        }
    });

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
                username: req['session'].name,
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
                username: req['session'].name,
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
                username: req['session'].name,
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
                username: req['session'].name,
                shippingModes,
            });
        } catch (e) {
            throw e;
        }
    });
};
