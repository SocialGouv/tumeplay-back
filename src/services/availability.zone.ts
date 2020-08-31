import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import {IAvailabilityZone, IAvailabilityZoneDTO} from '../interfaces/IAvailabilityZone';

@Service()
export default class AvailabilityZoneService {
    public constructor(
        @Inject('availabilityZoneModel') private availabilityZoneModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(availabilityZoneInput: IAvailabilityZoneDTO): Promise<{ availabilityZone: IAvailabilityZone }> {
        try {
            this.logger.silly('Creating AvailabilityZone');

            if (typeof availabilityZoneInput.enabled === 'string') {
                availabilityZoneInput.enabled = availabilityZoneInput.enabled == 'on';
            }

            const availabilityZone: IAvailabilityZone = await this.availabilityZoneModel.create({
                ...availabilityZoneInput,
            });

            if (!availabilityZone) {
                throw new Error('availability zone cannot be created');
            }
            return { availabilityZone };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(availabilityZoneId: number, availabilityZoneInput: IAvailabilityZoneDTO): Promise<{ availabilityZoneRecord: IAvailabilityZone }> {
        const availabilityZoneRecord: any = await this.availabilityZoneModel.findOne({
            where: {
                id: availabilityZoneId,
            },
        });

        if (!availabilityZoneRecord) {
            throw new Error('AvailabilityZone not found.');
        }

        this.logger.silly('Updating AvailabilityZone');

        if (typeof availabilityZoneInput.enabled === 'string') {
            availabilityZoneInput.enabled = availabilityZoneInput.enabled == 'on';
        }

        await availabilityZoneRecord.update(availabilityZoneInput);

        return { availabilityZoneRecord };
    }

    public async findById(id: number): Promise<{ availabilityZone: IAvailabilityZone }> {
        try {
            this.logger.silly('Searching AvailabilityZone');
            const availabilityZone: IAvailabilityZone = await this.availabilityZoneModel.findOne({
                where: { id },
            });

            if (!availabilityZone) {
                throw new Error('AvailabilityZone cannot be found');
            }
            console.log('availabilityZone find byId');
            console.log(availabilityZone);

            return { availabilityZone };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findAll(): Promise<{ availabilityZone: IAvailabilityZone[] }> {
        try {
            this.logger.silly('Finding AvailabilityZone');
            const availabilityZone: IAvailabilityZone[] = await this.availabilityZoneModel.findAll();
            return { availabilityZone : availabilityZone };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
