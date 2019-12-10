import { Service, Inject } 				from 'typedi';
import config							from '../config';
import { IPicture, IPictureInputDTO }	from '../interfaces/IPicture';
import events 							from '../subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';


@Service()
export default class PictureService 
{
	constructor(
		@Inject('pictureModel') private pictureModel : Models.PictureModel,
		@Inject('logger') 		private logger,
		@EventDispatcher() 		private eventDispatcher: EventDispatcherInterface,
	) 
	{

	}

	public async create(pictureInput: IPictureInputDTO): Promise<{ picture: IPicture }> 
	{
		try 
		{
			this.logger.silly('Creating picture',pictureInput);
			 
			const picture:IPicture = await this.pictureModel.create({
				...pictureInput
			});
			
			if (!picture) {
				throw new Error('Content cannot be created');
			}

			return { picture };
		}
		catch (e) 
		{
			this.logger.error(e);
			throw e;
		}
	}

	public async update(pictureId : Number, pictureInput: IPictureInputDTO): Promise<{ picture: IPicture }> 
	{
		const picture = await this.pictureModel.findOne({
		   where: {
			   id: pictureId
		   }
		});
		
		if (!picture) 
		{
			throw new Error('Picture not found.');
		}                                                    
		
		this.logger.silly('Updating picture');
		const updatedPicture:IPicture = await picture.update(pictureInput);
		
		if (!updatedPicture) 
		{
			throw new Error('Picture could not be updated.');
		}  

		return { picture: updatedPicture };
	
	}
}