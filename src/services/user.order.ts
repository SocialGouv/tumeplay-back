import { Service, Inject, Container } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import config from '../config';
import AclService from './acl';

import UserService from './user';
import ProductService from './product';
import OrderService from './order';

@Service()
export default class UserOrderService {
    public constructor(
    	@Inject('userModel') private userModel: Models.UserModel,
        @Inject('userOrderModel') private userOrderModel: Models.UserOrderModel,
        @Inject('userStockModel') private userStockModel: Models.UserStockModel,
        @Inject('userOrderStockModel') private userOrderStockModel: Models.UserOrderStockModel,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async getUserOrder(req, orderId)
    {
		try {
            this.logger.silly('Finding user products');
            
            // Beginning from products : handle the case when user has no defined stocks for specific products
            const item = await Container.get(OrderService).findOne(req, {include: ['availability_zone', 'shippingMode', 'shippingAddress', 'profile', 'pickup', 'box']});
            
                return {
                    id: item.id,
                    orderDate: item.orderDate,
                    sent: item.sent,
                    delivered: item.delivered,
                    shippingModeId: item.shippingModeId,
                    shippingAddressId: item.shippingAddressId,
                    profileEmail: item.profile ? item.profile.email : '',
                    profileId: item.profileId,
                    userId: item.userId,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    pickup: item.pickup,
                    box: item.box,
                    availability_zone: item.availability_zone,
                    profileFullName: item.profile ? `${item.profile.name} ${item.profile.surname}` : '',
                    shippingAddressConcatenation: item.shippingAddress ? item.shippingAddress.concatenation : null,
                    shippingModeText: item.shippingMode ? item.shippingMode.title : null,
                };
            
            return orders;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async getUserOrders(req, onlyOwnOrders)
    {
		try {
            this.logger.silly('Finding user products');
            
            // Beginning from products : handle the case when user has no defined stocks for specific products
            let   ordersIds = [];
            let   queryParams = {include: ['availability_zone', 'shippingMode', 'shippingAddress', 'profile', 'pickup', 'box'],};
            
            if( onlyOwnOrders )
            {
            	const user = await  Container.get(UserService).findOne(req, {
	                where: {
	                    id: req.session.user.id
	                },
	                include: [               
                		'poi',
	                ]
	            });
	            
	            if( user.poi && user.poi.length > 0 )
	            {
					queryParams.where = {
						pickupId : user.poi[0].id
					};
				}
            }
            
            
            const rawOrders = await Container.get(OrderService).findAll(req, queryParams);
            const orders	= rawOrders.map(item => {
            	
            	ordersIds.push(item.id);
            	
                return {
                    id: item.id,
                    orderDate: item.orderDate,
                    sent: item.sent,
                    delivered: item.delivered,
                    shippingModeId: item.shippingModeId,
                    shippingAddressId: item.shippingAddressId,
                    profileEmail: item.profile ? item.profile.email : '',
                    profileId: item.profileId,
                    userId: item.userId,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    pickup: item.pickup,
                    box: item.box,
                    availability_zone: item.availability_zone,
                    profileName:  item.profile ? item.profile.name : '',
                    profileSurname:  item.profile ? item.profile.surname : '',
                    profileFullName: item.profile ? `${item.profile.name} ${item.profile.surname}` : '',
                    shippingAddressConcatenation: item.shippingAddress ? item.shippingAddress.concatenation : null,
                    shippingModeText: item.shippingMode ? item.shippingMode.title : null,
                    hasPersonalInformations: false,
                };
            }); 
            
            if( ordersIds.length > 0 )
            {
            	
				const ordersPersonalInformations = await this.getOrdersPersonalInformations(req, ordersIds);	
				
				if( ordersPersonalInformations && ordersPersonalInformations.length > 0 )
				{
					ordersPersonalInformations.forEach(item => {
						orders.map(order => {  
							if( item.orderId == order.id )
							{
								order.hasPersonalInformations = true;
							}
							
							return order;
						});
					});
				}
				
            }
            
            
            return orders;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
                         
    public async decreaseStock(id: number, numberToDecrease: number) {
		try {
            const userStockRecord: any = await this.userStockModel.findOne({
                where: { productId: id },
            });
			
            if (!userStockRecord) {
                throw new Error('Product #' + id + ' not found.');
            }
			
			const productStock  = userStockRecord.stock;
			 
			const productUpdate = {	stock: ( productStock - numberToDecrease) };
            
            this.logger.silly('Decreasing product #'+ id +' stock from ' + productStock + ' to ' + productUpdate.stock);
            
            const product = await userStockRecord.update(productUpdate);
            
            return { product };
        } catch (e) {
            this.logger.error(e);
        }
    }
    
    public async getOrdersPersonalInformations(req, orderIds)
    {
		return await this.userOrderModel.findAll({ where: { orderId: orderIds}});
    }
    
    
    public async getOrderPersonalInformations(req, orderId)
    {
		return await this.userOrderModel.findOne({ where: { orderId: orderId}});
    }
    
    public async handleOrderPersonalInformations(userId, localUserOrder, userOrderData)
    {
    	let _return = false;
		if( localUserOrder )
		{
			userOrderData.userId = userId;
			await localUserOrder.update(userOrderData);
			
			_return = localUserOrder;
		}
		else
		{
			userOrderData.userId = userId;
			_return = await this.userOrderModel.create(userOrderData);
		}
		
		return _return;
    }
    
    public async getUserProducts(req, userId)
    {
		try {
            this.logger.silly('Finding user products');
            
            // Beginning from products : handle the case when user has no defined stocks for specific products
            const products = await Container.get(ProductService).findAll(req, {include: ['picture', 'availability_zone'],});
                         
            if( products && products.length > 0 )
            {
				const productIds = [];
				
				products.map(item => {
					productIds.push(item.id);
					
					item.stock = 0;
				});
				
				const userStocks = await this.userStockModel.findAll({ where: { productId: productIds, userId: userId }});
				
				// Need a better design.
				if( userStocks && userStocks.length > 0 )
				{
					userStocks.forEach(userStock => {
						products.map(product => {
							if( product.id == userStock.productId )
							{
								product.stock = userStock.stock;
							}                                   
						});
					});
				}
            }
            
            return products;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async updateUserProductStock(req, userId, productId, newStock)
    {
		try {
            this.logger.silly('Entering update product stock');
            
            // Beginning from products : handle the case when user has no defined stocks for specific products
            const product = await Container.get(ProductService).findOne(req, {where: {id: productId}});
                         
            if( product )
            {
				const userStock = await this.userStockModel.findOne({ where: { productId: productId, userId: userId }});
				
				// Need a better design.
				if( userStock )
				{
					userStock.stock = newStock;
					
					await userStock.update({stock: newStock, stockDate: new Date()});
				}                                               
				else
				{
					const newUserStock = {
						productId: productId,
						userId: userId,
						stock: newStock,
					}
					
					await this.userStockModel.create(newUserStock);
				}
            }
            
            return true;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
        
        return false;
    }
              
                   
    private alterQuery(req, criterias)
    {
        if( typeof req.session !== 'undefined' && typeof req.session.zones !== "undefined" && req.session.zones.length > 0 )
        {
            if( req.session.roles.indexOf(config.roles.administrator) < 0 )
            {
                this.logger.silly("Altering criterias to add zone constraints");
                
                if(typeof criterias.include === 'undefined' )
                {
                    criterias.include = [];
                }
                
                criterias.include.push({
                    association: 'availability_zone',
                    where: { id : req.session.zones}   
                });
            }
            else
            {
                this.logger.silly("Skipping due to user role.");
            }
        }
        
        this.logger.silly("Out of alter.");
        
        return criterias;
    }                 
}
