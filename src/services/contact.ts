import { Service, Inject } from 'typedi';
import ContactModel from '../models/contact';
import { IContact, IContactInputDTO } from '../interfaces/IContent';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class ContactService {
    public constructor(
        @Inject('contactModel') private contactModel: Models.ContactModel,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async findOne(searchedContact: IContactInputDTO): Promise<{ contact: IContact }> {
    	try {
            this.logger.silly('Searching contact %o', searchedContact);
            
            const contactRecord = await this.contactModel.findOne({
            	where: searchedContact
			})
               
            return { contactRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
	}
    
    public async create(contactInput: IContactInputDTO): Promise<{ contact: IContact }> {
        try {
            this.logger.silly('Creating contact');
            
            const contactRecord = await this.contactModel.create({
                ...contactInput,
            });

            if (!contactRecord) {
                throw new Error('Contact cannot be created');
            }

            return { contactRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(contactId: Integer, contactInput: IContactInputDTO): Promise<{ contact: IContact }> {
        const contactRecord = await this.contactModel.findOne({
            where: {
                id: contactId,
            },
        });

        if (!contactRecord) {
            throw new Error('Contact not found.');
        }

        this.logger.silly('Updating contact');
                                 
        await contactRecord.update(contactInput);

        return { contactRecord };
    }
                                 
    public async delete(contactId: Integer) {
	    await this.contactModel.destroy({ where: {id: contactId}}) ;
	    
	    return;
    }        
}
