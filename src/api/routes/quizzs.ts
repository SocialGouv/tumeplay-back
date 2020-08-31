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
            const questionAnswersContent: any = Container.get('questionAnswerModel');
             const questionZoneModel: any = Container.get('questionZoneModel');
            const questionContent: any = Container.get('questionModel');

            const zone =req.params.id;
            let questionsFound=[];
            const sortedAnswers = [];
            let questions = [];
            if (zone) {
                const questionsZone = await questionZoneModel.findAll({
                    where: {
                        availabilityZoneId: zone,
                    },  include: ['zone','questionContent'],
                });
                const answers = await questionAnswersContent.findAll({
                    where: {
                        published: true,
                    },
                });

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
                for (var i = 0; i < questionsZone.length; i++) {
                    let questionItem = questionsZone[i];
                    if (questionItem.questionContent.published) {
                        questionsFound.push({...questionItem});
                        let questionIteStructured ={
                            id: questionItem.questionContent.id,
                            key: questionItem.questionContent.id,
                            question: questionItem.questionContent.content,
                            explanation: questionItem.questionContent.answerText,
                            category: questionItem.questionContent.categoryId,
                            theme: questionItem.questionContent.themeId,
                            background: questionItem.questionContent.picture ? questionItem.questionContent.picture.path : false,
                            answers: sortedAnswers[questionItem.questionContent.id] ? sortedAnswers[questionItem.questionContent.id]['answers'] : [],
                            rightAnswer: sortedAnswers[questionItem.questionContent.id] ? sortedAnswers[questionItem.questionContent.id]['rightAnswer'] : [],
                            neutralAnswer: sortedAnswers[questionItem.questionContent.id] ? sortedAnswers[questionItem.questionContent.id]['neutralAnswer'] : [],
                        };
                        questions.push(questionIteStructured);
                    }
                }
            } else {
                const questionsFound: IQuestionContent[] = await questionContent.findAll({
                    where: {
                        published: true,
                    },
                    include: ['picture'],
                });
                const answers = await questionAnswersContent.findAll({
                    where: {
                        published: true,
                    },
                });

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
                    };

                    return questionItemStructured;
                });

            }


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
