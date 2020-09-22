import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
const route = Router();

export default (app: Router) => {
    app.use('/contents', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger: any = Container.get('logger');
        try {
            const criterias = {
                where: {
                    published: 1,
                },
                include: ['picture'],
            };
            
            if( req.query.zone )
            {
                criterias.include.push({
                    association: 'availability_zone',
                    where: { name : req.query.zone.charAt(0).toUpperCase() + req.query.zone.slice(1) }   
                });
            }
            
            const contents = await Container.get('contentModel').findAll(criterias);
            
            
            let parsedContent = contents.map(content => {
                return {
                    key: content.id,
                    id: content.id,
                    numberOfLines: 3,
                    theme: content.themeId,
                    category: content.categoryId,
                    picture: content.picture ? content.picture.destination + '/' + content.picture.filename : false,
                    title: content.title,
                    text: content.text,
                    link: content.link,
                };
            });
            return res.json(parsedContent).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);

            return next(e);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger: any = Container.get('logger');
        try {
            const ContentZoneModel: any = Container.get('contentZoneModel');
            const zone = req.params.id;

            const contents = await ContentZoneModel.findAll({
                where: {
                    availabilityZoneId: zone,
                },  include: ['zone','content'],
                });
            let parsedContent = contents.map(content => {
                if(content.content.published ===1){
                    return {
                        key: content.content.id,
                        id: content.content.id,
                        numberOfLines: 3,
                        theme: content.content.themeId,
                        category: content.content.categoryId,
                        picture: content.content.picture ? content.content.picture.destination + '/' + content.content.picture.filename : false,
                        title: content.content.title,
                        text: content.content.text,
                        link: content.content.link,
                        //availabilityZoneId:content.availabilityZoneId
                    };
                }

            });
            return res.json(parsedContent).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);

            return next(e);
        }
    });
};
