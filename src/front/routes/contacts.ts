import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';

import ExportGeneratorService   from '../../services/export.generator';
import DateFormatterService     from '../../services/date.formatter';

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
     
     
    route.get(
        '/export/csv', 
        middlewares.isAuth, 
        middlewares.isAllowed(aclSection, 'global', 'view'),  
        async (req: Request, res: Response) => {
        try {
            const ContactModel: any = Container.get('contactModel');
            const logger: any 		= Container.get('logger');
            
            
            const dateService   = Container.get(DateFormatterService);
            const exportService = Container.get(ExportGeneratorService);    

            const dbContacts    = await ContactModel.findAll({ order:[ ['updatedAt', 'DESC'] ]});
            
            const contacts      = dbContacts.map(item => {
                const date = dateService.format(item.updatedAt);
                
                return [
                    item.id,
                    date.day + "/" + date.month + "/" + date.year,
                    item.name,
                    item.email,
                    item.zipCode,
                ]
            });
            
            const headers = [
                "Num",
                "Date",
                "Nom",
                "E-Mail",
                "Dpt"
            ]; 
            
            contacts.unshift(headers);
               
            logger.debug("Got contacts.");
            
            const { tmpFile }   = await exportService.generateCsv(contacts);
            
            const date  = dateService.format(new Date());
            
            res.download(tmpFile, 'Export-Contacts-' + date.year + date.month + date.day + '.csv');
        } catch (e) {
            throw e;
        }
    });                   
};
