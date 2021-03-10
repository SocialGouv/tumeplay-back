import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { IQuestionCategory } from '../../interfaces/IQuestionCategory';
import QuestionCategoryService from '../../services/question.category';
import { IQuestionContent } from '../../interfaces/IQuestionContent';
import Sequelize from 'sequelize';
const route = Router();

export default (app: Router) => {
    const QUIZZ_ROOT = '/quizzs';
    const QUIZZ_QUESTION_ROOT = '/questions';
    const QUIZZ_CATEGORY_ROOT = '/categories';

    app.use(QUIZZ_ROOT, route);

    /**
     * @description Get a list of published questions (structured FOR MOBILE) and return
     * only 10 ( random ) questions (sliced)
     */

    route.get('/:id?', async (req: Request, res: Response, next: NextFunction) => {
        const logger: any = Container.get('logger');
        try {
            let questions = [];
            
            const questionsCriterias = {
                where: {
                    published: true,
                },
                include: ['picture', 'sounds'],
            };
            
            const questionsAnswersCriterias = {
                where: {
                    published: true,
                },
            };
            
            if( req.query.zone )
            {
                questionsCriterias.include.push({
                    association: 'availability_zone',
                    where: { name : req.query.zone.charAt(0).toUpperCase() + req.query.zone.slice(1) }   
                });   
            }
        
            const questionsFound: IQuestionContent[] = await Container.get('questionModel').findAll(questionsCriterias);
            const answers = await Container.get('questionAnswerModel').findAll(questionsAnswersCriterias);

            const sortedAnswers = [];

            for (var i = 0; i < answers.length; i++) {
                let localAnswer = answers[i];
                let rightAnswer = false;

                if (sortedAnswers[localAnswer.questionContentId] === undefined) {
                    sortedAnswers[localAnswer.questionContentId] = {
                        answers: [],
                        rightAnswer: false,
                        neutralAnswer: false,
                    };
                }

                sortedAnswers[localAnswer.questionContentId]['answers'].push({
                    text: localAnswer.title,
                    id: sortedAnswers[localAnswer.questionContentId]['answers'].length + 1,
                });

                if (localAnswer.isCorrect) {
                    sortedAnswers[localAnswer.questionContentId]['rightAnswer'] =
                        sortedAnswers[localAnswer.questionContentId]['answers'].length;
                }
                if (localAnswer.isNeutral) {
                    sortedAnswers[localAnswer.questionContentId]['neutralAnswer'] =
                        sortedAnswers[localAnswer.questionContentId]['answers'].length;
                }
            }

            questions = questionsFound.map(questionItem => {
            	let localQuestionSound = false;
            	let localAnswerSound   = false;
            	if( req.query.zone && questionItem.sounds )
            	{
					questionItem.sounds.forEach(item => {
						if( item.availabilityZoneId == questionItem.availability_zone[0].id )
						{
							if ( item.question_sound.soundType == "question" || !item.question_sound.soundType )
							{
								localQuestionSound = item;	
							}
							else
							{
								localAnswerSound = item;
							}
						}
					});	
            	}
                let questionItemStructured: IQuestionContent = {
                    id: questionItem.id,
                    key: questionItem.id,
                    question: questionItem.content,
                    explanation: questionItem.answerText,
                    category: questionItem.categoryId,
                    theme: questionItem.themeId,
                    background: questionItem.picture ? questionItem.picture.path : false,
                    answers: sortedAnswers[questionItem.id] ? sortedAnswers[questionItem.id]['answers'] : [],
                    rightAnswer: sortedAnswers[questionItem.id] ? sortedAnswers[questionItem.id]['rightAnswer'] : [],
                    neutralAnswer: sortedAnswers[questionItem.id] ? sortedAnswers[questionItem.id]['neutralAnswer'] : [],
                    questionSound: localQuestionSound ? localQuestionSound.destination + '/' + localQuestionSound.filename : false,
                    answerSound: localAnswerSound ? localAnswerSound.destination + '/' + localAnswerSound.filename : false,
                };

                return questionItemStructured;
            });    
            
            return res.json(questions).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);

            return next(e);
        }
    });

    /**
     * @description Get a list of published categories (+picture item +theme item)
     */
    route.get(QUIZZ_CATEGORY_ROOT, async (req: Request, res: Response) => {
        try {
            const questionCategories: any = Container.get('questionCategoryModel');

            const categories: IQuestionCategory[] = await questionCategories.findAll({
                where: { published: true },
                include: ['picture', 'itsTheme'],
            });
            return res.json({ categories }).status(200);
        } catch (e) {
            throw e;
        }
    });
};
