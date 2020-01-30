import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { IPoi } from '../../interfaces/IPoi';
const route = Router();

export default (app: Router) => {
	app.use('/poi', route);


	route.get('/pickup', async (req: Request, res: Response, next: NextFunction) => {
		const logger: any = Container.get('logger');
		try {
			const poiService: any = Container.get('poiModel')

			const points : IPoi[] = await poiService.findAll({
				where: { active: true, type: 'pickup' },
				
			});
			
			
		    let parsedPoints = points.map((point) => {
		        return (
		            {
		                key: point.id,
					    id: point.id,
					    name: point.name,
					    description: point.description,
					    zipCode: point.zipCode,
					    street: point.street,
					    city: point.city,
					    coordinates: {
							latitude:  point.latitude,
							longitude: point.longitude
					    },
					    horaires: JSON.parse(point.horaires),
					    
					    
		            }
		        );
		    });
            
			
			          
			return res.json( parsedPoints ).status(200);
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
	
	function prepareTimetableForDisplay(timetables)
	{
		
	}
};