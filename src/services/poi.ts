import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IPoi, IPoiInputDTO } from '../interfaces/IPoi';



@Service()
export default class PoiService {
	constructor(
		@Inject('poiModel') private poiModel: any,
		@Inject('logger') private logger,
		@EventDispatcher() private eventDispatcher: EventDispatcherInterface,
	) {

	}

	public async create(poiInput: IPoiInputDTO): Promise<{ poi: IPoi }> {
		try {
			this.logger.silly('Creating POI');
			
			if (typeof poiInput.active === 'string') {
				poiInput.active = (poiInput.active == "on");
			}

			const poi: IPoi = await this.poiModel.create({
				...poiInput
			});

			if (!poi) {
				throw new Error('Question Content cannot be created');
			}
			return { poi };
		}
		catch (e) {
			this.logger.error(e);
			throw e;
		}
	}

	public async update(poiId: number, poiInput: IPoiInputDTO): Promise<{ poiRecord : IPoi }> {
		const poiRecord: any = await this.poiModel.findOne({
			where: {
				id: poiId
			}
		});

		if (!poiRecord) {
			throw new Error('POI not found.');
		}

		this.logger.silly('Updating POI');

		if (typeof poiInput.active === 'string') {
			poiInput.active = (poiInput.active == "on");
		}

		await poiRecord.update(poiInput);

		return { poiRecord };

	}
	
	
    public async findById(id: number): Promise<{ poi: IPoi }> {
        try {
            this.logger.silly('Searching POI');
            const poi: IPoi = await this.poiModel.findOne(
                {
                    where: { id }
                }
            );

            if (!poi) {
                throw new Error('POI cannot be found');
            }

            return { poi };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findByExternalNumber(externalNumber: number): Promise<{ poi: IPoi }> {
        try {
            this.logger.silly('Searching POI');
            const poi: IPoi = await this.poiModel.findOne(
                {
                    where: { externalNumber: externalNumber }
                }
            );

            if (!poi) {
                throw new Error('POI cannot be found');
            }

            return { poi };
        }
        catch (e) {
            this.logger.error(e);
            
            return false;
        }
    }

                                
	public async findAll(): Promise<{ questionCategories: IPoi[] }> {
		try {
			this.logger.silly('Finding POI');
			const pois: IPoi[] = await this.poiModel.findAll();
			return { pois };
		}
		catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
}