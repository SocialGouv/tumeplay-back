import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import OrderService from '../../services/order';
import { IOrder, IOrderInputDTO } from '../../interfaces/IOrder';
import { celebrate, Joi, errors } from 'celebrate';
import { Op } from 'sequelize';

import middlewares from '../middlewares';
import UserService from '../../services/user';
import BoxService from '../../services/box';
import AvailabilityZoneService from '../../services/availability.zone';
import ProductService from '../../services/product';
import MailerService from '../../services/mail';
import MondialRelayService from '../../services/mondial.relay';
import AddressValidatorService from '../../services/addressValidator';
import ColissimoService from '../../services/colissimo';
import Config from '../../config';

const route = Router();

export default (app: Router) => {
    const ORDERS_ROOT = '/orders';

    app.use(ORDERS_ROOT, route);
    
    route.get('/test-empty', async(req, res) => {
    	
    	const name = "sdfkjs sdfksd   ";
    	const first = name.trim();
        
        const { box } = await Container.get(BoxService).disableEmptyBoxes();
    	
		return res.json({'test' : first}).status(200);
    });
    
    route.get('/test-mail', async (req, res) => {
    	
    	const { availabilityZone } = await Container.get(AvailabilityZoneService).findByName(req.query.zone);
    	
    	return res.json({'users' : availabilityZone}).status(200);
    	
    	const supports = await Container.get(UserService).findByRole(req, Config.roles.orders_support);
    	
    	const { order } = await Container.get(OrderService).findByIdDetailled(4);
    	
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
		
		const datetime  = new Date(order.createdAt);
		const orderReference = datetime.getTime().toString() + '-' + order.id;
		
		const mondialRelay = Container.get(MondialRelayService);
				
		variables.labelFile = false;/*await mondialRelay.createRemoteLabel(
			orderReference, 
			order.profileFullName, 
			localProfile.email, 
			order.shippingModeText, 
			order.pickup,
			order.shipping
		);
		
		variables.labelFilename = variables.orderId + '-' + variables.boxId + ".pdf";
    	
    	*/
    	if( supports && supports.length > 0 )
    	{
    		supports.forEach( async (support) => {
    			await Container.get(MailerService).send(support.email, 'Nouvelle commande Tumeplay N°' + variables.orderId + '-' + variables.boxId, 'new_order_supplier', variables);
			}); 
    	}
    	
    	return res.json({'users' : supports}).status(200);
    	
    	await mailService.send('romain.petiteville@celaneo.com', 'Nouvelle commande effectuée ✔ - N°' +  variables.orderId, 'new_order_admin', variables);
	    //await mailService.send('contact@leroidelacapote.com', 'Nouvelle commande Tumeplay N°' + variables.orderId + '-' + variables.boxId, 'new_order_supplier', variables); 				
	    
	    
		return res.json({'test' : 'test'}).status(200);
    });
	route.post(
		'/is-allowed',
        middlewares.isAuth,
        celebrate({
            body: Joi.object({
                userAdress: Joi.object(),
                box: Joi.number().integer(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
        	const userId = req.user.id;
            const userAddress = req.body.userAdress;
            const boxId = req.body.box;
            const logger: any = Container.get('logger');
            const UserProfileModelService = Container.get('profileModel');
            const orderServiceInstance = Container.get(OrderService);
            
            let isAllowed = false;
            
            const localProfile = {
                name: userAddress.lastName,
                surname: userAddress.firstName,
                email: userAddress.emailAdress,
                userId: userId,
            };
            
            let userProfile = await UserProfileModelService.findOne({
                where: localProfile,
            });
            
            if( !userProfile )
            {
				isAllowed = true;
				
				userProfile = { id : 'N/A' };
            }
            else
            {
				const {isOrderAllowed} = await orderServiceInstance.isOrderAllowed(userId, boxId, userProfile);	
				
				isAllowed = isOrderAllowed;
            }
            
        	logger.debug('Testing user ' + userId + ' with profile '+ userProfile.id +' for box ' + boxId + ' : ' + isAllowed);
            
        	return res.json({isAllowed : isAllowed}).status(200);
		},
	);
	         
    route.post(
        '/confirm',
        middlewares.isAuth,
        celebrate({
            body: Joi.object({
                deliveryMode: Joi.string(),
                userAdress: Joi.object(),
                selectedPickup: Joi.object(),
                box: Joi.number().integer(),
                products: Joi.array()
                    .items(Joi.object())
                    .allow(null),
            }),
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
			  9.	Send email (@TODO-high : which contents to put in the email ? )
			
			*/
            const userId = req.user.id;
            const userAdress = req.body.userAdress;
            const boxId = req.body.box;
            const selectedPickup = req.body.selectedPickup;
            const products = req.body.products;
            const deliveryMode = req.body.deliveryMode;
            const localProducts = [];

            const logger: any = Container.get('logger');

            const productService = Container.get(ProductService);
                                                                          
            const OrderProductModelService = Container.get('productOrderModel');
            const ShippingModeModelService = Container.get('shippingModeModel');
            const ShippingAddressModelService = Container.get('shippingAddressModel');
            const UserProfileModelService = Container.get('profileModel');

            // Step -1 : Load zone if present
            let localZone = null;
            
            if( req.query && req.query.zone )
            {
				const { availabilityZone } = await Container.get(AvailabilityZoneService).findByName(req.query.zone);	
				
				if( availabilityZone )
				{
					localZone = availabilityZone.id;	
				}                                   
            }
            
            
            // Step 0 : Load User
            const localUser = await Container.get(UserService).findById(userId);

            logger.debug('Order confirmation - Request body : %o', JSON.stringify(req.body));
            if (!localUser) {
                throw Exception('No user.');
            }

            // Step 1 : Load box
            const { box } = await Container.get(BoxService).findById(req, boxId);

            if (!box) {
                throw Exception('No box');
            }

            // Step 2
            let boxProducts = await Container.get('boxProductModel').findAll({
                where: {
                    boxId: box.id,
                },
                include: ['product'],
            });

            // Step 3 && Step 4
            if (boxProducts.length == 0) {
                const productsIds = [];

                for (let i = 0; i < products.length; i++) {
                    productsIds.push(products[i].id);
                    localProducts[products[i].id] = products[i].qty;
                }

                const allProducts = await Container.get('productModel').findAll({
                    where: {
                        id: productsIds,
                    },
                });

                allProducts.forEach(function(product) {
                    boxProducts.push({
                        productId: product.id,
                        qty: localProducts[product.id],
                    });
                });
            }

            if (boxProducts.length == 0) {
                //throw Exception('No products');
            }

            // Step 4.1 : Get profile from user
            const localProfile = {
                name: userAdress.lastName,
                surname: userAdress.firstName,
                email: userAdress.emailAdress,
                userId: userId,
            };
            let userProfile = await UserProfileModelService.findOne({
                where: localProfile,
            });

            if (!userProfile || userProfile.length == 0) {
                userProfile = await UserProfileModelService.create(localProfile);
            }
            
            const {isOrderAllowed} = await Container.get(OrderService).isOrderAllowed(userId, boxId, userProfile);
            
            if( !isOrderAllowed )
            {
            	logger.debug('Order is not allowed. Aborting.');
				return res.json({success: false}).status(200);
            }

            // Step 5 : Get Shipping Mode
            const shippingData = { title: deliveryMode };

            let localShipping = await ShippingModeModelService.findOne({ where: shippingData });

            if (!localShipping || localShipping.length == 0) {
                localShipping = await ShippingModeModelService.create(shippingData);
            } 
            
		    let selectedZipCode = ( deliveryMode == 'pickup' ? selectedPickup.zipCode : userAdress.zipCode );
            if( !Container.get(AddressValidatorService).isZipCodeAllowed(selectedZipCode) )
            {
                logger.debug('Zipcode is not allowed. Aborting. ( testing ' + selectedZipCode + ' )' );
                return res.json({success: false}).status(200);
            }
			
			
			// Step 6 : Get shipping adress for user
            const localAdress = {
                num: '',
                cp: '',
                city: userAdress.city,
                concatenation: `${userAdress.zipCode},${userAdress.city},${userAdress.adress}`,
                street: userAdress.adress,
                streetMore: userAdress.adressMore,
                zipCode: userAdress.zipCode,
                phoneNumber: userAdress.phoneNumber,
                userId: userId,
            };
            let localUserAdress = await ShippingAddressModelService.findOne({ where: localAdress });

            if (!localUserAdress || localUserAdress.length == 0) {
                localUserAdress = await ShippingAddressModelService.create(localAdress);
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
                boxId: box.id,
                pickupId: deliveryMode == 'pickup' ? selectedPickup.id : null,                                 
            };

            const order = await Container.get('orderModel').create(orderData);

            if( localZone )
            {
				await Container.get(OrderService).bulkCreateZone([{ orderId: order.id, availabilityZoneId: localZone}]);	
            }
            
            // Step 8 : Create order products
            const _orderProducts = [];

            boxProducts.forEach( async (product) => {
                let localQuantity = null;
				let decreaseQty   = 1;
				if( localProducts[product.productId] )
				{
					logger.debug("Using local product qty : " + localProducts[product.productId]);
					localQuantity = localProducts[product.productId];
					decreaseQty	  = localQuantity;
				}
				else
				{
					if( product.qty )
					{
						logger.debug("Using product qty : " + product.qty);
						localQuantity = product.qty;
						decreaseQty	  = product.qty;
					}
					else
					{
						if( product.defaultQty )
						{
							logger.debug("Using default product qty : " + product.defaultQty);
							localQuantity = product.defaultQty;
						}
					}
				}
				
                _orderProducts.push({
                    productId: product.productId,
                    orderId: order.id,
                    qty: localQuantity,
                });
                
                await productService.decreaseStock(product.productId, decreaseQty);	

            });
            
            logger.debug("We have " + _orderProducts.length + " products.");
            
            await OrderProductModelService.bulkCreate(_orderProducts);

            // Step 9. Send email (confirmation of order)
            var orderId = order.id;
            try {
                const mailService = Container.get(MailerService);
				const orderServiceInstance = Container.get(OrderService);
				
				const { order } = await orderServiceInstance.findByIdDetailled(orderId);
				console.log(order);
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
		        
				await mailService.send(localProfile.email, 'Commande effectuée ✔', 'new_order_user', variables);
				
				const datetime  = new Date(order.createdAt);
				const orderReference = datetime.getTime().toString() + '-' + order.id;
				
				if( Config.environment == 'prod' )
				{
					if( order.shippingModeText == 'pickup' )
					{
						const mondialRelay = Container.get(MondialRelayService);
								
						variables.labelFile = await mondialRelay.createRemoteLabel(
							orderReference, 
							order.profileFullName, 
							localProfile.email, 
							order.shippingModeText, 
							order.pickup,
							order.shipping
						);
						
						variables.labelFilename = variables.orderId + '-' + variables.boxId + ".pdf";
					}
					else
					{
						const colissimo = Container.get(ColissimoService);
						
						variables.labelFile = await colissimo.createLabel(
							orderReference,
							variables.firstName,
							variables.name,
							variables.email,
							variables.shippingAddress
						);
						
						variables.labelFilename = variables.orderId + '-' + variables.boxId + ".csv";
					}
					
					//await mailService.send('contact.tumeplay@fabrique.social.gouv.fr', 'Nouvelle commande effectuée ✔ - N°' +  variables.orderId, 'new_order_admin', variables);
	                //await mailService.send('contact@leroidelacapote.com', 'Nouvelle commande Tumeplay N°' + variables.orderId + '-' + variables.boxId, 'new_order_supplier', variables); 				
				}
				
				if( localZone )
				{
					const criterias = {
						where: { 
							roles: { [Op.like]:  '%'+Config.roles.orders_support+'%' }
						},
						include: [{
		                    association: 'availability_zone',
		                    where: { id : localZone }   
		                }]
					};
					
		            const supports = await Container.get(UserService).findAll(req, criterias);
		            if( supports && supports.length > 0 )
    				{
    					supports.forEach( async (support) => {
    						await Container.get(MailerService).send(support.email, 'Nouvelle commande Tumeplay N°' + variables.orderId + '-' + variables.boxId, 'new_order_supplier', variables);
						}); 
    				}
			    }
            } catch (err) {
                console.error(err); // TODO-low: should we notify in case of error here ?
            }

            return res.json({success: true}).status(200);
        },
    );

    app.use(errors());
};
