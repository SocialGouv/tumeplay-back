import Container, { Service, Inject } from 'typedi';
import { IOrder, IOrderInputDTO, IOrderMainView } from '../interfaces/IOrder';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import ProductOrderService from './product.order';
import { IProductOrderInputDTO } from '../interfaces/IProductOrder';

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
                include: ['shippingMode', 'shippingAddress', 'profile', 'pickup'],
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
                    profileId: item.profileId,
                    userId: item.userId,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    pickup: item.pickup,
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
}
