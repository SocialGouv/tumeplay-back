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

            poi.horaires = JSON.parse(poi.horaires);
            
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
                horaires: handleTimetable(req.body.horaires),
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

            let poiItem = {
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
                horaires: handleTimetable(req.body.horaires),
            };

            const poiServiceInstance = Container.get(PoiService);
            const { poi } = await poiServiceInstance.update(documentId, poiItem);

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
    
    function handleTimetable(bodyParams)
    {
		return JSON.stringify({
			lundi: handleTimetableDay(bodyParams.lundi),
			mardi: handleTimetableDay(bodyParams.mardi),
			mercredi: handleTimetableDay(bodyParams.mercredi),
			jeudi: handleTimetableDay(bodyParams.jeudi),
			vendredi: handleTimetableDay(bodyParams.vendredi),
			samedi: handleTimetableDay(bodyParams.samedi),
			dimanche: handleTimetableDay(bodyParams.dimanche),
		});
    }
    
    function handleTimetableDay(timetable)
    {
        var _return = {
            am: '',
            pm: '',
        };
        if (timetable[0] != '') {
            _return.am = timetable[0];
        }

        if (timetable[1] != '') {
            _return.pm = timetable[1];
        }

        return _return;
    }
};
