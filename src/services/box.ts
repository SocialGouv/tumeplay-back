import { Service, Inject } from 'typedi';
import { Container } from 'typedi';
import BoxModel from '../models/box';
import MailerService from './mail';
import BoxProductModel from '../models/box.products';
import { IBox, IBoxInputDTO } from '../interfaces/IBox';
import { IBoxProduct, IBoxProductInputDTO } from '../interfaces/IBoxProduct';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class BoxService {
    public constructor(
        @Inject('boxModel') private boxModel: any,
        @Inject('boxProductModel') private boxProductModel: any,
        @Inject('productModel') private productModel: any,
        @Inject('orderModel') private orderModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(boxInput: Partial<IBoxInputDTO>): Promise<{ box: IBox }> {
        try {
            this.logger.silly('Creating product');
            const box: IBox = await this.boxModel.create({
                ...boxInput,
            });

            if (!box) {
                throw new Error('Product cannot be created');
            }
            this.logger.silly('BOX ID : %o', box.id);
            return { box };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findById(id: number, includePicture: boolean): Promise<{ box: IBox }> {
        try {
            const box: IBox = await this.boxModel.findOne({
                where: { id },
                include: includePicture ? ['picture'] : undefined,
            });

            if (!box) {
                throw new Error('Box cannot be found');
            }

            return { box };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(id: number, boxInput: Partial<IBoxInputDTO>): Promise<{ box: IBox }> {
        try {
            const boxRecord: any = await this.boxModel.findOne({
                where: { id },
            });

            if (!boxRecord) {
                throw new Error('Product not found.');
            }

            this.logger.silly('Updating product');

            const box: IBox = await boxRecord.update(boxInput);

            return { box };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async bulkCreate(boxProductInputList: IBoxProductInputDTO[]): Promise<{ boxProducts: IBoxProduct[] }> {
        try {
            this.logger.silly('Creating boxProducts');
            const boxProducts: IBoxProduct[] = await this.boxProductModel.bulkCreate(boxProductInputList);

            if (!boxProducts) {
                throw new Error('Product Order mappings could not be created');
            }

            return { boxProducts };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async bulkDelete(boxId: number): Promise<{}> {
        try {
            this.logger.silly('Deleting boxProducts');
            const boxProducts: IBoxProduct[] = await this.boxProductModel.destroy({
                where: {
                    boxId: boxId,
                },
            });

            return {};
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async computeOrdersStatistics(): Promise<{}> {
		try
		{
			const allOrders	  = await this.orderModel.findAll({include: ['box']});
			const boxs 		  = {};
			let   totalOrders = 0;
			
			allOrders.map( item => {
				if( typeof boxs[item.box.id] == "undefined" )
                {
					boxs[item.box.id] = {
						id: item.box.id,
						title: item.box.title,
						orders: 0,
					};
                }
                
                // Pretty naive implementation...
                boxs[item.box.id].orders++; 
                totalOrders++;               
			});
			
			return { boxOrders: boxs, totalOrders: totalOrders };
		}
		catch (e) 
		{
			this.logger.error(e);	
			
			return {};
		}
    }
    
    public async computeCapacities(): Promise<{}> {
		try
		{
			const allBoxsProducts = await this.boxProductModel.findAll({include: ['product', 'box']});
			const boxs 		  = {};
			
			allBoxsProducts.map( item => {
				if( typeof boxs[item.box.id] == "undefined" )
                {
					boxs[item.box.id] = {
						id: item.box.id,
						title: item.box.title,
						orders: 0,
					};
                }
                
                if( typeof boxs[item.box.id].localProducts == "undefined" )
                {
					boxs[item.box.id].localProducts = [];
                }
                
                const capacity = Math.floor(item.product.stock / item.qty);
                
                if( typeof boxs[item.box.id].capacity == "undefined" )
                {
					boxs[item.box.id].capacity = capacity;
                }
                
                if( capacity < boxs[item.box.id].capacity )
                {
					boxs[item.box.id].capacity = capacity;
                }
                
                boxs[item.box.id].localProducts.push({ 
					'product' : item.product.id,
					'qty' 	  : item.qty,
					'stock'	  : item.product.stock,
					'available' : ( item.product.stock / item.qty ),
                });                
			});
			
			return boxs;
		}
		catch (e) 
		{
			this.logger.error(e);
			
			return {};	
		}
    }
    
    public async disableEmptyBoxes(): Promise<{}> {
		try
		{
			const allBoxsProducts = await this.boxProductModel.findAll({include: ['product', 'box']});
			const boxs 		  = {};
			
			allBoxsProducts.map( async item => {
				if( item.product.stock <= 0 ) 
				{
					this.logger.silly('Product #' + item.product.id + ' is not available anymore. Disabling boxes.');
					
					await this.update(item.box.id, { available : false });
					
					const mailTitle   = 'Box désactivée - ' + item.box.title;
					const mailService = Container.get(MailerService);
				
					await mailService.send('contact.tumeplay@fabrique.social.gouv.fr', mailTitle, 'product_disabled_box', { box : item.box  });
				}				            
			});
			
			return boxs;
		}
		catch (e) 
		{
			this.logger.error(e);
			
			return {};	
		}
    }
}
