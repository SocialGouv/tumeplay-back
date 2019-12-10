import { Service, Inject } 				from 'typedi';
import config							from '../config';
import ContentModel 					from '../models/content';
import { IContent,IContentInputDTO }	from '../interfaces/IContent';
import events 							from '../subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';


@Service()
export default class ContentService 
{
	constructor(
		@Inject('contentModel') private contentModel : Models.ContentModel,
		@Inject('logger') 		private logger,
		@EventDispatcher() 		private eventDispatcher: EventDispatcherInterface,
	) 
	{

	}

	public async create(contentInput: IContentInputDTO): Promise<{ content: IContent }> 
	{
		try 
		{
			this.logger.silly('Creating content');
			
			contentInput.published = ( contentInput.published == "on" );
			     
			const contentRecord = await this.contentModel.create({
				...contentInput
			});
			
			if (!contentRecord) {
				throw new Error('Content cannot be created');
			}                      
			
			/*this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord }); */

			return { contentRecord };
		} 
		catch (e) 
		{
			this.logger.error(e);
			throw e;
		}
	}

	public async update(contentId : Integer, contentInput: IContentInputDTO): Promise<{ content: IContent }> 
	{
		const contentRecord = await this.contentModel.findOne({
		   where: {
			   id: contentId
		   }
		});
		
		if (!contentRecord) 
		{
			throw new Error('Content not found.');
		}                                                    
		
		this.logger.silly('Updating content');
				
		contentInput.published = ( contentInput.published == "on" );
		
		await contentRecord.update(contentInput);
		
		return { contentRecord };
	
	}
}