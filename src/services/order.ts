import Container, { Service, Inject } from 'typedi';
import { IOrder, IOrderInputDTO, IOrderMainView } from '../interfaces/IOrder';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import ProductOrderService from './product.order';
import { IProductOrderInputDTO } from '../interfaces/IProductOrder';
import { Op } from 'sequelize';

@Service()
export default class OrderService {
    public constructor(
        @Inject('orderModel') private orderModel: any,
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
                include: ['shippingMode', 'shippingAddress', 'profile', 'products', 'pickup', 'box'],
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
                shippingAddressConcatenation: orderFound.shippingAddress
                    ? orderFound.shippingAddress.concatenation
                    : null,
                shippingModeText: orderFound.shippingMode ? orderFound.shippingMode.title : null,
                products: orderFound.products,
                pickup: orderFound.pickup,
                box: orderFound.box,
                shipping: orderFound.shippingAddress
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
                include: ['shippingMode', 'shippingAddress', 'profile', 'pickup', 'box'],
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
			this.logger.silly('Found ' + orders.length + ' orders for user.');
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
}
