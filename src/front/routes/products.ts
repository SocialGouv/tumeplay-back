import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import { IProductInputDTO } from '../../interfaces/IProduct';
import { IPictureInputDTO } from '../../interfaces/IPicture';
import PictureService from '../../services/picture';
import ProductService from '../../services/product';
import UserService from '../../services/user';
import {IProductZoneDTO} from "../../interfaces/IProductZone";

const route = Router();

var multer = require('multer');

var productMulterStorage = multer.diskStorage({
    destination: 'uploads/pictures/product',
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

var uploadProduct = multer({ storage: productMulterStorage });

export default (app: Router) => {
    const products_URL = '/products';
    const aclSection = 'products';

    app.use(products_URL, route);

    route.get('/', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
        try {
            const zones    = await Container.get(UserService).getAllowedZones(req);
            const products = await Container.get(ProductService).findAll(req, {
                where: {
                    deleted: false,
                },
                include: ['picture', 'availability_zone'],
            });
                            
            return res.render('page-products', {
                products,
                zones,
            });
        } catch (e) {
            throw e;
        }
    });

    route.get(
    	'/add', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	async (req: Request, res: Response) => {
        try {
        	const zones = await Container.get(UserService).getAllowedZones(req);
            return res.render('page-product-edit', {
                zones
            });
        } catch (e) {
            throw e;
        }
    });

    route.get(
    	'/edit/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	async (req: Request, res: Response) => {
        try {
            const documentId = +req.params.id;
            const productServiceInstance: ProductService = Container.get(ProductService);

            const product = await productServiceInstance.findOne(req, {
                where: {
                    id: documentId,
                },
                include: ['picture', 'availability_zone']
			});
            
            product.zoneIds = product.availability_zone.map(item => {
				return item.id;
            });      
            
            const zones = await Container.get(UserService).getAllowedZones(req);
            
            return res.render('page-product-edit', {
                product,
                zones
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
    	'/add', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	uploadProduct.single('productPicture'), async (req: any, res: Response) => 
    	{
	        const logger: any = Container.get('logger');
	        logger.debug('Calling Front Create endpoint with body: %o', req.body);

	        try {
	            let productItem: IProductInputDTO = {
	                title: req.body.title,
	                description: req.body.description,
	                shortDescription: req.body.shortDescription,
	                supplierDescription: req.body.supplierDescription,
	                price: null,
	                stock: req.body.stock ? req.body.stock : 0,
	                active: req.body.active == 'on',
	                isOrderable: req.body.isOrderable == 'on',
	                deleted: false,
	                pictureId: null,
	            };

	            // Setup picture
	            const picObject: IPictureInputDTO = req.file;

	            if (picObject) {
	                // Processing the file if any file in req.file (PICTURE)
	                const { picture } = await Container.get(PictureService).create(picObject);
	                // Assigning pic id to the thematique item
	                productItem.pictureId = picture.id;
	            }
	            
	            const productServiceInstance = Container.get(ProductService);
	            
	            const {product} = await productServiceInstance.create(productItem);
	            
	            let targetZones = [];
	            const zones = await Container.get(UserService).getAllowedZones(req);
                if( zones && zones.length == 1 )
                {
					targetZones = [zones[0].id];
                }   
                else
                {
					targetZones = req.body.zoneId;
                }                                                                                                                                                             
                  
	            await handleZones(product, targetZones);

	            return res.redirect(products_URL);
	        } catch (e) {
	            throw e;
	        }
    });
    const handleZones = async (currentProduct, zoneId) => {
        const productServiceInstance = Container.get(ProductService);

        await productServiceInstance.bulkDelete(currentProduct.id);


        zoneId = ( typeof zoneId != 'undefined' &&  Array.isArray(zoneId) ) ? zoneId : [zoneId];
        var filteredZones = zoneId.filter(function (el) {
            return el != 0;
        });

        let zonesItems: IProductZoneDTO[] = filteredZones.map((zoneItem) => {
            return {
                productId: currentProduct.id,
                availabilityZoneId: zoneItem,
            };
        });

        if (zonesItems.length > 0) {
            // Creating zones
            await productServiceInstance.bulkCreateZone(zonesItems);
        }
    };


    route.post(
        '/edit/:id',
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),  
        uploadProduct.single('productPicture'),
        async (req: any, res: Response) => {
            const logger: any = Container.get('logger');
            logger.debug('Calling Front Create endpoint with body: %o', req.body);

            try {
                const documentId = req.params.id;

                let productItem: IProductInputDTO = {
                    title: req.body.title,
                    description: req.body.description,
                    shortDescription: req.body.shortDescription,
                    supplierDescription: ( req.body.supplierDescription ? req.body.supplierDescription : '' ),
                    price: req.body.price,
                    active: req.body.active == 'on',
                    isOrderable: req.body.isOrderable == 'on',
                    stock: req.body.stock ? req.body.stock : 0,
                    deleted: false,
                    pictureId: undefined,
                };

                // Setup picture
                if (req.file) {
                    const picObject: IPictureInputDTO = req.file;
                    // Processing the file if any file in req.file (PICTURE)
                    const { picture } = await Container.get(PictureService).create(picObject);
                    // Assigning pic id to the thematique item
                    productItem.pictureId = picture.id;
                }
                const productServiceInstance: ProductService = Container.get(ProductService);

                const {product} = await productServiceInstance.findById(req, documentId,true);
                

                // Updating
                await productServiceInstance.update(req, documentId, productItem);
                
                
	            let targetZones = [];
	            const zones = await Container.get(UserService).getAllowedZones(req);
                if( zones && zones.length == 1 )
                {
					targetZones = [zones[0].id];
                }   
                else
                {
					targetZones = req.body.zoneId;
                }   
                await handleZones(product, targetZones);
                
                return res.redirect(products_URL);
            } catch (e) {
                throw e;
            }
        },
    );

    route.post(
    	'/delete/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'delete'),  
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            const documentId = req.params.id;

            // Updating
            await Container.get(ProductService).update(req, documentId, { deleted: true });

            return res.redirect(products_URL);
        } catch (e) {
            throw e;
        }
    });
};
