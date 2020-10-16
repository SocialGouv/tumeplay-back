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
            const criterias = {
                where: { active: true },
                include: ['picture'],
                order: [['id', 'ASC']],
            };
            
            if( req.query.zone )
            {
                /*criterias.include.push({
                    association: 'availability_zone',
                    where: { name : req.query.zone.charAt(0).toUpperCase() + req.query.zone.slice(1) }   
                });*/   
            }
            
            const thematiques: IThematique[] = await Container.get('thematiqueModel').findAll(criterias);
            
            let parsedThematiques = thematiques.map(thematique => {
                return {
                    key: thematique.id,
                    id: thematique.id,
					isSpecial: thematique.isSpecial,
                    picture: thematique.picture
                        ? thematique.picture.destination + '/' + thematique.picture.filename
                        : false,
                    value: thematique.title,
                };
            });
            return res.json(parsedThematiques).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);

            return next(e);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger: any = Container.get('logger');
        try {
            const documentId = req.params.id;
            const ThematiqueModel: any = Container.get('thematiqueModel');

            const thematique: IThematique = await ThematiqueModel.findOne({
                where: {
                    id: documentId,
                },
                include: ['picture'],
            });
            return res.json({ thematique }).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    });
};
