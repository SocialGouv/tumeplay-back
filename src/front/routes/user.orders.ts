import { Router, Request, Response } from 'express';
import { Container } from 'typedi';

import middlewares from '../middlewares';

import UserService from '../../services/user';
import AuthService from '../../services/auth';

import ExportGeneratorService from '../../services/export.generator';
import DateFormatterService from '../../services/date.formatter';

import UserOrderService from '../../services/user.order';
import OrderService from '../../services/order';

const route = Router();

export default (app: Router) => {
    const aclSection = 'orders';
    
    app.use('/user/orders', route);
                  
    
    route.get('/', 
    	middlewares.isAuth,    	
    	async (req: Request, res: Response) => {
        try {
        	const _ownOrders = ( typeof req.query.ownorders !== "undefined" );
        	
        	const userOrders = await Container.get(UserOrderService).getUserOrders(req, _ownOrders);
        	      
            return res.render('page-user-orders', {
                user: req.session.user,
                orders: userOrders,
                ownOrders : _ownOrders,
            });
        } catch (e) {
            throw e;
        }
    });
    
    route.get(
        '/edit/:id',
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),
        async (req: Request, res: Response) => {
            try {
                const documentId = +req.params.id;
                const zones 	 = await Container.get(UserService).getAllowedZones(req);
                const _ownOrders = ( typeof req.query.ownorders !== "undefined" );                                                  
                const { order }  = await Container.get(OrderService).findByIdDetailled(documentId);
                
                order.zoneIds = order.availability_zone.map(item => {
					return item.id;
	            });    
                
                return res.render('page-user-orders-edit', {
                    order,
                    zones: false,
                    ownOrders : _ownOrders,
                });
            } catch (e) {
                throw e;
            }
        },
    )
    
    route.post(
        '/edit/:id',
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),    
        async (req: Request, res: Response) => {
            const logger: any = Container.get('logger');
            logger.debug('Calling Front edit order with body: %o', req.body);

            try {
                const orderInput: Partial<IOrderInputDTO> = {
                    sent: req.body.sent ? req.body.sent === 'on' : false,
                    delivered: req.body.delivered ? req.body.delivered === 'on' : false,
                };
                
                const id = +req.params.id;
                const _ownOrders = ( typeof req.query.ownorders !== "undefined" );
                
                await Container.get(OrderService).update(id, orderInput);
                
                req.session.flash = {msg: "La commande a bien été mise à jour.", status: true};
                              
                return res.redirect('/user/orders' + ( _ownOrders ? "?ownorders" : ""));
            } catch (e) {
                logger.error('🔥 error: %o', e);
                throw e;
            }
        },
    );
                    
    route.get('/stocks', 
    	middlewares.isAuth,
    	async (req: Request, res: Response) => {
    	try
    	{
    		const userProducts = await Container.get(UserOrderService).getUserProducts(req, req.session.user.id);
    		/*const zones    = await Container.get(UserService).getAllowedZones(req);
            const products = await Container.get(ProductService).findAll(req, {
                where: {
                    deleted: false,
                },
                include: ['picture', 'availability_zone'],
            });
            */
		    return res.render('page-user-stocks', {
		    	products: userProducts,
                user: req.session.user,
            });
        } catch (e) {
            throw e;
        }
    });
    
    route.get('/ajax/set-delivered/:orderId', 
    	middlewares.isAuth, 
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling set delivered with body: %o', req.body);

        try {
        	const orderId = req.params.orderId;
			let userOrder = await Container.get(OrderService).markAsDelivered(req, orderId);
			
			if( userOrder )
			{
				const order = await Container.get(OrderService).findOne(req, {where: {id: orderId}, include: ['products']});
				
				if( order )
				{
					for( const productId in order.products )
					{
						let product = order.products[productId].product_order;
						console.log(product);
						await Container.get(UserOrderService).decreaseStock(product.productId, product.qty);	
					}
				}
				
			}                               
			
            return res.json({success : true}).status(200);
        } catch (e) {
            throw e;
        }
    });
    
    route.get('/ajax/get-informations/:orderId', 
    	middlewares.isAuth, 
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling get informations endpoint with body: %o', req.body);

        try {
        	const orderId = req.params.orderId;
			let userOrder = await Container.get(UserOrderService).getOrderPersonalInformations(req, orderId);
			console.log(orderId);
			console.log(userOrder);
            return res.json({success : true, order: userOrder}).status(200);
        } catch (e) {
            throw e;
        }
    });
    
    route.post('/ajax/update-informations', 
    	middlewares.isAuth, 
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Update inforamtions endpoint with body: %o', req.body);

        try {
        	const localData   = req.body.data;
        	const globalOrder = await Container.get(UserOrderService).getUserOrder(req, localData.orderId);
        	
        	if( globalOrder )
        	{
				let userOrder = await Container.get(UserOrderService).getOrderPersonalInformations(req, localData.orderId);
				                               
				await Container.get(UserOrderService).handleOrderPersonalInformations(req.session.user.id, userOrder, localData);
			
        	}

            return res.json({success : true}).status(200);
        } catch (e) {
            throw e;
        }
    });
    
                                                                                
    route.get('/ajax/update-stock/:productId/:newStock', 
    	middlewares.isAuth, 
    	async(req: Request, res: Response) => {
    	try
    	{
    		const productId = req.params.productId;
    		const newStock  = req.params.newStock;
    		
			console.log("Entering");
			
        	await Container.get(UserOrderService).updateUserProductStock(req, req.session.user.id, productId, newStock);
        	
        	req.session.flash = {msg: "Le stock a bien été mis à jour.", status: true};
        	
        	return res.json({success: true, newStock: newStock});
		}
		catch(e)
		{
			
		}
            
        return res.json({success: false});
    });
    
    
    route.get(
    	'/export/csv', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
    	try {
    		let _ownOrders 		= ( typeof req.query.ownorders !== "undefined" );
    		const logger: any 	= Container.get('logger');
    		              
    		const dateService   = Container.get(DateFormatterService);
			const exportService = Container.get(ExportGeneratorService);	
			              
			const  dbOrders		= await Container.get(UserOrderService).getUserOrders(req, _ownOrders);
			
			const orders = dbOrders.map(item => {
				const dateObject = new Date(item.orderDate);
				const date 		 = dateService.format(item.orderDate);
				
				return [
					item.id,
					date.day + "/" + date.month + "/" + date.year,
					item.box.title,
					item.profileName,
					item.profileSurname,
					item.profileEmail,
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
			              
			const { tmpFile }   = await exportService.generateCsv(orders);
			
			const date  = dateService.format(new Date());
			
			res.download(tmpFile, 'Export-Commandes-' + date.year + date.month + date.day + '.csv');
    	}
    	catch(e) {
			console.log(e);	
    	}
	});
    
    
};
