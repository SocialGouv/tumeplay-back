import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { IQuestionCategory } from '../../interfaces/IQuestionCategory';
import QuestionCategoryService from '../../services/question.category';

const route = Router();

export default (app: Router) => {
	app.use('/quizzs', route);
	const QUIZZ_ROOT = '/quizzs';
	const QUIZZ_QUESTION_ROOT = '/questions';
	const QUIZZ_CATEGORY_ROOT = '/categories';

	route.get('/', async (req: Request, res: Response, next: NextFunction) => {
		const logger: any = Container.get('logger');
		try {
			const questionContent: any = Container.get('questionModel')

			const questions = await questionContent.findAll(
				{
					where: {
						published: true
					}
				}
			);

			return res.json({ questions }).status(200);
		}
		catch (e) {
			logger.error('🔥 error: %o', e);

			return next(e);
		}
	});

	/**
	 * @description Get a list of published categories (+picture item +theme item)
	 */
	route.get(QUIZZ_CATEGORY_ROOT, async (req: Request, res: Response) => {
		try {
			const questionCategories: any = Container.get('questionCategoryModel')

			const categories: IQuestionCategory[] = await questionCategories.findAll(
				{
					where: { published: true },
					include: ['picture', 'itsTheme']
				});
			return res.json({ categories }).status(200);

		}
		catch (e) {
			throw e;
		}
	});


	/**
	 * @description Get a list of published categories (+picture item +theme item) by THEME ID
	 * @example GET quizzs/categories/getPublishedCategoriesByThemeId/5
	 */
	route.get(QUIZZ_CATEGORY_ROOT + '/getPublishedCategoriesByThemeId/:themeId', async (req: Request, res: Response) => {
		try {
			const themeId = +req.params.themeId;
			if (!themeId) throw Error('Missing parameter : theme Id .')
			const questionCategories: any = Container.get('questionCategoryModel')

			const categories: IQuestionCategory[] = await questionCategories.findAll(
				{
					where: { themeId, published: true },
					include: ['picture', 'itsTheme']
				});
			return res.json({ categories }).status(200);

		}
		catch (e) {
			throw e;
		}
	});
};