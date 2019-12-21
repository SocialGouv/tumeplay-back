import { Service, Inject } from 'typedi';
import config from '../config';
import { IQuestionAnswer, IQuestionAnswerDTO } from '../interfaces/IQuestionAnswer';
import events from '../subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';


@Service()
export default class QuestionAnswerService {
	constructor(
		@Inject('questionAnswerModel') private questionAnswerModel: any,
		@Inject('logger') private logger,
		@EventDispatcher() private eventDispatcher: EventDispatcherInterface,
	) {

	}

	public async create(questionAnswerInput: IQuestionAnswerDTO): Promise<{ questionAnswer: IQuestionAnswer }> {
		try {
			//this.logger.silly('Creating questionAnswer', questionAnswerInput);

			const questionAnswer: IQuestionAnswer = await this.questionAnswerModel.create({
				...questionAnswerInput
			});

			if (!questionAnswer) {
				throw new Error('Answer setup cannot be created');
			}

			return { questionAnswer };
		}
		catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	public async bulkcreate(questionAnswerInput: IQuestionAnswerDTO[]): Promise<{ questionAnswers: IQuestionAnswer[] }> {
		try {
			//this.logger.silly('Creating questionAnswer', questionAnswerInput);

			const questionAnswers: IQuestionAnswer[] = await this.questionAnswerModel.bulkCreate(questionAnswerInput);

			if (!questionAnswers) {
				throw new Error('Answer setup cannot be created');
			}

			return { questionAnswers };
		}
		catch (e) {
			this.logger.error(e);
			throw e;
		}
	}

	public async update(questionAnswerId: Number, questionAnswerInput: IQuestionAnswerDTO): Promise<{ questionAnswer: IQuestionAnswer }> {
		const questionAnswer = await this.questionAnswerModel.findOne({
			where: {
				id: questionAnswerId
			}
		});

		if (!questionAnswer) {
			throw new Error('QuestionAnswer not found.');
		}

		this.logger.silly('Updating questionAnswer');
		const updatedQuestionAnswer: IQuestionAnswer = await questionAnswer.update(questionAnswerInput);

		if (!updatedQuestionAnswer) {
			throw new Error('QuestionAnswer could not be updated.');
		}

		return { questionAnswer: updatedQuestionAnswer };

	}


	public async findByQuestionId(questionContentId: Number): Promise<{ questionAnswers: IQuestionAnswer[] }> {
		try {
			if (!questionContentId) throw new Error('Missing question content id')
			const questionAnswers: IQuestionAnswer[] = await this.questionAnswerModel.findAll({
				where: { questionContentId }
			});
			return { questionAnswers };
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
}