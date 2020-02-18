import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import OrderService from '../../services/order';
import { IOrder, IOrderInputDTO } from '../../interfaces/IOrder';
import { celebrate, Joi, errors } from 'celebrate';
import middlewares from '../middlewares';
import UserService from '../../services/user';
import BoxService from '../../services/box';
import MailerService from '../../services/mail';
import MondialRelayService from '../../services/mondial.relay';

const route = Router();

export default (app: Router) => {
    const ORDERS_ROOT = '/orders';

    app.use(ORDERS_ROOT, route);
           
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
            const BoxModelService = Container.get(BoxService);
            const BoxProductModelService = Container.get('boxProductModel');
            const ProductService = Container.get('productModel');
            const UserModelService = Container.get(UserService);
            const OrderModelService = Container.get('orderModel');
            const OrderProductModelService = Container.get('productOrderModel');
            const ShippingModeModelService = Container.get('shippingModeModel');
            const ShippingAddressModelService = Container.get('shippingAddressModel');
            const UserProfileModelService = Container.get('profileModel');

            // Step 0 : Load User
            const localUser = await UserModelService.findById(userId);

            logger.debug('Local User : %o', localUser);

            logger.debug('Order confirmation - Request body : %o', JSON.stringify(req.body));
            if (!localUser) {
                throw Exception('No user.');
            }

            // Step 1 : Load box
            const { box } = await BoxModelService.findById(boxId);

            if (!box) {
                throw Exception('No box');
            }

            // Step 2
            let boxProducts = await BoxProductModelService.findAll({
                where: {
                    boxId: box.id,
                },
                include: ['product'],
            });

            // Step 3 && Step 4
            if (boxProducts.length == 0) {
                const productsIds = [];

                logger.debug('PRODUCTS  : %o', products);
                for (let i = 0; i < products.length; i++) {
                    productsIds.push(products[i].id);
                    localProducts[products[i].id] = products[i].qty;
                }

                logger.debug('ProductIDS : %o', localProducts);
                logger.debug('ProductIDS 2 : %o', productsIds);

                const allProducts = await ProductService.findAll({
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
                where: localProfile,
            });

            logger.debug('Local Box : %o', userProfile);

            if (!userProfile || userProfile.length == 0) {
                userProfile = await UserProfileModelService.create(localProfile);
            } else {
                userProfile = userProfile[0];
            }

            // Step 5 : Get Shipping Mode
            const shippingData = { title: deliveryMode };

            let localShipping = await ShippingModeModelService.findAll({ where: shippingData });

            if (!localShipping || localShipping.length == 0) {
                localShipping = await ShippingModeModelService.create(shippingData);
            } else {
                localShipping = localShipping[0];
            }

            // Step 6 : Get shipping adress for user
            const localAdress = {
                num: '',
                cp: '',
                city: userAdress.city,
                concatenation: `${userAdress.zipCode},${userAdress.city},${userAdress.adress}`,
                street: userAdress.adress,
                zipCode: userAdress.zipCode,
                userId: userId,
            };
            let localUserAdress = await ShippingAddressModelService.findAll({ where: localAdress });

            if (!localUserAdress || localUserAdress.length == 0) {
                localUserAdress = await ShippingAddressModelService.create(localAdress);
            } else {
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
                boxId: box.id,
                pickupId: deliveryMode == 'pickup' ? selectedPickup.id : null,
            };

            const order = await OrderModelService.create(orderData);

            // Step 8 : Create order products
            const _orderProducts = [];

            boxProducts.forEach(product => {
                logger.debug('Local Box : %o', product);

                _orderProducts.push({
                    productId: product.productId,
                    orderId: order.id,
                    qty: localProducts[product.productId]
                        ? localProducts[product.productId]
                        : product.qty
                        ? product.qty
                        : product.defaultQty
                        ? product.defaultQty
                        : null,
                });
            });

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
		        };
		        
				await mailService.send(localProfile.email, 'Commande effectuée ✔', 'new_order_user', variables);
				
				
				if( order.shippingModeText == 'pickup' )
				{
					const mondialRelay = Container.get(MondialRelayService);
					const datetime  = new Date(order.createdAt);
		
					const labelFile = await mondialRelay.createRemoteLabel(datetime.getTime().toString() + '-' + order.id, order.profileFullName, order.pickup);
					
					variables.labelFile = labelFile;
				}
				
				await mailService.send('contact.tumeplay@fabrique.social.gouv.fr', 'Nouvelle commande effectuée ✔', 'new_order_admin', variables);
                await mailService.send('info@leroidelacapote.com', 'Nouvelle commande Tumeplay N°' + variables.orderId + '-' + variables.boxId, 'new_order_supplier', variables); 				

            } catch (err) {
                console.error(err); // TODO-low: should we notify in case of error here ?
            }

            return res.json().status(200);
        },
    );

    /**
     * @todo: delete below when finished (RND)
     */
    route.post('/sendMockEmailTest', async (req: Request, res: Response, next: NextFunction) => {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing

        // create reusable transporter object using the default SMTP transport

        return res.json(info).status(200);
    });

    app.use(errors());
};
