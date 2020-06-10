import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import ContactService from '../../services/contact';
import { IContact, IContactInputDTO } from '../../interfaces/IContact';
import { celebrate, Joi, errors } from 'celebrate';
import middlewares from '../middlewares';

import AddressValidatorService from '../../services/addressValidator';
import Config from '../../config';

const route = Router();

export default (app: Router) => {
    const ORDERS_ROOT = '/contact';

    app.use(ORDERS_ROOT, route);
    
    route.post(
		'/save',
        middlewares.isAuth,
        celebrate({
            body: Joi.object({
                userAdress: Joi.object(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
        	const logger: any = Container.get('logger');
        	const userId = req.user.id;
            const userAddress = req.body.userAdress;    
            const contactServiceInstance = Container.get(ContactService);
            
            console.log(req.body);
            
            let success = false;
            
            const localContact = {
                name: userAddress.firstName,    
                email: userAddress.emailAdress,
                zipCode: userAddress.zipCode
            };
            
            let contactRecord = await contactServiceInstance.findOne(localContact);
            
            logger.debug("Found profile %o", contactRecord);
            
            if( !contactRecord.id )
            {
            	logger.debug("CREATE");
            	contactRecord = await contactServiceInstance.create(localContact);
				success = true;
				
				
            }
            
        	logger.debug('Testing user ' + userId + ' with profile '+ contactRecord.id);
            
        	return res.json({success : success}).status(200);
		},
	);

    app.use(errors());
};
