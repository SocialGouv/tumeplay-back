import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IProduct } from '../../interfaces/IProduct';
import { IBox } from '../../interfaces/IBox';
import { IBoxProduct } from '../../interfaces/IBoxProduct';

const route = Router();

export default (app: Router) => {
    app.use('/boxs', route);

    route.get('/:id?', async (req: Request, res: Response, next: NextFunction) => {
        const logger: any = Container.get('logger');
        try {
            var _return = [];

            const ProductModel: IProduct = Container.get('productModel');
            const BoxProductModel: IBoxProduct = Container.get('boxProductModel');
            const BoxModel: IBox = Container.get('boxModel');
            const BoxZoneModel: any = Container.get('boxZoneModel');
            const ProductZoneModel: any = Container.get('productZoneModel');

            const zone =req.params.id;
            let boxs=[];
            let products=[];
            if(zone) {
                const boxZone = await BoxZoneModel.findAll({
                    where: {
                        availabilityZoneId: zone,
                    }, include: ['zone', 'box'],
                });


                for (var i = 0; i < boxZone.length; i++) {
                    let item = boxZone[i];
                    if (item.box.active && !item.box.deleted) {
                        boxs.push({...item});
                        var localBoxZone = {
                            key: item.id,
                            id: item.id,
                            title: item.title,
                            description: item.description,
                            available: item.available,
                            price: 500,
                            products: [],
                            picture: item.picture ? item.picture.destination + '/' + item.picture.filename : null,
                        };

                    }


                    const localProducts = await BoxProductModel.findAll({
                        where: {
                            boxId: item.id,
                        },
                        include: ['product'],
                    });

                    for (var z = 0; z < localProducts.length; z++) {

                        if (localProducts[z].product.stock <= 0) {
                            localBoxZone.available = false;
                        }

                        localBoxZone.products.push({
                            title: localProducts[z].product.title,
                            shortTitle: localProducts[z].product.shortDescription,
                            qty: localProducts[z].qty,
                        });
                    }

                    _return.push(localBoxZone);
                }

                const productZone = await ProductZoneModel.findAll({
                    where: {
                        availabilityZoneId: zone,
                    }, include: ['zone', 'product'],
                });

                for (var i = 0; i < productZone.length; i++) {
                    const fullProducts = await ProductModel.findAll({
                        where: {
                            deleted: false,
                            active: true,
                            id: productZone[i].productId


                        },
                        include: ['picture'],
                    });

                    products = fullProducts.map(item => {
                        return {
                            id: item.id,
                            title: item.title,
                            description: item.description,
                            shortDescription: item.shortDescription,
                            defaultQty: item.defaultQty,
                            qty: item.defaultQty,
                            active: item.active,
                            pictureId: item.pictureId,
                            isOrderable: item.stock > 0 ? item.isOrderable : false,
                            picture: {
                                id: item.picture.id,
                                path: item.picture.path,
                                filename: item.picture.filename,
                            }
                        };
                    });
                }
            }else{
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

                products = fullProducts.map(item => {
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
                        picture: {
                            id: item.picture.id,
                            path:item.picture.path,
                            filename: item.picture.filename,
                        }
                    };
                });

                for (var i = 0; i < boxs.length; i++) {
                    const box = boxs[i];

                    let localBox = {
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

            }



            return res.json({ boxs: _return, products: products }).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);

            return next(e);
        }
    });
};
