import { Service, Inject } from 'typedi';
import { Container } from 'typedi';
import BoxModel from '../models/box';
import MailerService from './mail';
import BoxProductModel from '../models/box.products';
import { IBox, IBoxInputDTO } from '../interfaces/IBox';
import { IBoxProduct, IBoxProductInputDTO } from '../interfaces/IBoxProduct';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import {IBoxZone, IBoxZoneDTO} from "../interfaces/IBoxZone";
import config from '../config';

@Service()
export default class BoxService {
    public constructor(
        @Inject('boxModel') private boxModel: any,
        @Inject('boxProductModel') private boxProductModel: any,
        @Inject('boxZoneModel') private boxZoneModel: any,
        @Inject('orderModel') private orderModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(boxInput: Partial<IBoxInputDTO>): Promise<{ box: IBox }> {
        try {
            this.logger.silly('Creating box');
            const box: IBox = await this.boxModel.create({
                ...boxInput,
            });

            if (!box) {
                throw new Error('Box cannot be created');
            }
            this.logger.silly('BOX ID : %o', box.id);
            return { box };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findAll(req, criterias) {
        try {
            this.logger.silly('Finding boxes');
            
            this.alterQuery(req, criterias);
            
            const contents = await this.boxModel.findAll(criterias);
            
            return contents;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findOne(req, criterias) {
        try {
            this.logger.silly('Finding box');
            
            this.alterQuery(req, criterias);
            
            const box = await this.boxModel.findOne(criterias);
            
            return box;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findById(req, id: number, includePicture: boolean): Promise<{ box: IBox }> {
        try {
            const criterias = {
                where: { id },
                include: includePicture ? ['picture'] : undefined,
            };
            
            this.alterQuery(req, criterias);
            
            const box: IBox = await this.boxModel.findOne(criterias);

            if (!box) {
                throw new Error('Box cannot be found');
            }

            return { box };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(req, id: number, boxInput: Partial<IBoxInputDTO>): Promise<{ box: IBox }> {
        try {
            const boxRecord: any = await this.findOne(req, {
                where: { id },
            });

            if (!boxRecord) {
                throw new Error('Box not found.');
            }

            this.logger.silly('Updating box');

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
    public async bulkCreateZone(boxId:number, boxZoneInputList: IBoxZoneDTO[]): Promise<{ boxZone: IBoxZone[] }> {
        try {
        	this.logger.silly('Cleaning box zones');
        	
        	await this.boxZoneModel.destroy({where : { boxId : boxId}});
        	
            this.logger.silly('Creating boxZones');
            
            const boxZones: IBoxZone[] = await this.boxZoneModel.bulkCreate(boxZoneInputList);

            if (!boxZones) {
                throw new Error('zone Order mappings could not be created');
            }

            return {boxZone: boxZones };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async bulkDeleteBoxProducts(boxId: number): Promise<{}> {
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
    
    public async computeOrdersStatistics(req): Promise<{}> {
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
    
    public async disableEmptyBoxes(): Promise<[]> {
		try
		{
			const allBoxsProducts = await this.boxProductModel.findAll({include: ['product', 'box']});
			const boxs 		  = [];
			
            for(const item of allBoxsProducts)
            {
                if( item.product.stock <= 0 && item.box.available ) 
				{
					this.logger.silly('Product #' + item.product.id + ' is not available anymore. Disabling boxes.');
					
                    try
                    {
                        this.logger.silly('Updating box #'+ item.box.id +'.');
                        await this.update(null, item.box.id, { available : false });    
                    }
                    catch(e)
                    {
                        this.logger.silly(e);
                    }
					
                    if( boxs.indexOf(item.box.id) < 0 )
                    {
                        boxs.push(item.box.id);
                        
                        this.logger.silly('Box #' + item.box.id + ' : Sending mail.');
                        
                        const mailTitle   = 'Box désactivée - ' + item.box.title;
                        const mailService = Container.get(MailerService);
                    
                        await mailService.send('romain.petiteville@celaneo.com', mailTitle, 'product_disabled_box', { box : item.box  });    
                    }
                    else
                    {
                        this.logger.silly('Skipping - warning already sent for box #'+item.box.id+'.');
                    }
				}
			}
            
			return boxs;
		}
		catch (e) 
		{
			this.logger.error(e);
			
			return {};	
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
}
