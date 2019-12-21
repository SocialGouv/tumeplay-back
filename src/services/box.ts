import { Service, Inject } from 'typedi';
import BoxModel from '../models/box';
import BoxProductModel from '../models/box.products';
import { IBox, IBoxInputDTO } from '../interfaces/IBox';
import { IBoxProduct, IBoxProductInputDTO } from '../interfaces/IBoxProduct';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';


@Service()
export default class BoxService {
    constructor(
        @Inject('boxModel') private boxModel: any,
        @Inject('boxProductModel') private boxProductModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {

    }

    public async create(boxInput: Partial<IBoxInputDTO>): Promise<{ box: IBox }> {
        try {
            this.logger.silly('Creating product');
            const box: IBox = await this.boxModel.create({
                ...boxInput
            });

            if (!box) {
                throw new Error('Product cannot be created');
            }
            this.logger.silly('BOX ID : %o', box.id);
            return { box };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findById(id: number, includePicture: boolean): Promise<{ box: IBox }> {
        try {
            
            const box: IBox = await this.boxModel.findOne(
                {
                    where: { id },
                    include: includePicture ? ['picture'] : undefined
                }
            );

            if (!box) {
                throw new Error('Box cannot be found');
            }

            return { box };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(id: number, boxInput: Partial<IBoxInputDTO>): Promise<{ box: IBox }> {
        try {
            const boxRecord: any = await this.boxModel.findOne({
                where: { id }
            });

            if (!boxRecord) {
                throw new Error('Product not found.');
            }

            this.logger.silly('Updating product');

            const box: IBox = await boxRecord.update(boxInput);

            return { box };
        }
        catch (e) {
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
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async bulkDelete(boxId: number): Promise<{ }> {
        try {
            this.logger.silly('Deletign boxProducts');
            const boxProducts: IBoxProduct[] = await this.boxProductModel.destroy({
			    where: {
			        boxId : boxId
			    }
			})

            
            return { };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}