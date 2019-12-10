import { Service, Inject } from 'typedi';
import ProductModel from '../models/product';
import { IProduct, IProductInputDTO } from '../interfaces/IProduct';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';


@Service()
export default class ProductService {
    constructor(
        @Inject('productModel') private productModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {

    }

    public async create(productInput: Partial<IProductInputDTO>): Promise<{ product: IProduct }> {
        try {
            this.logger.silly('Creating product');
            const product: IProduct = await this.productModel.create({
                ...productInput
            });

            if (!product) {
                throw new Error('Product cannot be created');
            }

            return { product };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findById(id: number, includePicture: boolean): Promise<{ product: IProduct }> {
        try {
            this.logger.silly('Creating product');
            const product: IProduct = await this.productModel.findOne(
                {
                    where: { id },
                    include: includePicture ? ['picture'] : undefined
                }
            );

            if (!product) {
                throw new Error('Product cannot be created');
            }

            return { product };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(id: number, productInput: Partial<IProductInputDTO>): Promise<{ product: IProduct }> {
        try {
            const productRecord: any = await this.productModel.findOne({
                where: { id }
            });

            if (!productRecord) {
                throw new Error('Product not found.');
            }

            this.logger.silly('Updating product');

            const product: IProduct = await productRecord.update(productInput);

            return { product };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}