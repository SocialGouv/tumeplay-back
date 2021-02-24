import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IQuestionFeedback, IQuestionFeedbackDTO } from '../interfaces/IQuestionFeedback';
import { IContentZone } from '../interfaces/IContentZone';

@Service()
export default class QuestionFeedbackService {
    public constructor(
        @Inject('questionFeedbackModel') private questionFeedbackModel: Models.QuestionFeedbackModel,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async findOne(searchedQuestionFeedback: IQuestionFeedbackDTO): Promise<{ questionFeedback: IQuestionFeedback }> {
        try {
            this.logger.silly('Searching questionFeedback %o', searchedQuestionFeedback);

            const questionFeedbackRecord = await this.questionFeedbackModel.findOne({
                where: searchedQuestionFeedback
            });

            return { questionFeedback :questionFeedbackRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async create(questionFeedbackInput: IQuestionFeedbackDTO): Promise<{ questionFeedback: IQuestionFeedback }> {
        try {
            this.logger.silly('Creating questionFeedback');

            const questionFeedbackRecord = await this.questionFeedbackModel.create({
                ...questionFeedbackInput,
            });

            if (!questionFeedbackRecord) {
                throw new Error('QuestionFeedback cannot be created');
            }

            return { questionFeedback: questionFeedbackRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(questionFeedbackId: Integer, questionFeedbackInput: IQuestionFeedbackDTO): Promise<{ questionFeedback: IQuestionFeedback }> {
        const questionFeedbackRecord = await this.questionFeedbackModel.findOne({
            where: {
                id: questionFeedbackId,
            },
        });

        if (!questionFeedbackRecord) {
            throw new Error('QuestionFeedback not found.');
        }

        this.logger.silly('Updating questionFeedback');

        await questionFeedbackRecord.update(questionFeedbackInput);

        return { questionFeedback: questionFeedbackRecord };
    }

    public async calculateRatio(total: any, part: any) {
        return ( part*100/total );
    }
    
    public async getLikedContents(id)
    {   const allFeedback =  await this.questionFeedbackModel.findAll({ include: ['question','feedback'] });
        const likes = await this.questionFeedbackModel.findAll({ where: { id: id , isLiked: true}, include: ['question','feedback'] });
        const ratio = await this.calculateRatio(allFeedback.length, likes.length);
        return ( ratio ? ratio.toFixed(2) : 0 );
    }
    
    public async getDislikedContents(id)
    {   const allFeedback =  await this.questionFeedbackModel.findAll({ include: ['question','feedback'] });
        const dislikes = await this.questionFeedbackModel.findAll({ where: { id: id , isDisliked: true}, include: ['question','feedback'] });
        const ratio = await this.calculateRatio(allFeedback.length, dislikes.length);
        return ( ratio ? ratio.toFixed(2) : 0 );
    }
    
    public async getContentStatistics(id)
    {  
    	const allFeedback =  await this.questionFeedbackModel.findAll({ where: { questionContentId: id}});
    	
    	let likes 	 = 0;
    	let dislikes = 0;
    	
    	allFeedback.forEach( item => {
			if( item.isLiked )
			{
				likes++;
			}
			if( item.isDisliked)
			{
				dislikes++;
			}
    	})
    	
        const likesRatio 	= await this.calculateRatio( ( likes + dislikes ), likes);
        const dislikesRatio = await this.calculateRatio( ( likes + dislikes ), dislikes);
        return {
			likes: 	  ( likesRatio 		? likesRatio.toFixed(1) : 0 ),
			dislikes: ( dislikesRatio 	? dislikesRatio.toFixed(1) : 0 ),
        };
    }
    
    
    public async bulkDelete(contentId: number): Promise<{}> {
        try {
            this.logger.silly('Deleting question feedback');

            await this.questionFeedbackModel.destroy({
                where: {
                    questionContentId: contentId,
                },
            });

            return {};
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
