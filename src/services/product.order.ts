import { Service, Inject } from 'typedi';
import ProductModel from '../models/ordering-models/product.order';
import { IProductOrder, IProductOrderInputDTO } from '../interfaces/IProductOrder';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class ProductOrderService {
    public constructor(
        @Inject('productOrderModel') private productOrderModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(productOrderInput: IProductOrderInputDTO): Promise<{ productOrder: IProductOrder }> {
        try {
            this.logger.silly('Creating productOrder');
            const productOrder: IProductOrder = await this.productOrderModel.create({
                ...productOrderInput,
            });

            if (!productOrder) {
                throw new Error('Product Order mapping cannot be created');
            }

            return { productOrder };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async bulkCreate(
        productOrderInputList: IProductOrderInputDTO[],
    ): Promise<{ productOrders: IProductOrder[] }> {
        try {
            this.logger.silly('Creating productOrder');
            const productOrders: IProductOrder[] = await this.productOrderModel.bulkCreate(productOrderInputList);

            if (!productOrders) {
                throw new Error('Product Order mappings could not be created');
            }

            return { productOrders };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findByOrder(orderId): Promise<{ orderProducts: IProductOrder[] }> 
    {
		try {
            this.logger.silly('Finding productOrders by Order');
            const orderProducts: IProductOrder[] = await this.productOrderModel.findAll({
            	where: { orderId: orderId },            	
			});

            return { orderProducts };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
