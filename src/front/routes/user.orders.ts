import { Router, Request, Response } from 'express';
import { Container } from 'typedi';

import middlewares from '../middlewares';

import UserService from '../../services/user';
import AuthService from '../../services/auth';

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
                await handleZones(order.id, targetZones);
                    
                await handleOrderProducts(req.body, order.id);
                
                
                req.session.flash = {msg: "La commande a bien été mise à jour.", status: true};
                              
                return res.redirect('/user/orders' + ( _ownOrders ? "?ownorders" : ""));
            } catch (e) {
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
                await releaseProductsStocks(orderProducts);
                
                await Container.get('productOrderModel').destroy({
                    where: {
                        orderId: id,
                    },
                });                
                await handleOrderProducts(req.body, id);
                
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
					await handleZones(id, targetZones);	
                }                                      
                
                req.session.flash = {msg: "La commande a bien été mise à jour.", status: true};
                              
                return res.redirect('/user/orders' + ( _ownOrders ? "?ownorders" : ""));
            } catch (e) {
                logger.error('🔥 error: %o', e);
                throw e;
            }
        },
    );
    
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
                        qty: ( bodyRequest.qty[index] != "" ? bodyRequest.qty[index] : null ) 
                    });
                    
                    if( bodyRequest.qty[index] != "" )
                    {
						await productService.decreaseStock(item, bodyRequest.qty[index]);    	
                    }
                    

                }                                                                
            });
            
            await  Container.get('productOrderModel').bulkCreate(_orderProducts);
        }
    }
    
    
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
					item.phoneNumber,
					item.shippingAddressConcatenation,
					item.hasPersonalInformations ? item.personalInformations.age 		: "",
					item.hasPersonalInformations ? item.personalInformations.sexe 		: "",
					item.hasPersonalInformations ? item.personalInformations.city 		: "",
					item.hasPersonalInformations ? item.personalInformations.house 	: "",
					item.hasPersonalInformations ? item.personalInformations.scolarity : "",
					item.hasPersonalInformations ? item.personalInformations.custom 	: "",
					item.hasPersonalInformations ? item.personalInformations.comment 	: "",
					item.delivered ? "Livrée" : "",
				]
			});
			
			const headers = [
				"Num",
				"Date",
				"Box commandée",
				"Prénom",
				"Nom",
				"E-Mail",
				"Téléphone",
				"Adresse de livraison",
				"Age",
				"Sexe",
				"Ville",
				"Habitation",
				"Scolarité",
				"Custom",
				"Commentaire",
				"Livrée"
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
