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

            const pois 	= await Container.get(PoiService).findAllFiltered(req, {include: [ 'availability_zone' ]});
            
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

            poi.horaires = prepareTimetable(poi.horaires);
            
            console.log(poi.horaires);
            
            if( !poi.phoneNumber )
            {
				poi.phoneNumber = '';
            }
            
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
                phoneNumber: req.body.phoneNumber,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                active: req.body.active == 'on',
                availabilityZoneId: req.body.poiZone,
                horaires: handleTimetable(req.body.horaires),
            };

            const poiServiceInstance = Container.get(PoiService);
            const { poi } = await poiServiceInstance.create(poiItem);

            req.session.flash = {msg: "Le POI a bien été créé.", status: true};
            
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
                phoneNumber: req.body.phoneNumber,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                active: req.body.active == 'on',
                availabilityZoneId: req.body.poiZone,
                horaires: handleTimetable(req.body.horaires),
            };

            const poiServiceInstance = Container.get(PoiService);
            const { poi } = await poiServiceInstance.update(documentId, poiItem);

            req.session.flash = {msg: "Le POI a bien été mis à jour.", status: true};
            
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
    
    function prepareTimetable(itemTimeTable)
    {
    	if( itemTimeTable )
    	{
			let localTable = JSON.parse(itemTimeTable);
			console.log(localTable);
			itemTimeTable = {
				lundi: prepareExistingTimeTable(localTable.lundi),
				mardi: prepareExistingTimeTable(localTable.mardi),
				mercredi: prepareExistingTimeTable(localTable.mercredi),
				jeudi: prepareExistingTimeTable(localTable.jeudi),
				vendredi: prepareExistingTimeTable(localTable.vendredi),
				samedi: prepareExistingTimeTable(localTable.samedi),
				dimanche: prepareExistingTimeTable(localTable.dimanche),
			};
			
			console.log(itemTimeTable);
    	}
		
		return itemTimeTable;
    }
    
    function prepareExistingTimeTable(dayTable)
    {
		var _return = {
            am: '',
            pm: '',
        };
        if (dayTable.am != '' && dayTable.am != "null" && typeof dayTable.am != 'undefined') {
            _return.am = dayTable.am;
        }

        if (dayTable.pm != '' && dayTable.pm != "null"&& typeof dayTable.pm != 'undefined') {
            _return.pm = dayTable.pm;
        }

        return _return;
    }
    
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
        if (timetable[0] != '' && timetable[0] != "null" && typeof timetable[0] != 'undefined') {
            _return.am = timetable[0];
        }

        if (timetable[1] != '' && timetable[1] != "null"&& typeof timetable[1] != 'undefined') {
            _return.pm = timetable[1];
        }

        return _return;
    }
};
