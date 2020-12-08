import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import { IPoiInputDTO } from '../../interfaces/IPoi';

import PoiService from '../../services/poi';
import UserService from '../../services/user';

const route = Router();

export default (app: Router) => {
    const ROOT_URL = '/poi';
    const aclSection = 'poi';

    app.use(ROOT_URL, route);

    route.get('/', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
        try {
            const PoiModel: any = Container.get('poiModel');

            const pois = await PoiModel.findAll();

            return res.render('page-poi', {   
                pois,
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
            const types = ['cegidd', 'pickup'];
            
            return res.render('page-poi-edit', {
                types,
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

            const zones 	 = await Container.get(UserService).getAllowedZones(req);

            const types = ['cegidd', 'pickup'];

            const { poi } = await  Container.get(PoiService).findById(documentId, true);

            return res.render('page-poi-edit', {
                poi,
                types,
                zones,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
    	'/add', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            let poiItem: IPoiInputDTO = {
                name: req.body.name,
                description: req.body.text,
                type: req.body.type,
                zipCode: req.body.zipCode,
                street: req.body.street,
                city: req.body.city,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                active: req.body.active == 'on',
                availabilityZoneId: req.body.poiZone,
            };

            const poiServiceInstance = Container.get(PoiService);
            const { poi } = await poiServiceInstance.create(poiItem);

            return res.redirect(ROOT_URL);
        } catch (e) {
            throw e;
        }
    });

    route.post(
    	'/edit/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	async (req: any, res: Response) => {
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
                deleted: false,
                pictureId: undefined,
                availabilityZoneId: req.body.poiZone,
            };

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

    route.post(
    	'/delete/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'delete'),  
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            const documentId = req.params.id;
            
            return res.redirect(ROOT_URL);
        } catch (e) {
            throw e;
        }
    });
};
