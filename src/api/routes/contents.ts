import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
const route = Router();

export default (app: Router) => {
	app.use('/contents', route);

	route.get('/', async (req: Request, res: Response, next: NextFunction) => {
		const logger: any = Container.get('logger');
		try {
			
            const ContentModel:any  = Container.get('contentModel')
            const contents = await ContentModel.findAll(
				{
					where: {
						published: true
					},
					include: ['picture']
				}
			);          
			                 
			
			return res.json({ contents }).status(200);
		}
		catch (e) {
			logger.error('🔥 error: %o', e);

			return next(e);
		}
	});

};
