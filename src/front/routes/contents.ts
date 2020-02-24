import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import ContentService from '../../services/content';
import PictureService from '../../services/picture';
import { IContentInputDTO } from '../../interfaces/IContent';
import { IPictureInputDTO } from '../../interfaces/IPicture';
import { celebrate, Joi } from 'celebrate';

var multer = require('multer');

var contentMulterStorage = multer.diskStorage({
    destination: 'uploads/pictures/content',
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

var uploadContent = multer({ storage: contentMulterStorage });

const route = Router();

export default (app: Router) => {
    app.use('/contents', route);

    route.get('/', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const ContentModel: any = Container.get('contentModel');

            const contents = await ContentModel.findAll({ include: ['picture', 'itsTheme'] });

            return res.render('page-contents', {
                username: req['session'].name,
                contents: contents,
            });
        } catch (e) {
            throw e;
        }
        //res.end();
    });

    route.get('/add', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const CategoryModelService: any = Container.get('questionCategoryModel');
            const categories = await CategoryModelService.findAll();

            const ThemeModelService: any = Container.get('thematiqueModel');
            const themes = await ThemeModelService.findAll();

            return res.render('page-contents-edit', {
                username: req['session'].name,
                themes: themes,
                categories: categories,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post('/add', middlewares.isAuth, uploadContent.single('contentPicture'), async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            let contentItem: IContentInputDTO = {
                title: req.body.title,
                text: req.body.text,
                published: req.body.published,
                themeId: req.body.theme,
                categoryId: req.body.category,
                pictureId: null,
            };

            // Setup picture
            const picObject: IPictureInputDTO = req.file;

            if (picObject) {
                // Processing the file if any file in req.file (PICTURE)
                let pictureServiceInstance = Container.get(PictureService);
                const { picture } = await pictureServiceInstance.create(picObject);
                // Assigning pic id to the thematique item
                contentItem.pictureId = picture.id;
            }
            const contentServiceInstance = Container.get(ContentService);
            await contentServiceInstance.create(contentItem);

            return res.redirect('/contents');
        } catch (e) {
            throw e;
        }
    });

    route.get('/edit/:id', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const documentId = req.params.id;
            const ContentModel: any = Container.get('contentModel');

            const CategoryModelService: any = Container.get('questionCategoryModel');
            const categories = await CategoryModelService.findAll();

            const ThemeModelService: any = Container.get('thematiqueModel');
            const themes = await ThemeModelService.findAll();

            const content = await ContentModel.findOne({
                where: {
                    id: documentId,
                },
            });

            return res.render('page-contents-edit', {
                username: req['session'].name,
                content: content,
                themes: themes,
                categories: categories,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
        '/edit/:id',
        middlewares.isAuth,
        uploadContent.single('contentPicture'),
        async (req: any, res: Response) => {
            try {
                const logger = Container.get<any>('logger');
                const documentId = req.params.id;

                let contentItem: IContentInputDTO = {
                    title: req.body.title,
                    text: req.body.text,
                    published: req.body.published,
                    themeId: req.body.theme,
                    categoryId: req.body.category,
                    pictureId: undefined,
                };

                const picObject: IPictureInputDTO = req.file;

                if (picObject) {
                    // Processing the file if any file in req.file (PICTURE)
                    let pictureServiceInstance = Container.get(PictureService);
                    const { picture } = await pictureServiceInstance.create(picObject);
                    // Assigning pic id to the thematique item
                    contentItem.pictureId = picture.id;
                }
                const contentServiceInstance = Container.get(ContentService);
                await contentServiceInstance.update(documentId, contentItem);

                return res.redirect('/contents');
            } catch (e) {
                throw e;
            }
        },
    );
    
    route.post('/delete/:id', middlewares.isAuth, async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Delete endpoint with body: %o', req.body);

        try {
            const documentId = req.params.id;

            const contentServiceInstance = Container.get(ContentService);
            await contentServiceInstance.delete(documentId);


            return res.redirect('/contents');
        } catch (e) {
            throw e;
        }
    });

};
