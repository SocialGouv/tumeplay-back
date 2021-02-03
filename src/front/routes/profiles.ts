import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { IUser, IUserInputDTO } from '../../interfaces/IUser';
import { celebrate, Joi } from 'celebrate';
import middlewares from '../middlewares';

import UserService from '../../services/user';
import AuthService from '../../services/auth';
import PoiService from '../../services/poi';

import config from '../../config';

const route = Router();

export default (app: Router) => {
    const routes = {
        PROFILE_ROOT: '/profiles',
    };                                        

    const pageNames = {
        profile: {
            viewList: 'page-profiles',
            addEdit: 'page-profiles-edit',
        },
    };

    app.use(routes.PROFILE_ROOT, route);

    route.get('/', 
    	middlewares.isAuth,
    	middlewares.isAllowed('global', 'users', 'view'),  
    	async (req: Request, res: Response) => {
        try {
            const userService = Container.get(UserService);

            const profiles = await userService.findAll(req, {include: ['availability_zone']});
            
            let   users = [];
            
            profiles.map(item => {
                if( item.name != null )
                {
                	item.roles = JSON.parse(item.roles);
                	
                    users.push(item);
                }
            })
            
            return res.render(pageNames.profile.viewList, {
                users,
                rolesLabels: config.roles_readable,
            });
        } catch (e) {
            throw e;
        }
    });
    
    route.get('/edit/:id', 
        middlewares.isAuth,
        middlewares.isAllowed('global', 'users', 'edit'),  
        async (req: Request, res: Response) => {
        try {
        	const userService = Container.get(UserService);
            const user = await userService.findOne(req, {
                where: {
                    id: req.params.id,
                },
                include: [
                	'availability_zone',
                	'poi',
                ]
            });
            user.roles   = JSON.parse(user.roles);
            user.zoneIds = user.availability_zone.map(item => {
				return item.id;
            });
            
            user.poiIds  = user.poi.map(item => {
				return item.id;
            });
            
            const zones  = await Container.get('availabilityZoneModel').findAll();
            const pois   = await Container.get(PoiService).findAllFiltered(req, {include: [ 'availability_zone' ], order: ['name']});
            
            return res.render(pageNames.profile.addEdit, {
                roles: config.roles,
                rolesLabels: config.roles_readable,
                pois,
                user,
                zones
            });
        } catch (e) {
            throw e;
        }
    });
    
    route.post('/edit/:id', 
        middlewares.isAuth,
        middlewares.isAllowed('global', 'users', 'edit'),
        
        async (req: Request, res: Response) => {
        try {
            const userId   = req.params.id;			
            
			let userItem: IUserInputDTO = await handleUserData(req.body);
            
            if( !userItem )
            {
				return res.redirect('/profiles/edit/' + id);	
            }
                                    
            await Container.get(UserService).update(req, userId, userItem);
                
			await handleUserZones(userId, req.body);	
            await handleUserPois(userId, req.body);
            
            return res.redirect('/profiles');
        } catch (e) {
            throw e;
        }
    });
    
    route.get('/add', 
        middlewares.isAuth,
        middlewares.isAllowed('global', 'users', 'edit'),  
        async (req: Request, res: Response) => {
        try {
            const zones  = await Container.get('availabilityZoneModel').findAll();
            const pois   = await Container.get(PoiService).findAllFiltered(req, {include: [ 'availability_zone' ]});
            
            return res.render(pageNames.profile.addEdit, {
                roles: config.roles,
                rolesLabels: config.roles_readable,
                pois,
                zones: zones,
            });
        } catch (e) {
            throw e;
        }
    });
    
    route.post('/add', 
        middlewares.isAuth,
        middlewares.isAllowed('global', 'users', 'edit'),  
        async (req: Request, res: Response) => {
        try {
            
			let userItem: IUserInputDTO = await handleUserData(req.body);
            
            if( !userItem )
            {
				return res.redirect('/profiles/add');	
            }
                               
            const { user } = await Container.get(UserService).create(userItem);
            
            if( user )
            {
				await handleUserZones(user.id, req.body);	
				await handleUserPois(user.id, req.body);
            }                                            
            
            return res.redirect('/profiles');
        } catch (e) {
            throw e;
        }
    });
    
    route.post('/delete/:id',middlewares.isAuth,
        middlewares.isAllowed('global', 'users', 'delete'),  
        async (req: Request, res: Response) => {
        try {
            
			await Container.get(UserService).delete(req, { where: { id : req.params.id } }); // Access check is done within service, same as zone handling
        
            return res.redirect('/profiles');
        } catch (e) {
            throw e;
        }
	});
    
    const handleUserPois = async(userId, bodyRequest) => {
    	if( bodyRequest.user_poi )
    	{
    		await Container.get(UserService).assignPois(userId, bodyRequest.user_poi);	
    	}                                                                                        
    }
    
    const handleUserZones = async(userId, bodyRequest) => {
    	if( bodyRequest.zones )
    	{
			await Container.get(UserService).assignZones(userId, Object.keys(bodyRequest.zones));	
    	}                                                                                        
    }
    
    const handleUserData = async(bodyRequest) => {

        let userItem: IUserInputDTO = {
            name: bodyRequest.name,
            email: bodyRequest.email,
            roles: JSON.stringify(Object.keys(bodyRequest.roles))
        };
        
		const newPassword = bodyRequest.password.trim();
		
		if( newPassword != '' ) // we need to change it ..
		{
			const passwordConfirmation = bodyRequest.password_confirmation.trim();
			
			if( newPassword == passwordConfirmation )
			{
				const { salt, password } = await Container.get(AuthService).generatePassword(newPassword);
				
				userItem.salt = salt;
				userItem.password = password;
			}
			else
			{
				return false;	
			}
		}
		
		return userItem;
    }
};
