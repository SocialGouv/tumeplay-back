import Container, { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IQuestionContent, IQuestionContentDTO } from '../interfaces/IQuestionContent';
import QuestionAnswerService from './question.answer';
import { IQuestionAnswerDTO } from '../interfaces/IQuestionAnswer';
import {IQuestionZone, IQuestionZoneDTO} from "../interfaces/IQuestionZone";
import config from '../config';

@Service()
export default class QuestionContentService {
    public constructor(
        @Inject('questionModel') private questionModel: any,
        @Inject('questionZoneModel') private questionZoneModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async findAll(req, criterias) {
        try {
            this.logger.silly('Finding contents');
            
            this.alterQuery(req, criterias);
            
            const contents = await this.questionModel.findAll(criterias);
            
            return contents;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findOne(req, criterias) {
        try {
            this.logger.silly('Finding one content');
            
            this.alterQuery(req, criterias);
            
            console.log("Criterias : " + JSON.stringify(criterias));
            
            const content = await this.questionModel.findOne(criterias);
            
            return content;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    
    
    public async create(questionContentInput: IQuestionContentDTO): Promise<{ questionContent: IQuestionContent }> {
        try {
            //this.logger.silly('Creating Question content');

            let tempQuestionContent: any = questionContentInput;
            if (typeof tempQuestionContent.published === 'string') {
                tempQuestionContent.published = tempQuestionContent.published == 'on';
            }
            
            let questionContent = null;
            try
            {
	            questionContent = await this.questionModel.create({
	                ...tempQuestionContent,
	            });
			}
			catch(err)
			{
				console.log(err);
			}

            if (!questionContent) {
                throw new Error('Question Content cannot be created');
            }

            /*this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord }); */

            return { questionContent };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(
        req, 
        questionId: number,
        questionInput: IQuestionContentDTO,
    ): Promise<{ question: IQuestionContent }> {
        const questionRecord = await this.findOne(req, {
            where: {
                id: questionId,
            },
        });

        if (!questionRecord) {
            throw new Error('Content not found.');
        }

        this.logger.silly('Updating content');

        if (typeof questionInput.published === 'string') {
            questionInput.published = questionInput.published == 'on';
        }

        const question = await questionRecord.update(questionInput);

        return { question };
    }

    public async updateWithAnswers(
        req,
        questionId: number,
        questionInput: IQuestionContentDTO,
    ): Promise<{ question: IQuestionContent }> {
        try {
            const questionRecord: IQuestionContent = await this.findOne(req, {
                where: {
                    id: questionId,
                },
            });

            if (!questionRecord) {
                throw new Error('question not found.');
            }

            if (typeof questionInput.published === 'string') {
                questionInput.published = questionInput.published == 'on';
            }
            let questionAnswerService = Container.get(QuestionAnswerService);

            const { questionAnswers } = await questionAnswerService.findByQuestionId(questionId);

            // For each item in answersExtras, check if already exist in the existing answers and update accordingly
            await Promise.all(
                questionInput.answersExtras.map(async answerItemToUpdateCreate => {
                    let foundExistingAnswer: any = questionAnswers.find(e => {
                        return e.idFictitiousInTheQuestion === answerItemToUpdateCreate.id;
                    });

                    if (foundExistingAnswer) {
                        // updating the answer text:
                        //this.logger.silly('Updating existing answer...');
                        await foundExistingAnswer.update({ title: answerItemToUpdateCreate.text });
                    } else {
                        // Creating a new answer and assign to this question:
                        let newAnswer: IQuestionAnswerDTO = {
                            title: answerItemToUpdateCreate.text,
                            questionContentId: questionRecord.id,
                            isCorrect: questionInput.rightAnswer === answerItemToUpdateCreate.id ? true : false,
                            published: true,
                            isDefaultData: true,
                        };

                        await questionAnswerService.create(newAnswer);
                    }
                }),
            );

            const question = await questionRecord.update(questionInput);

            return { question };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async createWithAnswers(
        questionContentInput: IQuestionContentDTO,
    ): Promise<{ questionContent: IQuestionContent }> {
        try {
            //this.logger.silly('Creating Question content');

            if (typeof questionContentInput.published === 'string') {
                questionContentInput.published = questionContentInput.published == 'on';
            }
            // Creating the question
            const questionContent: IQuestionContent = await this.questionModel.create({
                ...questionContentInput,
            });

            if (!questionContent) {
                throw new Error('Question Content with answers cannot be created');
            }
            // Setting up the right answer's "FICTITIOUS" id meaning : id only as per its question ( so between 1 to 3 normally )
            const rightAnswerFictitiousId: number = questionContentInput.rightAnswer || null;

            const answersToCreate: IQuestionAnswerDTO[] = questionContentInput.answersExtras.map(el => {
                return {
                    title: el.text,
                    questionContentId: questionContent.id,
                    isCorrect: el.id === rightAnswerFictitiousId,
                    published: true,
                    isDefaultData: true,
                    idFictitiousInTheQuestion: el.id,
                };
            });

            let questionAnswerService = Container.get(QuestionAnswerService);
            // Creating (in bulk ) all answers for this question
            await questionAnswerService.bulkcreate(answersToCreate);

            return { questionContent };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async findById(req, id: number): Promise<{ questionContent: IQuestionContent }> {
        try {
            this.logger.silly('Finding question content');
            const questionContent: IQuestionContent = await this.findOne(req, {
                where: { id },
            });
            return { questionContent };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async bulkCreateZone(questionZoneInputList: IQuestionZoneDTO[]): Promise<{ questionZone: IQuestionZone[] }> {
        try {
            this.logger.silly('Creating question Zones');
            const questionZones: IQuestionZone[] = await this.questionZoneModel.bulkCreate(questionZoneInputList);

            if (!questionZones) {
                throw new Error('Questions zones mappings could not be created');
            }

            return { questionZone: questionZones };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async bulkDeleteZone(questionId: number): Promise<{}> {
        try {
            this.logger.silly('Deleting questions zones');

            const contentZones: IQuestionZone[] = await this.questionZoneModel.destroy({
                where: {
                    questionContentId: questionId,
                },
            });

            return {};
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    private alterQuery(req, criterias)
    {
        if( typeof req.session !== 'undefined' && typeof req.session.zones !== "undefined" && req.session.zones.length > 0 )
        {
            if( req.session.roles.indexOf(config.roles.administrator) < 0 )
            {
                this.logger.silly("Altering criterias to add zone constraints");
                
                if(typeof criterias.include === 'undefined' )
                {
                    criterias.include = [];
                }
                
                criterias.include.push({
                    association: 'availability_zone',
                    where: { id : req.session.zones}   
                });
            }
            else
            {
                this.logger.silly("Skipping due to user role.");
            }
        }
        
        this.logger.silly("Out of alter.");
        
        return criterias;
    }
    
}
