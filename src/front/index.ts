import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Op } from 'sequelize';

import AuthService from '../services/auth';
import BoxService from '../services/box';
import ContentService from '../services/content';
import OrderService from '../services/order';
import ProductService from '../services/product';
import AclService from '../services/acl';
import UserOrderService from '../services/user.order';

import { celebrate, Joi } from 'celebrate';
import path from 'path';

import contents from './routes/contents';
import quizzs from './routes/quizzs';
import thematiques from './routes/thematiques';
import pictures from './routes/pictures';
import products from './routes/products';
import orders from './routes/orders';
import profiles from './routes/profiles';
import boxs from './routes/boxs';
import sync from './routes/sync';
import poi from './routes/poi';
import contacts from './routes/contacts';
import feedback from './routes/feedback';
import zones from './routes/zones';
import user from './routes/user';
import userOrders from './routes/user.orders';
import userBoxs from './routes/user.boxs';

import config from '../config';

const route = Router();

// guaranteed to get dependencies
export default () => {
    const app = Router();

    contents(app);
    quizzs(app);
    thematiques(app);
    pictures(app);
    products(app);
    orders(app);
    profiles(app);
    boxs(app);
    sync(app);
    poi(app);
    contacts(app);
    feedback(app);
    zones(app);
    user(app);
    userOrders(app);
    userBoxs(app);

    app.use('/', route);

    route.get('', (req: any, res: Response) => {
        if (req.session.loggedin) {
            res.redirect('/home');
        } else {
            res.sendFile(path.join(__dirname + '../../../public/page-login.html'));
        }
    });

    route.post(
        '/login',
        celebrate({
            body: Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            }),
        }),
        async (req: any, res: Response, next: NextFunction) => {
            const logger: any = Container.get('logger');
            logger.debug('Calling Front Login endpoint with body: %o', req.body);

            try {
                const { email, password } = req.body;
                const authServiceInstance = Container.get(AuthService);
                const { user, token } = await authServiceInstance.login(email, password);

                logger.debug('Having user  : %o', user);
                logger.debug('Having token : %o', token);

                const localRoles = JSON.parse(user.roles);

                if (localRoles == config.roles.user) {
                    throw new Error('Access denied.');
                }
                
                const availableZones = [];
                
                if( user.availability_zone.length > 0 )
                {
                    user.availability_zone.forEach(item => {
                        availableZones.push(item.id);
                    })
                }

                req.session.user 	 = user;
                req.session.loggedin = true;
                req.session.username = email;
                req.session.name = user.name;
                req.session.roles = JSON.parse(user.roles);
                req.session.zones = availableZones;

                return res.redirect('/home');
            } catch (e) {
                logger.error('🔥 error: %o', e);

                return res.redirect('/');
                return next(e);
            }
        },
    );

    route.get('/home', async (req: any, res: Response) => {
        try {
            if (req.session.loggedin) {
            	const logger: any 	= Container.get('logger');
            	
            	const dayModifier 	= 7; 
				const thresholdTime = new Date(new Date().setDate(new Date().getDate() - dayModifier));
			
                const products 		= await Container.get(ProductService).findAll(req, {
                    where: {
                        deleted: false,
                    },
                });
                
                const contentService = Container.get(ContentService);
               	const boxService     = Container.get(BoxService);
               	const trimProducts   = [];
               	
                let boxOrders		 = false;
                let totalOrders 	 = false;
                let orderStats		 = false;
                let needActionsContents = false;
                let contentStatistics	= false;
                let box = false;
                
               	const contentStates  = await contentService.getContentStatesAsArray();                 
                
                
                if( AclService.hasRole(req.session.roles, config.roles.orders_support) )
                {
					const userProducts 		  = await Container.get(UserOrderService).getUserProducts(req, req.session.user.id);
					
					
					userProducts.forEach( product => {
	                    const title = product.title.split('"').join('').split("'").join('');
						trimProducts.push({
							'id' 	: product.id,
							'stock' : product.stock,
							'title' : (title.length > 25 ? (title.substring( 0, 25) + "...") : title),
						});
	                });
					
					console.log(trimProducts);
					
					const userOrders = await Container.get(UserOrderService).getUserOrders(req, false);
					
					boxOrders   = { "waiting": [], "done" : [], 'whole' : {}};
					totalOrders = 0;
					
					if( userOrders.length > 0 )
					{
						userOrders.forEach( order => {
							if( order.delivered )
							{
								boxOrders.done.push( order );
							}
							else
							{
								boxOrders.waiting.push( order );
							}
							
							if( typeof boxOrders.whole[order.box.id] == "undefined" )
							{
								boxOrders.whole[order.box.id] = {
									id: order.box.id,
									title: order.box.title,
									orders: 0,
								};
							}
							
							boxOrders.whole[order.box.id].orders++; 
							
						});
						// Commande en attente
						// Stocks
						// Camembert box remises / en attente
					}
					
					totalOrders = boxOrders.waiting.length + boxOrders.done.length;
                }
                else
                {
	                
	                
	                products.forEach( product => {
	                    const title = product.title.split('"').join('').split("'").join('');
						trimProducts.push({
							'id' 	: product.id,
							'stock' : product.stock,
							'title' : (title.length > 25 ? (title.substring( 0, 25) + "...") : title),
						});
	                });
	                 
	                
	                
	                boxs 		  = await boxService.computeCapacities();
	                let { boxOrders, totalOrders } = await boxService.computeOrdersStatistics();
	                
	                contentStatistics = await contentService.getContentsStatistics(req);
	                                                             
	                orderStats 	= await Container.get(OrderService).getOrdersStatistics();
	                
	                needActionsContents = await contentService.getNeedingActionContents(req);
				}
				
                return res.render('index', {
                    username: req.session.name,
                    products: trimProducts,                    
                    boxs: boxs,
                    boxsOrders: boxOrders,
                    totalOrders: totalOrders,
                    contentStates: contentStates,
                    contentStatistics: contentStatistics,
                    orderStats: orderStats,
                    needActionsContents: needActionsContents, 
                });
                //return res.sendFile(path.join(__dirname + '../../../public/index.html'));
            } else {
                return res.redirect('/');
            }
        } catch (e) {
            throw e;
        }
        //res.end();
    });

    route.get('/logout', async (req: any, res: Response) => {
        try {
            if (req.session.loggedin) {
                req.session.loggedin = false;
            }
            return res.redirect('/');
        } catch (e) {
            throw e;
        }
    });

    return app;
};
