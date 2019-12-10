import { Service, Inject } 			from 'typedi';
import config						from '../config';
import QuestionContentModel 		from '../models/question.content';
import events 						from '../subscribers/events';
import { EventDispatcher, EventDispatcherInterface } 	from '../decorators/eventDispatcher';
import { IQuestionContent,IQuestionContentDTO }	from '../interfaces/IQuestionContent';



@Service()
export default class QuestionContentService 
{
	constructor(
		@Inject('questionModel') private questionModel : Models.QuestionContentModel,
		@Inject('logger') 		 private logger,
		@EventDispatcher() 		 private eventDispatcher: EventDispatcherInterface,
	) 
	{

	}

	public async create(questionContentInput: IQuestionContentDTO): Promise<{ questionContent: IQuestionContent }> 
	{
		try 
		{
			this.logger.silly('Creating Question content');
			
			let temp_QuestionContent:any = questionContentInput;
			temp_QuestionContent.published = ( questionContentInput.published == "on" );
			
			const questionContent:IQuestionContent = await this.questionModel.create({
				...temp_QuestionContent
			});
			
			if (!questionContent) {
				throw new Error('Question Content cannot be created');
			}                      
			
			/*this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord }); */

			return { questionContent };
		} 
		catch (e) 
		{
			this.logger.error(e);
			throw e;
		}
	}

	public async update(questionId : number, questionInput: IQuestionContentDTO): Promise<{ question: IQuestionContent }> 
	{
		const questionRecord = await this.questionModel.findOne({
		   where: {
			   id: questionId
		   }
		});
		
		if (!questionRecord) 
		{
			throw new Error('Content not found.');
		}                                                    
		
		this.logger.silly('Updating content');
			
		questionInput.published = ( questionInput.published == "on" );
		
		const question = await questionRecord.update(questionInput);
		
		return { question };
		
	}
}