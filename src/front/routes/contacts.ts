import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
                                                            
const route = Router();

export default (app: Router) => {
    const ROOT_URL = '/contacts';
    const aclSection = 'contacts';

    app.use(ROOT_URL, route);

    route.get(
    	'/', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
        try {
            const ContactModel: any = Container.get('contactModel');

            const contacts = await ContactModel.findAll({ order:[ ['updatedAt', 'DESC'] ]});

            return res.render('page-contacts', {
                contacts,
            });
        } catch (e) {
            throw e;
        }
    });
                        
};
