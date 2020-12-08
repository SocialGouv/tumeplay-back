import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import {IPoi, IPoiInputDTO} from '../interfaces/IPoi';

@Service()
export default class PoiService {
    public constructor(
        @Inject('poiModel') private poiModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(poiInput: IPoiInputDTO): Promise<{ poi: IPoi }> {
        try {
            this.logger.silly('Creating POI');

            if (typeof poiInput.active === 'string') {
                poiInput.active = poiInput.active == 'on';
            }

            const poi: IPoi = await this.poiModel.create({
                ...poiInput,
            });

            if (!poi) {
                throw new Error('poi cannot be created');
            }
            return { poi };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(poiId: number, poiInput: IPoiInputDTO): Promise<{ poiRecord: IPoi }> {
        const poiRecord: any = await this.poiModel.findOne({
            where: {
                id: poiId,
            },
        });

        if (!poiRecord) {
            throw new Error('POI not found.');
        }

        this.logger.silly('Updating POI');

        if (typeof poiInput.active === 'string') {
            poiInput.active = poiInput.active == 'on';
        }

        await poiRecord.update(poiInput);

        return { poiRecord };
    }

    public async findById(id: number): Promise<{ poi: IPoi }> {
        try {
            this.logger.silly('Searching POI');
            const poi: IPoi = await this.poiModel.findOne({
                where: { id },
            });

            if (!poi) {
                throw new Error('POI cannot be found');
            }

            return { poi };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findByExternalNumber(externalNumber: number): Promise<{ poi: IPoi }> {
        try {
            this.logger.silly('Searching POI');
            const poi: IPoi = await this.poiModel.findOne({
                where: { externalNumber: externalNumber },
                raw: true,
            });

            if (!poi) {
                throw new Error('POI cannot be found');
            }

            return { poi };
        } catch (e) {
            this.logger.error(e);

            return false;
        }
    }

    public async findAll(): Promise<{ questionCategories: IPoi[] }> {
        try {
            this.logger.silly('Finding POI');
            const pois: IPoi[] = await this.poiModel.findAll();
            return { pois };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findAllFiltered(req, criterias)
    {
		try {
            this.alterQuery(req, criterias);
            
            const pois: IPoi[] = await this.poiModel.findAll(criterias);
            return pois;
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

}
