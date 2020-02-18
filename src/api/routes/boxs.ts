import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IProduct } from '../../interfaces/IProduct';
import { IBox } from '../../interfaces/IBox';
import { IBoxProduct } from '../../interfaces/IBoxProduct';

const route = Router();

export default (app: Router) => {
    app.use('/boxs', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger: any = Container.get('logger');
        try {
            var _return = [];

            const ProductModel: IProduct = Container.get('productModel');
            const BoxProductModel: IBoxProduct = Container.get('boxProductModel');
            const BoxModel: IBox = Container.get('boxModel');

            const boxs = await BoxModel.findAll({
                where: {
                    deleted: false,
                    active: true,
                },
                include: ['picture'],
                order: [['id', 'ASC']],
            });

            const fullProducts = await ProductModel.findAll({
                where: {
                    deleted: false,
                    active: true,
                },
                include: ['picture'],
            });
            
            const products = fullProducts.map(item => {
	           return {
		           id: item.id,
		           title: item.title,
		           description:item.description,
		           shortDescription:item.shortDescription,
		           defaultQty:item.defaultQty,
		           qty: item.defaultQty,
		           active:item.active,
		           pictureId: item.pictureId,
		           picture: {
			           id: item.picture.id,
			           path:item.picture.path,
			           filename: item.picture.filename,
		           }
	           };
            });

            for (var i = 0; i < boxs.length; i++) {
                const box = boxs[i];

                var localBox = {
                    key: box.id,
                    id: box.id,
                    title: box.title,
                    description: box.description,
                    available: box.available,
                    price: 500,
                    products: [],
                    picture: box.picture.destination + '/' + box.picture.filename,
                };

                const localProducts = await BoxProductModel.findAll({
                    where: {
                        boxId: box.id,
                    },
                    include: ['product'],
                });

                for (var z = 0; z < localProducts.length; z++) {
                    localBox.products.push({
                        title: localProducts[z].product.title,
                        shortTitle: localProducts[z].product.shortDescription,
                        qty: localProducts[z].qty,
                    });
                }

                _return.push(localBox);
            }

            return res.json({ boxs: _return, products: products }).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);

            return next(e);
        }
    });
};
