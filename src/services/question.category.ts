import { Service, Inject } 			from 'typedi';
import config						from '../config';
import QuestionCategoryModel 		from '../models/question.category';
import events 						from '../subscribers/events';
import { EventDispatcher, EventDispatcherInterface } 	from '../decorators/eventDispatcher';
import { IQuestionCategory,IQuestionCategoryInputDTO }	from '../interfaces/IQuestionCategory';



@Service()
export default class QuestionCategoryService 
{
	constructor(
		@Inject('questionCategoryModel') private categoryModel : Models.QuestionCategoryModel,
		@Inject('logger') 		 		 private logger,
		@EventDispatcher() 		 		 private eventDispatcher: EventDispatcherInterface,
	) 
	{

	}

	public async create(questionContentInput: IQuestionCategoryInputDTO): Promise<{ questionContent: IQuestionCategory }> 
	{
		try 
		{
			this.logger.silly('Creating Category content');
			
			questionContentInput.published = ( questionContentInput.published == "on" );
			     
			const questionRecord = await this.categoryModel.create({
				...questionContentInput
			});
			
			if (!questionRecord) {
				throw new Error('Question Content cannot be created');
			}                      
			
			/*this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord }); */

			return { questionRecord };
		} 
		catch (e) 
		{
			this.logger.error(e);
			throw e;
		}
	}

	public async update(categoryId : Integer, categoryInput: IQuestionCategoryInputDTO): Promise<{ content: IQuestionCategory }> 
	{
		const categoryRecord = await this.categoryModel.findOne({
		   where: {
			   id: categoryId
		   }
		});
		
		if (!categoryRecord) 
		{
			throw new Error('Content not found.');
		}                                                    
		
		this.logger.silly('Updating content');
			
		categoryInput.published = ( categoryInput.published == "on" );
		
		await categoryRecord.update(categoryInput);
		
		return { categoryRecord };
		
	}
}