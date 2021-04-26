import Container, { Service, Inject } from 'typedi';
import { IOrder, IOrderInputDTO, IOrderMainView } from '../interfaces/IOrder';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import ProductOrderService from './product.order';
import ProductService from './product';
import { IProductOrderInputDTO } from '../interfaces/IProductOrder';
import { Op } from 'sequelize';
import { IOrderZone, IOrderZoneDTO } from '../interfaces/IOrderZone';
import config from '../config';

@Service()
export default class OrderService {
    public constructor(
        @Inject('orderModel') private orderModel: any,
        @Inject('orderZoneModel') private orderZoneModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    /**
     * @description Create an order
     * @param orderInput  the order object (main detail)
     * @param productIds list of product ids to assign to the order (will create a product order for each)
     */
    public async create(orderInput: Partial<IOrderInputDTO>, productIds?: number[]): Promise<{ order: IOrder }> {
        try {
            this.logger.silly('Creating order');
            // Creating the order
            const order: IOrder = await this.orderModel.create({
                ...orderInput,
            });

            if (!order) {
                throw new Error('Order cannot be created');
            }

            if (orderInput.productIds && orderInput.productIds.length > 0) {
                const orderId = order.id;
                const productOrderService: ProductOrderService = Container.get(ProductOrderService);
                const orderProductList: IProductOrderInputDTO[] = orderInput.productIds.map(productId => {
                    return { productId, orderId };
                });
                // Creating product order mappings:
                await productOrderService.bulkCreate(orderProductList);
            }

            return { order };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findById(id: number, includePicture: boolean): Promise<{ order: IOrder }> {
        try {
            this.logger.silly('Creating order');
            const order: IOrder = await this.orderModel.findOne({
                where: { id },
            });

            if (!order) {
                throw new Error('Order cannot be found');
            }

            return { order };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findByIdDetailled(id: number): Promise<{ order: IOrderMainView }> {
        try {
            this.logger.silly('Finding an order');
            const orderFound: IOrder = await this.orderModel.findOne({
                where: { id },
                include: ['availability_zone', 'shippingMode', 'shippingAddress', 'profile', 'products', 'pickup', 'box'],
            });

            if (!orderFound) {
                throw new Error('Order cannot be found');
            }

            const order: IOrderMainView = {
                id,
                orderDate: orderFound.orderDate,
                sent: orderFound.sent,
                delivered: orderFound.delivered,
                shippingModeId: orderFound.shippingModeId,
                shippingAddressId: orderFound.shippingAddressId,
                profileId: orderFound.profileId,
                userId: orderFound.userId,
                createdAt: orderFound.createdAt,
                updatedAt: orderFound.updatedAt,
                profileFullName: orderFound.profile ? `${orderFound.profile.name} ${orderFound.profile.surname}` : '',
                profileFirstName: orderFound.profile ? `${orderFound.profile.surname}` : '',
                profileName: orderFound.profile ? `${orderFound.profile.name}` : '',
                profileEmail: orderFound.profile ? orderFound.profile.email : '',
                phoneNumber: orderFound.shippingAddress ? orderFound.shippingAddress.phoneNumber : '',
                shippingAddressConcatenation: orderFound.shippingAddress
                    ? orderFound.shippingAddress.concatenation
                    : null,
                shippingModeText: orderFound.shippingMode ? orderFound.shippingMode.title : null,
                products: orderFound.products,
                pickup: orderFound.pickup,
                box: orderFound.box,
                shipping: orderFound.shippingAddress,
                availability_zone: orderFound.availability_zone,
            };

            

            return { order };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findAllOrdersMainView(): Promise<{ orders: IOrderMainView[] }> {
        try {
            this.logger.silly('Finding all orders');
            let ordersResult: IOrder[] = await this.orderModel.findAll({
                include: ['availability_zone', 'shippingMode', 'shippingAddress', 'profile', 'pickup', 'box'],
            });
            const orders: IOrderMainView[] = ordersResult.map(item => {
                let additional_fields = {
                    profileFullName: item.profile ? `${item.profile.name} ${item.profile.surname}` : '',
                    shippingAddressConcatenation: item.shippingAddress ? item.shippingAddress.concatenation : null,
                    shippingModeText: item.shippingMode ? item.shippingMode.title : null,
                };

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
                    ...additional_fields,
                };
            });

            return { orders };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(id: number, orderInput: Partial<IOrderInputDTO>): Promise<{ order: IOrder }> {
        try {
            const orderRecord: any = await this.orderModel.findOne({
                where: { id },
            });

            if (!orderRecord) {
                throw new Error('Order not found.');
            }

            this.logger.silly('Updating order');

            const order: IOrder = await orderRecord.update(orderInput);

            return { order };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    /**
    * Règles boites :
		les 4 diffiérentes box commandées dans la même semaine
		1 box de chaque genre par semaine maximum
		2 box sur mesure par mois
		comptage par utilisateur ? 
		IP
		mail
		Nom/Prénom
    */
    public async isOrderAllowed(userId, boxId, userProfile): Promise<{isOrderAllowed: bool}> {
		try
		{
			const dayModifier 	= ( boxId == 4 ) ? 30 : 7; // Naive implementation for "one month" / "one week"
			let thresholdTime = new Date(new Date().setDate(new Date().getDate() - dayModifier));


			var a = new Date().getTimezoneOffset();
		
			thresholdTime.setTime(thresholdTime.getTime() - (a * 60 * 1000 ));						
						
			const orders: any = await this.orderModel.findAll({
                where: { 
					orderDate: {
						[Op.gte]: thresholdTime,
					},
					userId : userId,
					profileId: userProfile.id,
					boxId: boxId,
                },
            });
            
            // We start from "allowed"
            let isAllowed = true;
			this.logger.silly('Found ' + orders.length + ' orders for user with time '+ thresholdTime +'.');
            // Do we have any order ? 
            if( orders && orders.length > 0 )
            {
            	// Disallow more than "one order by box by week" and "two order of box 4 by month" 
            	isAllowed = ( boxId == 4 ) ? ( orders.length < 2 ) : false;				
            }
            
            return { isOrderAllowed : isAllowed };
		}
		catch(e)
		{
			this.logger.error(e);
			
			return { isOrderAllowed : true };
		}
    }
    
    public async findSurveyAbleOrders()
    {
    	const dayModifier 	= 20;
    	
		let minTime = new Date(new Date().setDate(new Date().getDate() - dayModifier));
		let maxTime = new Date(new Date().setDate(new Date().getDate() - dayModifier));
		
		minTime.setHours(0,0,0);
		maxTime.setHours(23,59,59);
		
		var a = new Date().getTimezoneOffset();
		
		minTime.setTime(minTime.getTime() - (a * 60 * 1000 ));
		maxTime.setTime(maxTime.getTime() - (a * 60 * 1000 ));
		
		this.logger.silly('Searching between ' + minTime + ' and '+ maxTime +'.');


		const orders: any = await this.orderModel.findAll({
            where: { 
				orderDate: {
					[Op.gte]: minTime,
					[Op.lte]: maxTime,
				},				
            },
            include: ['profile'],
        });
        
        return orders;
    }
    
    public async getOrdersStatistics()
    {
    	const _return 		= {
			'lastWeek'	: 0,
			'byZip' 	: {},
			'byBox'		: {},
			'byShipping': {},
			'boxes'		: {},
    	};
    	
		const dayModifier 	= 20;
    	
		let minTime = new Date(new Date().setDate(new Date().getDate() - dayModifier));
		let maxTime = new Date(new Date().setDate(new Date().getDate() - dayModifier));
		
		minTime.setHours(0,0,0);
		maxTime.setHours(23,59,59);
		
		var a = new Date().getTimezoneOffset();
		
		minTime.setTime(minTime.getTime() - (a * 60 * 1000 ));
		maxTime.setTime(maxTime.getTime() - (a * 60 * 1000 ));
		
		_return['lastWeek'] = await this.orderModel.findAll({
            where: { 
				orderDate: {
					[Op.gte]: minTime,
					[Op.lte]: maxTime,
				},				
            },
        });
        
        _return['lastWeek'] = _return['lastWeek'].length;
        
        const allOrders = await this.orderModel.findAll({
            where: { 
            },
            include: ['profile', 'shippingMode', 'pickup','box', 'shippingAddress']
        });
        
        allOrders.forEach( order => {
        	let localZip = false;
        	const shippingTitle = order.shippingMode.title;
        	
        	if( order.pickup )
        	{
				localZip = order.pickup.zipCode;
        	}
        	else
        	{
				localZip = order.shippingAddress.zipCode;
        	}
        	
        	if( localZip )
        	{
				localZip = localZip.substring(0, 2);
				
				_return['byZip'][localZip] = ( _return['byZip'][localZip] ? _return['byZip'][localZip] + 1 : 1 );
        	}
        	
        	_return['boxes'][order.boxId] = order.box.title;
			_return['byBox'][order.boxId] = ( _return['byBox'][order.boxId] ? _return['byBox'][order.boxId] + 1 : 1 );
			
			_return['byShipping'][shippingTitle] = ( _return['byShipping'][shippingTitle] ? _return['byShipping'][shippingTitle] + 1 : 1 );
        });
        
        return _return;
    }
    public async bulkCreateZone(orderZoneInputList: IOrderZoneDTO[]): Promise<{ orderZone: IOrderZone[] }> {
        try {
            this.logger.silly('Creating orderZones');
            const orderZones: IOrderZone[] = await this.orderZoneModel.bulkCreate(orderZoneInputList);

            if (!orderZones) {
                throw new Error('zone Order mappings could not be created');
            }

            return { orderZone: orderZones };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async bulkDeleteZone(orderId: number): Promise<{}> {
        try {
            this.logger.silly('Deleting orders');

            const orderZones: IOrderZone[] = await this.orderZoneModel.destroy({
                where: {
                    orderId: orderId,
                },
            });

            return {};
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async markAsDelivered(req, orderId)
    {
		try {
			let criterias = {where : { id : orderId }};
            this.logger.silly('Setting order as delivered');
            
            this.alterQuery(req, criterias);
            
            const order = await this.orderModel.findOne(criterias);
            
            if( order )
            {
				await order.update({ delivered : true });
            }
            
            return order;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findOne(req, criterias)
    {
		try {
            this.logger.silly('Finding one order');
            
            this.alterQuery(req, criterias);
            
            const order = await this.orderModel.findOne(criterias);
            
            return order;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findAll(req, criterias)
    {
		try {
            this.logger.silly('Finding orders');
            
            this.alterQuery(req, criterias);
            
            const contents = await this.orderModel.findAll(criterias);
            
            return contents;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
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
    
    public async handleOrderProducts(bodyRequest, orderId)
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
    
    public async handleZones(currentOrder, zoneId)
    {
        await this.bulkDeleteZone(currentOrder);

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
            await this.bulkCreateZone(zonesItems);
        }
    };
}
