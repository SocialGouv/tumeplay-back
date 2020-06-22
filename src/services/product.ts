import { Service, Inject } from 'typedi';
import { Container } from 'typedi';
import ProductModel from '../models/product';
import MailerService from './mail';
import BoxService from './box';
import { IProduct, IProductInputDTO } from '../interfaces/IProduct';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class ProductService {
    public constructor(
        @Inject('productModel') private productModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(productInput: Partial<IProductInputDTO>): Promise<{ product: IProduct }> {
        try {
            this.logger.silly('Creating product');
            const product: IProduct = await this.productModel.create({
                ...productInput,
            });

            if (!product) {
                throw new Error('Product cannot be created');
            }

            return { product };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findById(id: number, includePicture: boolean): Promise<{ product: IProduct }> {
        try {
            this.logger.silly('Creating product');
            const product: IProduct = await this.productModel.findOne({
                where: { id },
                include: includePicture ? ['picture'] : undefined,
            });

            if (!product) {
                throw new Error('Product cannot be found');
            }

            return { product };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(id: number, productInput: Partial<IProductInputDTO>): Promise<{ product: IProduct }> {
        try {
            const productRecord: any = await this.productModel.findOne({
                where: { id },
            });

            if (!productRecord) {
                throw new Error('Product not found.');
            }

            this.logger.silly('Updating product');

            const product: IProduct = await productRecord.update(productInput);

            return { product };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async decreaseStock(id: number, numberToDecrease: number): Promise<{ product: IProduct }> {
		try {
            const productRecord: any = await this.productModel.findOne({
                where: { id },
            });
			
            if (!productRecord) {
                throw new Error('Product #' + id + ' not found.');
            }
			
			const productStock  = productRecord.stock;
			
			if( (productStock - numberToDecrease) < 0 ){
				throw new Error('Cannot change stock for product #' + id + ' : stock too low ( Trying to decrease ' + productStock + ' by ' + numberToDecrease + ')');
			}
			
			const productUpdate = {	stock: ( productStock - numberToDecrease) };
            this.logger.silly('Decreasing product #'+ id +' stock from ' + productStock + ' to ' + productUpdate.stock);
            
            if( productUpdate.stock < 10 )
            {
            	const mailTitle   = 'Stock bas - ' + productRecord.title;
				const mailService = Container.get(MailerService);
				
				await mailService.send('contact.tumeplay@fabrique.social.gouv.fr', mailTitle, 'product_low_stock', { product : productRecord, newStock : productUpdate.stock  });
				
				if( productUpdate.stock <= 0 )
				{
					const boxService = Container.get(BoxService);
					
					await boxService.disableEmptyBoxes();
				}
            }

            const product: IProduct = await productRecord.update(productUpdate);

            return { product };
        } catch (e) {
            this.logger.error(e);
        }
    }
    
    
    public async increaseStock(id: number, numberToIncrease: number): Promise<{ product: IProduct }> {
		try {
            const productRecord: any = await this.productModel.findOne({
                where: { id },
            });
			
            if (!productRecord) {
                throw new Error('Product #' + id + ' not found.');
            }
			
			if( !productRecord.stock) {
				throw new Error('Product #' + id + ' has not stock. Aborting.');
			}
			const productStock  = parseInt(productRecord.stock);
			
			
			const productUpdate = {	stock: ( productStock + parseInt(numberToIncrease)) };
            this.logger.silly('Increasing product #'+ id +' stock from ' + productStock + ' to ' + productUpdate.stock);

            const product: IProduct = await productRecord.update(productUpdate);

            return { product };
        } catch (e) {
            this.logger.error(e);
        }
    }
}
