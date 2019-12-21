import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import OrderService from '../../services/order';
import { IOrder, IOrderInputDTO } from '../../interfaces/IOrder';
import { celebrate, Joi, errors } from 'celebrate';
import middlewares from '../middlewares';
import UserService from '../../services/user'
import BoxService from '../../services/box'
const route = Router();

export default (app: Router) => {
	const ORDERS_ROOT = '/orders';

	app.use(ORDERS_ROOT, route);     
	
    route.post(
        '/confirm',
        middlewares.isAuth, 
		celebrate(
			{
				body: Joi.object(
					{
						deliveryMode: Joi.string(),
						userAdress: Joi.object(),
						box: Joi.number().integer(),       
						products: Joi.array().items(Joi.number()).allow(null)
					}
				),
			}),
		async (req: Request, res: Response, next: NextFunction) => {
			// Steps : 
			/*
			  [OK] 0. Load user
			  0.1 Check token amount
			  [OK] 1. Load box
			  [OK] 2. If box.products == 0; use products
			  [OK] 3. If box.products > 0; use box.products
			  [OK] 4. if use products; check for existence
			  [OK] 4.1. Grab profile from user
			  [OK] 5. Select Shipping Mode for user
			  [OK] 6. Select Shipping Adress for user 
			  [OK] 7. Create order
			  [OK] 8. Save order products
			
			*/
			const userId = req.user.id;
			const userAdress = req.body.userAdress;
			const boxId = req.body.box;
			const products = req.body.products;
			const deliveryMode = req.body.deliveryMode;
			
			const logger: any = Container.get('logger');
			const BoxModelService = Container.get(BoxService);
			const BoxProductModelService = Container.get('boxProductModel');
			const ProductService = Container.get('productModel');
			const UserModelService = Container.get(UserService);
			const OrderModelService = Container.get('orderModel');
			const OrderProductModelService = Container.get('productOrderModel');
			const ShippingModeModelService = Container.get('shippingModeModel');
			const ShippingAddressModelService = Container.get('shippingAddressModel')
			const UserProfileModelService = Container.get('profileModel');
			
			// Step 0 : Load User
			const localUser = await UserModelService.findById(userId);
			
			logger.debug("Local User : %o", localUser);
			
			if( !localUser )
			{
				throw Exception("No user.");
			}
			
			// Step 1 : Load box
			const {box} = await BoxModelService.findById(boxId);
			
			logger.debug("Local Box : %o", box);
			
			if( !box )
			{
				throw Exception('No box');
			}
			
			// Step 2 
			let boxProducts = await BoxProductModelService.findAll(
			  {
				where: {
            		boxId: box.id
          		},  
          		include: ['product'],
			  }
			);
			
			// Step 3 && Step 4
			if( boxProducts.length == 0 )
			{
				boxProducts = await ProductService.findAll({
					where: {
						id : products,
					}
				})
			}
			
			if( boxProducts.length == 0 )
			{
				throw Exception('No products');
			}
			
			// Step 4.1 : Get profile from user
			const localProfile = {
				name: userAdress.lastName,
				surname: userAdress.firstName,
				email: userAdress.emailAdress,
				userId: userId,
			};
			let userProfile = await UserProfileModelService.findAll({
				where: localProfile
			});
			
			logger.debug("Local Box : %o", userProfile);

			if( !userProfile || userProfile.length == 0 )
			{
				userProfile = await UserProfileModelService.create(localProfile);
			}
			else
			{
				userProfile = userProfile[0];
			}
			
			// Step 5 : Get Shipping Mode 
			const shippingData = { title : deliveryMode };
			
			let localShipping = await ShippingModeModelService.findAll({ where : shippingData });
			
			if( !localShipping || localShipping.length == 0 )
			{
				localShipping = await ShippingModeModelService.create(shippingData);
			}
			else
			{
				localShipping = localShipping[0];
			}
			
			// Step 6 : Get shipping adress for user
			const localAdress = {
				num: '',
				cp: '',
				city: '',
				concatenation: userAdress.adress,
				street: userAdress.adress,
				userId: userId,
			};
			let localUserAdress = await ShippingAddressModelService.findAll({ where : localAdress });
			
			if( !localUserAdress || localUserAdress.length == 0 )
			{
				localUserAdress = await ShippingAddressModelService.create(localAdress);
			}
			else
			{
				localUserAdress = localUserAdress[0];
			}
			
			// Step 7 : Create order
			const orderData = {
				sent: false,
				delivered: false,
				orderDate: new Date(),
				shippingModeId: localShipping.id,
				shippingAddressId: localUserAdress.id,
				profileId: userProfile.id,
				userId: userId,
				boxId: box.id
			}
			
			const order = await OrderModelService.create(orderData);
			
			
			// Step 8 : Create order products
			const _orderProducts = [];
			
			boxProducts.forEach(product => {
				_orderProducts.push({
					productId: product.productId,
					orderId: order.id,
					qty: ( product.qty ? product.qty : ( product.defaultQty ? product.defaultQty : null) ),
				})
			});
			
			await OrderProductModelService.bulkCreate(_orderProducts);
			
			
			logger.debug('Calling API newOrder endpoint with body: %o', req.body);
			
			const _jwt = middlewares.isAuth;
			logger.debug('CurrentUser : %o', req.user);
			
			return res.json().status(200);
			/*
			try {
				const orderItem: IOrderInputDTO = req.body;
				const OrderModel_Service: OrderService = Container.get(OrderService)
				const { order } = await OrderModel_Service.create(orderItem);
				return res.json({ order }).status(200);
			}
			catch (e) {
				logger.error('🔥 error: %o', e);
				return next(e);
			} */
		},
    );     
    
	app.use(errors());

};
