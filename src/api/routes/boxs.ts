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
                            
            const criterias = {
                where: {
                    deleted: false,
                    active: true, 
                },
                include: ['picture'],
                order: [['weight', 'ASC']]
            };
            
            if( req.query.zone )
            {
                criterias.include.push({
                    association: 'availability_zone',
                    where: { name : req.query.zone.charAt(0).toUpperCase() + req.query.zone.slice(1) }   
                });
            }
            
            const boxs = await Container.get('boxModel').findAll(criterias);

            criterias.order = [['id', 'ASC']];
            
            const fullProducts = await Container.get('productModel').findAll(criterias);

            const products = fullProducts.map(item => {
                let picture = false;
                
                if( item.picture )
                {
                    picture = {
                        id: item.picture.id,
                        path: item.picture.path,
                        filename: item.picture.filename,
                    }                                   
                }
                
                return {
                    id: item.id,
                    title: item.title,
                    description:item.description,
                    shortDescription:item.shortDescription,
                    defaultQty:item.defaultQty,
                    qty: item.defaultQty,
                    active:item.active,
                    pictureId: item.pictureId,
                    isOrderable: item.stock > 0 ? item.isOrderable : false,
                    picture: picture
                };
            });

            for (var i = 0; i < boxs.length; i++) {
                const box = boxs[i];

                let localBox = {
                    key: box.id,
                    id: box.id,
                    title: box.title,
                    description: box.description,
                    shortDescription: box.shortDescription,
                    available: box.available,
                    price: 500,
                    products: [],
                    picture: box.picture ? box.picture.destination + '/' + box.picture.filename : false,
                };

                const localProducts = await Container.get('boxProductModel').findAll({
                    where: {
                        boxId: box.id,
                    },
                    include: ['product'],
                    order: [['id', 'ASC']]
                });

                for (var z = 0; z < localProducts.length; z++) {

                    if( localProducts[z].product.stock <= 0 )
                    {
                        localBox.available = false;
                    }

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
