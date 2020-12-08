import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import { IBoxInputDTO } from '../../interfaces/IBox';
import { IPictureInputDTO } from '../../interfaces/IPicture';
import { IBoxZoneDTO } from '../../interfaces/IBoxZone';
import { IBoxProductInputDTO } from '../../interfaces/IBoxProduct';

import PictureService from '../../services/picture';
import UserService from '../../services/user';
import BoxService from '../../services/box';
import ProductService from '../../services/product';

const route = Router();

var multer = require('multer');

var boxsMulterStorage = multer.diskStorage({
    destination: 'uploads/pictures/box',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

var uploadBoxs = multer({storage: boxsMulterStorage});

export default (app: Router) => {
    const ROOT_URL = '/boxs';
    const aclSection = 'boxs';

    app.use(ROOT_URL, route);

    route.get(
    	'/', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
        try {

            const zones = await Container.get(UserService).getAllowedZones(req);
            const boxs  = await Container.get(BoxService).findAll(req, {
                where: {
                    deleted: false,
                },
                include: ['picture', 'availability_zone'],
            });

            return res.render('page-boxs', {
                boxs,
                zones
            });
        } catch (e) {
            throw e;
        }
        },
    );

    route.get(
    	'/add', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	async (req: Request, res: Response) => {
        	try {
        		
                const zones 	= await Container.get(UserService).getAllowedZones(req);
                const products 	= await Container.get(ProductService).findAll(req, {
                    where: {
                        deleted: false,
                    },
                });
                
                
                return res.render('page-box-edit', {
                    products,
                    zones,
                });
            } catch (e) {
                throw e;
            }
        },
    );

    route.get(
        '/edit/:id',
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),
        async (req: Request, res: Response) => {
            try {
                const documentId = +req.params.id;
                const zones 	 = await Container.get(UserService).getAllowedZones(req);

                const products = await Container.get(ProductService).findAll(req, {
                    where: {
                        deleted: false,
                    },
                });
                
                const currentProducts = await Container.get('boxProductModel').findAll({
                    where: {
                        boxId: documentId,
                    },
                });
                
                const box = await Container.get(BoxService).findOne(req, {
	                where: {
	                    id: documentId,
	                },
	                include: ['picture', 'availability_zone']
				});
				
				box.zoneIds = box.availability_zone.map(item => {
					return item.id;
	            });      

                return res.render('page-box-edit', {
                    box,
                    products,
                    currentProducts,
                    zones,
                });
            } catch (e) {
                throw e;
            }
        },
    );

    route.post(
    	'/add', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	uploadBoxs.single('boxPicture'), async (req: any, res: Response) => 
    	{
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
	                const { picture } = await Container.get(PictureService).create(picObject);
	                // Assigning pic id to the thematique item
	                boxItem.pictureId = picture.id;
	            }
                
	            const { box } = await Container.get(BoxService).create(boxItem);
                           
	            if (req.body.selectedProduct && Array.isArray(req.body.selectedProduct)) {
	                await handleProducts(box, req.body.selectedProduct, req.body.qty, req.body.zoneId);
	            }

	            
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
                
	            await handleBoxZones(box, targetZones);
	            
	            req.session.flash = {msg: "La box a bien été créée.", status: true};
	            
	            return res.redirect(ROOT_URL);
            } catch (e) {
                throw e;
            }
        },
    );

    route.post(
    	'/edit/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	uploadBoxs.single('boxPicture'), async (req: any, res: Response) => 
    	{
	        const logger: any = Container.get('logger');
	        logger.debug('Calling Front Create endpoint with body: %o', req.body);

	        try {
	            const documentId = req.params.id;
	            
	            let boxItem: IBoxInputDTO = {
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
	                const { picture } = await Container.get(PictureService).create(picObject);
	                // Assigning pic id to the thematique item
	                boxItem.pictureId = picture.id;
	            }

	            const boxServiceInstance: BoxService = Container.get(BoxService);

	            const {box} = await boxServiceInstance.update(req, documentId, boxItem);

	            
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
	            await handleBoxZones(box, targetZones);
	            
	            if (req.body.selectedProduct && Array.isArray(req.body.selectedProduct)) {
	                await handleProducts(box, req.body.selectedProduct, req.body.qty );
	            }
	            
	            req.session.flash = {msg: "La box a bien été mise à jour.", status: true};
	                        
	            return res.redirect(ROOT_URL);
	        } catch (e) {
	            throw e;
	        }
		}
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

            const boxServiceInstance: BoxService = Container.get(BoxService);
            
            const {box} = await boxServiceInstance.findById(req, documentId);
            
            if( box )
            {
                await boxServiceInstance.bulkDeleteBoxProducts(req.params.id);

                await boxServiceInstance.update(req, documentId, { deleted: true });
            }
            return res.redirect(ROOT_URL);
        } catch (e) {
            throw e;
        }
    });
    
    const handleBoxZones = async (currentBox, zoneId) => {
		zoneId = ( typeof zoneId != 'undefined' &&  Array.isArray(zoneId) ) ? zoneId : [zoneId];

        var filteredZones = zoneId.filter(function (el) {
            return el != 0;
        });
        let zonesItems: IBoxZoneDTO[] = filteredZones.map((zoneItem) => {
            return {
                boxId: currentBox.id,
                availabilityZoneId: zoneItem,
            };
        });
        
        if (zonesItems.length > 0) {
            // Creating zones
            await Container.get(BoxService).bulkCreateZone(currentBox.id, zonesItems);
        }
    }
    
    const handleProducts = async (currentBox, selectedProducts, quantities) => {
        const boxServiceInstance = Container.get(BoxService);

        await boxServiceInstance.bulkDeleteBoxProducts(currentBox.id);

        var filteredProducts = selectedProducts.filter(function (el) {
            return el != 0;
        });
        

        let productItems: IBoxProductInputDTO[] = filteredProducts.map((productItem, key) => {
            return {
                qty: quantities[key] != '' ? quantities[key] : null,
                boxId: currentBox.id,
                productId: productItem,
            };
        });
        
        if (productItems.length > 0) {
            // Creating products
            await boxServiceInstance.bulkCreate(productItems);
        }
        
    };

};
