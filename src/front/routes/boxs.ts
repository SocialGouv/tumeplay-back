import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import { IBoxInputDTO } from '../../interfaces/IBox';
import { IPictureInputDTO } from '../../interfaces/IPicture';
import PictureService from '../../services/picture';

import BoxService from '../../services/box';

const route = Router();

var multer = require('multer');

var boxsMulterStorage = multer.diskStorage({
    destination: 'uploads/pictures/box',
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

var uploadBoxs = multer({ storage: boxsMulterStorage });

export default (app: Router) => {
    const ROOT_URL = '/boxs';

    app.use(ROOT_URL, route);

    route.get('/', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const BoxModel: any = Container.get('boxModel');

            const boxs = await BoxModel.findAll({
                where: {
                    deleted: false,
                },
                include: ['picture'],
            });

            return res.render('page-boxs', {
                username: req['session'].name,
                boxs,
            });
        } catch (e) {
            throw e;
        }
    });

    route.get('/add', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const productModel: any = Container.get('productModel');

            const products = await productModel.findAll({
                where: {
                    deleted: false,
                },
            });

            return res.render('page-box-edit', {
                products,
            });
        } catch (e) {
            throw e;
        }
    });

    route.get('/edit/:id', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const documentId = +req.params.id;
            const boxServiceInstance: BoxService = Container.get(BoxService);
            const productModel: any = Container.get('productModel');
            const boxProductModel: any = Container.get('boxProductModel');

            const products = await productModel.findAll({
                where: {
                    deleted: false,
                },
            });

            const currentProducts = await boxProductModel.findAll({
                where: {
                    boxId: documentId,
                },
            });

            const { box } = await boxServiceInstance.findById(documentId, true);

            return res.render('page-box-edit', {
                username: req['session'].name,
                box,
                products,
                currentProducts,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post('/add', middlewares.isAuth, uploadBoxs.single('boxPicture'), async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            let boxItem: IBoxInputDTO = {
                title: req.body.title,
                description: req.body.description,
                shortDescription: req.body.shortDescription,
                price: null,
                active: req.body.active == 'on',
                available: req.body.available == 'on',
                deleted: false,
                pictureId: null,
            };

            // Setup picture
            const picObject: IPictureInputDTO = req.file;

            if (picObject) {
                // Processing the file if any file in req.file (PICTURE)
                let pictureServiceInstance = Container.get(PictureService);
                const { picture } = await pictureServiceInstance.create(picObject);
                // Assigning pic id to the thematique item
                boxItem.pictureId = picture.id;
            }
            const boxServiceInstance = Container.get(BoxService);
            const { box } = await boxServiceInstance.create(boxItem);

            const boxProductModel = Container.get('boxProductModel');

            const products = await boxProductModel.findAll({
                where: {
                    boxId: box.id,
                },
            });

            if (req.body.selectedProduct && Array.isArray(req.body.selectedProduct)) {
                handleProducts(box, req.body.selectedProduct, req.body.qty);
            }

            return res.redirect(ROOT_URL);
        } catch (e) {
            throw e;
        }
    });

    const handleProducts = async (currentBox, selectedProducts, quantities) => {
        const boxServiceInstance = Container.get(BoxService);

        await boxServiceInstance.bulkDelete(currentBox.id);

        var filteredProducts = selectedProducts.filter(function(el) {
            return el != 0;
        });

        let productItems: IBoxProductDTO[] = filteredProducts.map((productItem, key) => {
            console.log(productItem);
            return {
                qty: quantities[key] != '' ? quantities[key] : null,
                boxId: currentBox.id,
                productId: productItem,
            };
        });
        console.log(productItems);
        if (productItems.length > 0) {
            // Creating answers
            await boxServiceInstance.bulkCreate(productItems);
        }
    };

    route.post('/edit/:id', middlewares.isAuth, uploadBoxs.single('boxPicture'), async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            const documentId = req.params.id;

            let productItem: IBoxInputDTO = {
                title: req.body.title,
                description: req.body.description,
                shortDescription: req.body.shortDescription,
                price: req.body.price,
                active: req.body.active == 'on',
                available: req.body.available == 'on',
                deleted: false,
                pictureId: undefined,
            };

            // Setup picture
            if (req.file) {
                const picObject: IPictureInputDTO = req.file;
                // Processing the file if any file in req.file (PICTURE)
                let pictureServiceInstance = Container.get(PictureService);
                const { picture } = await pictureServiceInstance.create(picObject);
                // Assigning pic id to the thematique item
                productItem.pictureId = picture.id;
            }

            const boxServiceInstance: BoxService = Container.get(BoxService);

            const { box } = await boxServiceInstance.findById(documentId);

            if (req.body.selectedProduct && Array.isArray(req.body.selectedProduct)) {
                handleProducts(box, req.body.selectedProduct, req.body.qty);
            }
            // Updating

            await boxServiceInstance.update(documentId, productItem);

            return res.redirect(ROOT_URL);
        } catch (e) {
            throw e;
        }
    });

    route.post('/delete/:id', middlewares.isAuth, async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            const documentId = req.params.id;

            const boxServiceInstance: BoxService = Container.get(BoxService);
            await boxServiceInstance.bulkDelete(req.params.id);

            await boxServiceInstance.update(documentId, { deleted: true });

            return res.redirect(ROOT_URL);
        } catch (e) {
            throw e;
        }
    });
};
