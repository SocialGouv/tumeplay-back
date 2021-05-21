import { Router, Request, Response } from 'express';
import { Container } from 'typedi';

import pug from 'pug';
import middlewares from '../middlewares';

import UserService 		from '../../services/user';
import UserBoxsService 	from '../../services/user.boxs';
import AuthService 		from '../../services/auth';

import ExportGeneratorService from '../../services/export.generator';
import DateFormatterService from '../../services/date.formatter';

import UserOrderService from '../../services/user.order';
import OrderService from '../../services/order';

import ProductService from '../../services/product';
import ProductOrderService from '../../services/product.order';

import PoiService from '../../services/poi';
import BoxService from '../../services/box';


const route = Router();

export default (app: Router) => {
	const aclSection = 'orders';

	app.use('/user/boxs', route);


	route.get('/', 
		middlewares.isAuth,    	
		async (req: Request, res: Response) => {
			try {
				const ownOrders	  = ( typeof req.query.ownorders !== "undefined" );
				const archivedOrders = ( typeof req.query.archivedorders !== "undefined" );
				
                const userOrders = await Container.get(UserOrderService).getUserOrders(req, true);
				const userStocks = await Container.get(UserBoxsService).getUserStocks(req, req.session.user.id, userOrders);
				
				const userResupplies = await Container.get(UserBoxsService).getUserResupplies(req, req.session.user.id, archivedOrders);
				
				const boxs   = await Container.get(BoxService).findAll(req, {
					where: {
						deleted: false,
					},
				});
				//console.log(userResupplies[0].boxs);

				return res.render('page-user-boxs', {
					user: req.session.user,
					orders: userOrders,
					ownOrders,
					archivedOrders,
					userResupplies, 
					userStocks,
					boxs
				});
			} catch (e) {
				throw e;
			}
		}
	);

	route.post(
		'/order-supply/products',
		middlewares.isAuth,    	
		async (req: Request, res: Response) => {
			try {
				const boxs   = await Container.get(BoxService).findAll(req, {
					where: {
						deleted: false,
					},
				});
				
				const products   = await Container.get(ProductService).findAll(req, {
					where: {
						deleted: false,
						isComSupport: true,
					},
				});
				
				const _html = await pug.renderFile(__dirname + '/../../pug/forms/user-boxs/_form.products.pug', {boxs, products});
				
				return res.json({form : _html});
			} catch (e) {
				throw e;
			}
		}  
	);

	route.post(
		'/order-supply/shipping',
		middlewares.isAuth,    	
		async (req: Request, res: Response) => {
			try {
				const products	 = req.body;
				const lastSupply = await Container.get(UserBoxsService).getLastUserResupply(req, req.session.user.id);
                console.log(req.body);
                const _html = await pug.renderFile(__dirname + '/../../pug/forms/user-boxs/_form.shipping.pug', {
					user: 		req.session.user,
					products64: Buffer.from(JSON.stringify(products)).toString('base64'), // Avoid messing with JSON ..
					lastSupply
                });
                
                return res.json({form : _html});
			} catch (e) {
				throw e;
			}
		}
	);

	route.post(
		'/order-supply/summary',
		middlewares.isAuth,    	
		async (req: Request, res: Response) => {
			try {
				const products = JSON.parse(Buffer.from(req.body.products, 'base64').toString('ascii'));
				const shipping = req.body;
				
				shipping.products = products; // Invert from B64 to clear : would be converted again later, avoid double encoded
				
				const loadProducts = await loadItemsFromForm(shipping.products);
				                        
				const _html = await pug.renderFile(__dirname + '/../../pug/forms/user-boxs/_form.summary.pug', {
					user: req.session.user,
					products,
					shipping,
					loadProducts,
					shipping64 : Buffer.from(JSON.stringify(shipping)).toString('base64'),
                });
                
                return res.json({form : _html});
			} catch (e) {
				throw e;
			}
		}
	);

	route.post(
		'/order-supply/confirm',
		middlewares.isAuth,    	
		async (req: Request, res: Response) => {
			try {

				const data  	= JSON.parse(Buffer.from(req.body.data, 'base64').toString('ascii'));				
				const products 	= await loadItemsFromForm(data.products);
				
				data.userId = req.session.user.id;
				
				await saveResupplyDemand(data, products);
				
				const _html = await pug.renderFile(__dirname + '/../../pug/forms/user-boxs/_form.confirm.pug', {
					user: req.session.user,
                });
                
                return res.json({form : _html});
			} catch (e) {
				throw e;
			}
		}  
	);
	
	const saveResupplyDemand = async(shipping, products) => {
		const resupply = await Container.get(UserBoxsService).saveUserResupply(shipping);	
		await Container.get(UserBoxsService).saveUserResupplyItems(resupply.id, products);	
	}
	
	const loadItemsFromForm = async (products) => 
	{
		var _return = {"products" : [], "boxs" : []};
		
		if( !products || products.length == 0 )
		{
			return false;
		}                             
		
		for ( const index in products )
		{
			const item = products[index];
			
			if( item != 0 )
			{
				console.log("NEW TEST " + index);
				
				if( index.indexOf("box_") !== -1 && item != 0 )	
				{
					const {box} = await Container.get(BoxService).findById(null, index.substr(4), false);
					
					_return.boxs.push({
						id : box.id,
						title: box.title,
						qty: item,
					})
				}
				else
				{
					const {product} = await Container.get(ProductService).findById(null, index.substr(8), false);
					
					_return.products.push({
						id : product.id,
						title: product.title,
						qty: item,
					})	
				}
			}
		}
		    
		console.log(_return);
		
		return _return;
	}

	route.get('/add', 
		middlewares.isAuth,    	
		async (req: Request, res: Response) => {
			try {
				const _ownOrders = ( typeof req.query.ownorders !== "undefined" );

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

				return res.render('page-user-orders-edit', {
					user: req.session.user,
					ownOrders : _ownOrders,
					action: '/user/boxs',
					zones,
					pois,
					boxs,
					products
				});
			} catch (e) {
				throw e;
			}
	});


	route.post(
		'/add',
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

				const shippingData = { title: 'pickup' };
				const localShipping = await Container.get('shippingModeModel').findOne({ where: shippingData });
				const localPoi 		= await Container.get('poiModel').findOne({where: {id: req.body.selectedPickup}})

				let localProfile = {
					name: "",
					surname: req.body.firstName,
					email: "",
					userId: req.session.user.id,
				};

				localProfile = await  Container.get('profileModel').create(localProfile);



				let localUserAdress = {
					num: '',
					cp: '',
					city: localPoi.city,
					concatenation: `${localPoi.zipCode},${localPoi.city},${localPoi.adress}`,
					street: localPoi.adress,
					streetMore: localPoi.adressMore,
					zipCode: localPoi.zipCode,
					phoneNumber: req.body.phoneNumber,
					userId: req.session.user.id,
				};

				localUserAdress = await  Container.get('shippingAddressModel').create(localUserAdress);

				const orderData = {
					userId			: req.session.user.id,
					boxId			: req.body.selectedBox,
					pickupId		: req.body.selectedPickup ? req.body.selectedPickup : null,
					sent			: req.body.sent ? req.body.sent === 'on' : false,
					delivered		: req.body.delivered ? req.body.delivered === 'on' : false,
					orderDate		: new Date(),
					shippingModeId	: localShipping.id,
					shippingAddressId: localUserAdress.id,
					profileId		: localProfile.id,
				};


				const order = await Container.get('orderModel').create(orderData);

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
				await Container.get(OrderService).handleZones(order.id, targetZones);

		        await Container.get(OrderService).handleOrderProducts(req.body, order.id);

				req.session.flash = {msg: "La commande a bien été mise à jour.", status: true};

				return res.redirect('/user/boxs' + ( _ownOrders ? "?ownorders" : ""));
			} catch (e) 
			{
				logger.error('🔥 error: %o', e);
				throw e;
			}
		},
	);                         

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


			const products = await Container.get(ProductService).findAll(req, {
				where: {
					deleted: false,
				},
			});


			return res.render('page-user-orders-edit', {
				order,
				zones: false,
				action: '/user/boxs',
				products,
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


				const { orderProducts } = await Container.get(ProductOrderService).findByOrder(id);
				await Container.get('productOrderModel').destroy({
					where: {
						orderId: id,
					},
				});                
				await Container.get(OrderService).handleOrderProducts(req.body, id);

			const zones 	= await Container.get(UserService).getAllowedZones(req);
			let targetZones = [];
			if( zones && zones.length == 1 )
			{
				targetZones = [zones[0].id];
			}   
			else
			{
				targetZones = req.body.zoneId;
			}                                                                                                                                                             

			if( targetZones )
			{
				await Container.get(OrderService).handleZones(id, targetZones);	
			}                                      

			req.session.flash = {msg: "La commande a bien été mise à jour.", status: true};

			return res.redirect('/user/boxs' + ( _ownOrders ? "?ownorders" : ""));
		} catch (e) {
			logger.error('🔥 error: %o', e);
			throw e;
		}
		},
	);
      

	route.get('/order-supply/ajax/set-delivered/:supplyId', 
		middlewares.isAuth, 
		async (req: any, res: Response) => {
			const logger: any = Container.get('logger');
			logger.debug('Calling set delivered with body: %o', req.body);

			try {
				const supplyId = req.params.supplyId;
				let userOrder = await Container.get(UserBoxsService).markAsDelivered(req, supplyId);

				if( userOrder )
				{
					// Increase stocks !
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
				let userOrder = await Container.get(UserBoxsService).getOrderPersonalInformations(req, orderId);
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
				let isFilled 	  = false;
				const localData   = req.body.data;
				const globalOrder = await Container.get(UserOrderService).getUserOrder(req, localData.orderId);

				if( globalOrder )
				{
					let userOrder = await Container.get(UserOrderService).getOrderPersonalInformations(req, localData.orderId);

					await Container.get(UserOrderService).handleOrderPersonalInformations(req.session.user.id, userOrder, localData);

					isFilled = Container.get(UserOrderService).isPersonalInformationsFilled(localData);
				}

				return res.json({success : true, filled: isFilled}).status(200);
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




	route.post(
		'/delete/:id', 
		middlewares.isAuth, 
		middlewares.isAllowed(aclSection, 'global', 'delete'),    
		async (req: any, res: Response) => {
			const logger: any = Container.get('logger');
			logger.debug('Calling Front Delete Order endpoint with body: %o', req.body);

			try {
				const orderId = req.params.id;

				const orderInput: Partial<IOrderInputDTO> = {
					deleted: true,
					updatedAt: new Date(),
				};

				const _ownOrders = ( typeof req.query.ownorders !== "undefined" );

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

			return res.redirect('/user/orders' + ( _ownOrders ? "?ownorders" : "") );
		} catch (e) {
			throw e;
		}
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
