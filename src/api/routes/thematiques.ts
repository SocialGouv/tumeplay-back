import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { IThematique } from '../../interfaces/IThematique';
const route = Router();

export default (app: Router) => {
	app.use('/thematiques', route);


	route.get('/', async (req: Request, res: Response, next: NextFunction) => {
		const logger: any = Container.get('logger');
		try {
			const thematiqueService: any = Container.get('thematiqueModel')

			const thematiques: IThematique[] = await thematiqueService.findAll({
				where: { active: true },
				include: ['picture']
			});

			return res.json({ thematiques }).status(200);
		}
		catch (e) {
			logger.error('🔥 error: %o', e);

			return next(e);
		}
	});

	route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
		const logger: any = Container.get('logger');
		try {
			const documentId = req.params.id;
			const ThematiqueModel: any = Container.get('thematiqueModel')

			const thematique: IThematique = await ThematiqueModel.findOne({
				where: {
					id: documentId
				},
				include: ['picture']
			});
			return res.json({ thematique }).status(200);
		}
		catch (e) {
			logger.error('🔥 error: %o', e);
			return next(e);
		}
	});
};