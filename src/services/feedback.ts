import { Service, Inject } from 'typedi';
import { IFeedback, IFeedbackInputDTO } from '../interfaces/IFeedback';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class FeedbackService {
    public constructor(
        @Inject('feedbackModel') private feedbackModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(feedbackInput: IFeedbackInputDTO): Promise<{ feedback: IFeedback }> {
        try {
            this.logger.silly('Creating feedback', feedbackInput);


            const feedback: IFeedback = await this.feedbackModel.create({
                ...feedbackInput,
            });

            if (!feedback) {
                throw new Error('Content cannot be created');
            }

            return { feedback };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(
        feedbackId: number,
        feedbackInput: Partial<IFeedbackInputDTO>,
    ): Promise<{ feedback: IFeedback }> {
        const feedback = await this.feedbackModel.findOne({
            where: {
                id: feedbackId,
            },
        });

        if (!feedback) {
            throw new Error('Content not found.');
        }

        this.logger.silly('Updating feedback', feedbackInput);


        await feedback.update(feedbackInput);

        return { feedback };
    }
    public async findAll(): Promise<{ feedbacks: IFeedback[] }> {
        try {
            this.logger.silly('Finding all feedbacks');
            const feedbacks: IFeedback[] = await this.feedbackModel.findAll();

            return { feedbacks };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async findById(id: number): Promise<{ feedback: IFeedback }> {
        try {
            this.logger.silly('Finding feedback');
            const feedback: IFeedback = await this.feedbackModel.findOne({
                where: { id },
            });

            if (!feedback) {
                let err = new Error('feedback cannot be found');
                throw err;
            }

            return { feedback };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async findBy_idFictitious(idFictitious: number): Promise<{ feedback: IFeedback }> {
        try {
            this.logger.silly('Finding feedback');
            const feedback: IFeedback = await this.feedbackModel.findOne({
                where: { idFictitious },
            });
            return { feedback };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
