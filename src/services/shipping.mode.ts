import { Service, Inject } from 'typedi';
import { IShippingMode, IShippingModeDTO } from '../interfaces/IShippingMode';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';


@Service()
export default class ShippingModeService {
    constructor(
        @Inject('shippingModeModel') private shippingModeModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {

    }

    public async create(shippingModeInput: Partial<IShippingModeDTO>): Promise<{ shippingMode: IShippingMode }> {
        try {
            this.logger.silly('Creating shippingMode');
            const shippingMode: IShippingMode = await this.shippingModeModel.create({
                ...shippingModeInput
            });

            if (!shippingMode) {
                throw new Error('ShippingMode cannot be created');
            }

            return { shippingMode };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findById(id: number): Promise<{ shippingMode: IShippingMode }> {
        try {
            this.logger.silly('Searching shippingMode');
            const shippingMode: IShippingMode = await this.shippingModeModel.findOne(
                {
                    where: { id }
                }
            );

            if (!shippingMode) {
                throw new Error('ShippingMode cannot be found');
            }

            return { shippingMode };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(id: number, shippingModeInput: Partial<IShippingModeDTO>): Promise<{ shippingMode: IShippingMode }> {
        try {
            const shippingModeRecord: any = await this.shippingModeModel.findOne({
                where: { id }
            });

            if (!shippingModeRecord) {
                throw new Error('ShippingMode not found.');
            }

            this.logger.silly('Updating shippingMode');

            const shippingMode: IShippingMode = await shippingModeRecord.update(shippingModeInput);

            return { shippingMode };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}