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
const route = Router();

export default (app: Router) => {
    const routes = {
        ORDERS_ROOT: '/orders',
        ORDER_MANAGEMENT_ROOT: '/management',
        SHIPPING_MODE_ROOT: '/shipping-mode',
    };

    const pageNames = {
        shipping: {
            viewList: 'page-shipping-mode',
            addEdit: 'page-shipping-mode-edit',
        },
        orderManagement: {
            viewList: 'page-order-management',
            addEdit: 'page-order-management-edit',
        },
    };

    app.use(routes.ORDERS_ROOT, route);

    /**
     * @description Order management routes
     */

    route.get(`${routes.ORDER_MANAGEMENT_ROOT}/export/csv`, middlewares.isAuth, async (req: Request, res: Response) => {
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
    
    route.get(routes.ORDER_MANAGEMENT_ROOT, middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const OrderModel_service: OrderService = Container.get(OrderService);

            const { orders } = await OrderModel_service.findAllOrdersMainView();
            return res.render(pageNames.orderManagement.viewList, {
                username: req['session'].name,
                orders,
            });
        } catch (e) {
            throw e;
        }
    });

    route.get(`${routes.ORDER_MANAGEMENT_ROOT}/edit/:id`, middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const documentId = +req.params.id;
            const orderModelService: OrderService = Container.get(OrderService);

            const { order } = await orderModelService.findByIdDetailled(documentId);
            return res.render(pageNames.orderManagement.addEdit, {
                username: req['session'].name,
                order,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
        `${routes.ORDER_MANAGEMENT_ROOT}/edit/:id`,
        middlewares.isAuth,
        celebrate({
            body: Joi.object({
                sent: Joi.string().allow(null),
                delivered: Joi.string().allow(null),
            }),
        }),
        async (req: Request, res: Response) => {
            const logger: any = Container.get('logger');
            logger.debug('Calling Front edit order with body: %o', req.body);

            try {
                const orderInput: Partial<IOrderInputDTO> = {
                    sent: req.body.sent ? req.body.sent === 'on' : false,
                    delivered: req.body.delivered ? req.body.delivered === 'on' : false,
                };
                const id = +req.params.id;

                const orderModelService: OrderService = Container.get(OrderService);
                await orderModelService.update(id, orderInput);
                return res.redirect(`${routes.ORDERS_ROOT}${routes.ORDER_MANAGEMENT_ROOT}/edit/${id}`);
            } catch (e) {
                logger.error('🔥 error: %o', e);
                throw e;
            }
        },
    );
    

    route.post(`${routes.ORDER_MANAGEMENT_ROOT}/delete/:id`, middlewares.isAuth, async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Delete Order endpoint with body: %o', req.body);

        try {
            const orderId = req.params.id;

            const orderInput: Partial<IOrderInputDTO> = {
                deleted: true,
                updatedAt: new Date(),
            };
            
            const orderModelService: OrderService = Container.get(OrderService);
            await orderModelService.update(orderId, orderInput);
            
            const productService: ProductService = Container.get(ProductService);
            const productOrderService: ProductOrderService = Container.get(ProductOrderService);
            
            const { orderProducts } = await productOrderService.findByOrder(orderId);
            
            logger.debug("Got " + orderProducts.length + " item to increase.");
            
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

    route.get(routes.SHIPPING_MODE_ROOT, middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const ShippingModeModel: any = Container.get('shippingModeModel');

            const shippingModes: IShippingMode[] = await ShippingModeModel.findAll({
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

    route.get(`${routes.SHIPPING_MODE_ROOT}/add`, middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            return res.render(pageNames.shipping.addEdit, {
                username: req['session'].name,
            });
        } catch (e) {
            throw e;
        }
    });

    route.get(`${routes.SHIPPING_MODE_ROOT}/edit/:id`, middlewares.isAuth, async (req: Request, res: Response) => {
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

    route.post(`${routes.SHIPPING_MODE_ROOT}/delete/:id`, middlewares.isAuth, async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            const documentId = req.params.id;

            // Updating
            const shippingModeService: ShippingModeService = Container.get(ShippingModeService);
            await shippingModeService.update(documentId, { deleted: true });
            return res.redirect(`${routes.ORDERS_ROOT}${routes.SHIPPING_MODE_ROOT}`);
        } catch (e) {
            logger.error('🔥 error: %o', e);
            throw e;
        }
    });
};
