import { Service, Inject } from 'typedi';
import { Container } from 'typedi';
import MailerService from './mail';
import BoxService from './box';
import config from '../config';
import { IProduct, IProductInputDTO } from '../interfaces/IProduct';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import {IProductZone, IProductZoneDTO} from "../interfaces/IProductZone";

@Service()
export default class ProductService {
    public constructor(
        @Inject('productModel') private productModel: any,
        @Inject('productZoneModel') private productZoneModel: any,

        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}
    
    
    public async findAll(req, criterias) {
        try {
            this.logger.silly('Finding products');
            
            this.alterQuery(req, criterias);
            
            const products = await this.productModel.findAll(criterias);
            
            return products;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findOne(req, criterias) {
        try {
            this.logger.silly('Finding one content');
            
            this.alterQuery(req, criterias);
            
            console.log("Criterias : " + JSON.stringify(criterias));
            
            const product = await this.productModel.findOne(criterias);
            
            return product;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    
    private alterQuery(req, criterias)
    {
    	if( req == null )
        {
            return criterias;
        }
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

    public async findById(req, id: number, includePicture: boolean): Promise<{ product: IProduct }> {
        try {
            this.logger.silly('Creating product');
            
            const criterias = {
                where: { id },
                include: includePicture ? ['picture'] : undefined,
            };
            const product: IProduct = await this.findOne(req, criterias);

            if (!product) {
                throw new Error('Product cannot be found');
            }

            return { product };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(req, id: number, productInput: Partial<IProductInputDTO>): Promise<{ product: IProduct }> {
        try {
            const productRecord: any = await this.findOne(req, {
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
            
            const product: IProduct = await productRecord.update(productUpdate);
                                                   
            if( productUpdate.stock < 10 )
            {
            	const mailTitle   = 'Stock bas - ' + productRecord.title;
				const mailService = Container.get(MailerService);
				
				await mailService.send('romain.petiteville@celaneo.com', mailTitle, 'product_low_stock', { product : productRecord, newStock : productUpdate.stock  });
				
				if( productUpdate.stock <= 0 )
				{
					const boxService = Container.get(BoxService);
					
					await boxService.disableEmptyBoxes();
				}
            }


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
    public async bulkCreateZone(productZoneInputList: IProductZoneDTO[]): Promise<{ productZone: IProductZone[] }> {
        try {
            this.logger.silly('Creating productZones');
            const productZones: IProductZone[] = await this.productZoneModel.bulkCreate(productZoneInputList);

            if (!productZones) {
                throw new Error('zone Order mappings could not be created');
            }

            return {productZone: productZones };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async bulkDelete(productId: number): Promise<{}> {
        try {
            this.logger.silly('Deleting boxProducts');

            const productZones: IProductZone[] = await this.productZoneModel.destroy({
                where: {
                    productId: productId,
                },
            });

            return {};
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
