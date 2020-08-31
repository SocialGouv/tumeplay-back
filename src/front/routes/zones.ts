import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import AvailabilityZoneService from "../../services/availability.zone";
import {IAvailabilityZoneDTO} from "../../interfaces/IAvailabilityZone";

const route = Router();

export default (app: Router) => {
	const aclSection = 'global';
    const ROOT_URL = '/zones';

    app.use(ROOT_URL, route);

    route.get(
    	'/', 
    	middlewares.isAuth,
    	middlewares.isAllowed(aclSection, 'zones', 'view'),  
    	async (req: Request, res: Response) => {
        try {
            const availabilityZoneModel: any = Container.get('availabilityZoneModel');

            const zones = await availabilityZoneModel.findAll();

            return res.render('page-zones', {
                zones,
            });
        } catch (e) {
            throw e;
        }
    });


    route.get(
    	'/add', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'zones', 'edit'),  
    	async (req: Request, res: Response) => {
        try {
            return res.render('page-zones-edit', {
            });
        } catch (e) {
            throw e;
        }
    });

    route.get(
    	'/edit/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'zones', 'edit'),  
    	async (req: Request, res: Response) => {
        try {
            console.log("zone in edit")
            const documentId = +req.params.id;
            const zoneServiceInstance: AvailabilityZoneService = Container.get(AvailabilityZoneService);


            const   {availabilityZone}   = await zoneServiceInstance.findById(documentId);
            console.log('availability_zone in edit')
            console.log(availabilityZone);
            return res.render('page-zones-edit', {
                availability_zone :availabilityZone
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
    	'/add', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'zones', 'edit'),  
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            let zoneItem: IAvailabilityZoneDTO = {
                name: req.body.name,
                enabled: req.body.enabled == 'on',
            };

            const zoneServiceInstance = Container.get(AvailabilityZoneService);
            const { zone } = await zoneServiceInstance.create(zoneItem);
            console.log('zone created', zone)

            return res.redirect(ROOT_URL);
        } catch (e) {
            throw e;
        }
    });

    route.post(
    	'/edit/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'zones', 'edit'),  
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            const documentId = req.params.id;

            let zoneItem: IAvailabilityZoneDTO = {
                name: req.body.name,
                enabled: req.body.enabled == req.body.enabled,

            };

            const zoneServiceInstance: AvailabilityZoneService = Container.get(AvailabilityZoneService);

          //  const { zone } = await zoneServiceInstance.findById(documentId);

            // Updating

            await zoneServiceInstance.update(documentId, zoneItem);

            return res.redirect(ROOT_URL);
        } catch (e) {
            throw e;
        }
    });

    route.post(
    	'/delete/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'zones', 'delete'),  
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Create endpoint with body: %o', req.body);

        try {
            const documentId = req.params.id;

            const zoneServiceInstance: AvailabilityZoneService = Container.get(AvailabilityZoneService);

            await zoneServiceInstance.update(documentId, { enabled:false });

            return res.redirect(ROOT_URL);
        } catch (e) {
            throw e;
        }
    });
};


