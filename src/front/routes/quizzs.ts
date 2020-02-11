import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import QuestionContentService from '../../services/question.content';
import QuestionAnswerService from '../../services/question.answer';
import QuestionCategoryService from '../../services/question.category';
import PictureService from '../../services/picture';
import { IQuestionContent, IQuestionContentDTO } from '../../interfaces/IQuestionContent';
import { IQuestionAnswer, IQuestionAnswerDTO } from '../../interfaces/IQuestionAnswer';
import { IPictureInputDTO } from '../../interfaces/IPicture';
import { IQuestionCategoryDTO, IQuestionCategory } from '../../interfaces/IQuestionCategory';

import { celebrate, Joi } from 'celebrate';

var multer = require('multer');

// QuestionCategory picture setup
var categoryMulterStorage = multer.diskStorage({
    destination: 'uploads/pictures/category',
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
var uploadCategory = multer({ storage: categoryMulterStorage });

// QuestionContent picture setup
var questionContentMulterStorage = multer.diskStorage({
    destination: 'uploads/pictures/question',
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
var uploadQuestion = multer({ storage: questionContentMulterStorage });

const route = Router();

export default (app: Router) => {
    const QUIZZ_ROOT = '/quizzs';
    const QUIZZ_QUESTION_ROOT = '/questions';
    const QUIZZ_CATEGORY_ROOT = '/categories';

    app.use(QUIZZ_ROOT, route);

    route.get(QUIZZ_QUESTION_ROOT + '/', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const questionContent: any = Container.get('questionModel');

            const questions: IQuestionContent[] = await questionContent.findAll({
                include: ['itsQuestionCategory', 'itsTheme', 'picture'],
            });

            return res.render('page-quizz-questions', {
                username: req['session'].name,
                questions: questions,
            });
        } catch (e) {
            throw e;
        }
    });

    route.get(QUIZZ_QUESTION_ROOT + '/add', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const CategoryModel_Service: any = Container.get('questionCategoryModel');
            const categories = await CategoryModel_Service.findAll();

            const ThematiquesService: any = Container.get('thematiqueModel');
            const themes = await ThematiquesService.findAll();

            return res.render('page-quizz-questions-edit', {
                username: req['session'].name,
                categories,
                themes,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
        QUIZZ_QUESTION_ROOT + '/add',
        middlewares.isAuth,
        uploadCategory.single('questionContentPicture'),
        async (req: Request, res: Response) => {
            const logger: any = Container.get('logger');

            try {
                const questionServiceInstance = Container.get(QuestionContentService);
                let questionContentItem: IQuestionContentDTO = {
                    title: req.body.title,
                    answerText: req.body.answerText,
                    content: req.body.content,
                    published: req.body.published,
                    categoryId: req.body.selectedCategory ? JSON.parse(req.body.selectedCategory).id : null,
                    themeId: req.body.selectedTheme ? JSON.parse(req.body.selectedTheme).id : null,
                    pictureId: null,
                };

                // let questionItems:

                logger.silly('POST: QUESTION --> req.body' + JSON.stringify(req.body));

                // Processing picture
                const picObject = req['file'];
                if (picObject) {
                    // Processing the file if any file in req.file (PICTURE)
                    const pictureServiceInstance = Container.get(PictureService);
                    const { picture } = await pictureServiceInstance.create(picObject as IPictureInputDTO);
                    // Assigning pic id to the thematique item
                    questionContentItem.pictureId = picture.id;
                }

                const { questionContent } = await questionServiceInstance.create(questionContentItem);
                logger.silly('Created a question');

                const questionContentId = questionContent.id;

                // Processing question possible answers:
                if (req.body.answerItems && Array.isArray(req.body.answerItems)) {
                    let answerItems: IQuestionAnswerDTO[] = req.body.answerItems.map(answerItem => {
                        return {
                            title: answerItem.title,
                            isCorrect: answerItem.isCorrect === 'on',
                            published: answerItem.published === 'on', // @TODO: is published really needed in question answer ?
                            questionContentId,
                        };
                    });
                    if (answerItems.length > 0) {
                        // Creating answers
                        const questionAnswerModel = Container.get(QuestionAnswerService);
                        await questionAnswerModel.bulkcreate(answerItems);
                    }
                }

                return res.redirect(QUIZZ_ROOT + QUIZZ_QUESTION_ROOT);
            } catch (e) {
                throw e;
            }
        },
    );

    route.get(QUIZZ_QUESTION_ROOT + '/edit/:id', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const documentId = req.params.id;
            const QuestionModel: any = Container.get('questionModel');

            const question = await QuestionModel.findOne({
                where: {
                    id: documentId,
                },
            });

            const ThematiquesService: any = Container.get('thematiqueModel');
            const themes = await ThematiquesService.findAll();

            const CategoryModel_Service: any = Container.get('questionCategoryModel');
            const categories = await CategoryModel_Service.findAll();

            const questionAnswerModel = Container.get('questionAnswerModel');

            const answers = await questionAnswerModel.findAll({
                where: {
                    questionContentId: documentId,
                },
            });

            return res.render('page-quizz-questions-edit', {
                username: req['session'].name,
                question,
                categories,
                themes,
                answers,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
        QUIZZ_QUESTION_ROOT + '/edit/:id',
        middlewares.isAuth,
        uploadCategory.single('questionContentPicture'),
        async (req: Request, res: Response) => {
            const logger: any = Container.get('logger');
            try {
                const documentId = +req.params.id;

                let questionContentItem: IQuestionContentDTO = {
                    title: req.body.title,
                    answerText: req.body.answerText,
                    content: req.body.content,
                    published: req.body.published,
                    categoryId: req.body.selectedCategory ? JSON.parse(req.body.selectedCategory).id : null,
                    pictureId: undefined,
                };

                // Processing picture
                const picObject = req['file'];
                if (picObject) {
                    // Processing the file if any file in req.file (PICTURE)
                    const pictureServiceInstance = Container.get(PictureService);
                    const { picture } = await pictureServiceInstance.create(picObject as IPictureInputDTO);
                    // Assigning pic id to the thematique item
                    questionContentItem.pictureId = picture.id;
                }

                console.log(req.body.answerItems);
                // Processing question possible answers:
                if (req.body.answerItems && Array.isArray(req.body.answerItems)) {
                    let answerItems: IQuestionAnswerDTO[] = req.body.answerItems.map(answerItem => {
                        if (answerItem.title != '') {
                            return {
                                title: answerItem.title,
                                isCorrect: answerItem.isCorrect === 'on',
                                published: true, // @TODO: is published really needed in question answer ?
                                questionContentId: documentId,
                            };
                        }
                    });
                    if (answerItems.length > 0) {
                        // Creating answers
                        const questionAnswerService = Container.get(QuestionAnswerService);
                        const questionAnswerModel = Container.get('questionAnswerModel');

                        await questionAnswerModel.destroy({ where: { questionContentId: documentId } });

                        await questionAnswerService.bulkcreate(answerItems);
                    }
                }

                const questionServiceInstance = Container.get(QuestionContentService);
                await questionServiceInstance.update(documentId, questionContentItem);
                logger.silly('Updated a question');

                return res.redirect(QUIZZ_ROOT + QUIZZ_QUESTION_ROOT);
            } catch (e) {
                throw e;
            }
        },
    );

    /*
     *
     *	END OF QUESTIONS ROUTES
     *
     */

    route.get(QUIZZ_CATEGORY_ROOT + '/', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const questionCategories: any = Container.get('questionCategoryModel');

            const categories: IQuestionCategory[] = await questionCategories.findAll({
                include: ['picture', 'itsTheme'],
            });
            /**
             * TODO :
             * -	use include to get pictures of each category
             * -	note: What to include ?
             */

            return res.render('page-quizz-categories', {
                username: req['session'].name,
                categories: categories,
            });
        } catch (e) {
            throw e;
        }
    });

    route.get(QUIZZ_CATEGORY_ROOT + '/add', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            // Getting list of thematiques
            const thematiqueService: any = Container.get('thematiqueModel');
            const thematiques = await thematiqueService.findAll();

            return res.render('page-quizz-categories-edit', {
                username: req['session'].name,
                thematiques,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
        QUIZZ_CATEGORY_ROOT + '/add',
        middlewares.isAuth,
        uploadCategory.single('categoryPicture'),
        async (req: Request, res: Response) => {
            const logger = Container.get('logger');

            try {
                console.log('REQ BODY:', req.body);

                let questionCategoryItem: IQuestionCategoryDTO = {
                    title: req.body.title,
                    content: req.body.content,
                    published: req.body.published,
                    pictureId: null,
                    themeId: req.body.selectedThematique ? JSON.parse(req.body.selectedThematique).id : null,
                    deleted: false,
                };
                console.log('Creation question category item:', questionCategoryItem);
                const picObject = req['file'];
                if (picObject) {
                    // Processing the file if any file in req.file (PICTURE)
                    const pictureServiceInstance = Container.get(PictureService);
                    const { picture } = await pictureServiceInstance.create(picObject as IPictureInputDTO);
                    // Assigning pic id to the thematique item
                    questionCategoryItem.pictureId = picture.id;
                }
                const categoryServiceInstance = Container.get(QuestionCategoryService);

                await categoryServiceInstance.create(questionCategoryItem as IQuestionCategoryDTO);

                return res.redirect(QUIZZ_ROOT + QUIZZ_CATEGORY_ROOT);
            } catch (e) {
                throw e;
            }
        },
    );

    route.get(QUIZZ_CATEGORY_ROOT + '/edit/:id', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const documentId = req.params.id;
            const categoryModel: any = Container.get('questionCategoryModel');

            const content = await categoryModel.findOne({
                where: {
                    id: documentId,
                },
            });

            const thematiqueService: any = Container.get('thematiqueModel');
            const thematiques = await thematiqueService.findAll();

            return res.render('page-quizz-categories-edit', {
                username: req['session'].name,
                content: content,
                thematiques,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
        QUIZZ_CATEGORY_ROOT + '/edit/:id',
        middlewares.isAuth,
        uploadCategory.single('categoryPicture'),

        async (req: Request, res: Response) => {
            try {
                const documentId = req.params.id;

                let questionCategoryItem: IQuestionCategoryDTO = {
                    title: req.body.title,
                    content: req.body.content,
                    published: req.body.published,
                    pictureId: undefined,
                    themeId: req.body.selectedThematique ? JSON.parse(req.body.selectedThematique).id : null,
                    deleted: false,
                };
                const picObject = req['file'];
                if (picObject) {
                    // Processing the file if any file in req.file (PICTURE)
                    const pictureServiceInstance = Container.get(PictureService);
                    const { picture } = await pictureServiceInstance.create(picObject as IPictureInputDTO);
                    // Assigning pic id to the thematique item
                    questionCategoryItem.pictureId = picture.id;
                }

                // updating the category
                const categoryServiceInstance = Container.get(QuestionCategoryService);
                await categoryServiceInstance.update(documentId, questionCategoryItem);

                return res.redirect(QUIZZ_ROOT + QUIZZ_CATEGORY_ROOT);
            } catch (e) {
                throw e;
            }
        },
    );
};
