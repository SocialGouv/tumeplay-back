import { Router, Request, Response } from 'express';
import { Container } from 'typedi';

import middlewares from '../middlewares';

import UserService from '../../services/user';
import AuthService from '../../services/auth';


const route = Router();

export default (app: Router) => {
    app.use('/users', route);

    route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
        return res.json({ user: req.currentUser }).status(200);
    });
    
    route.get('/my-account', 
    	middlewares.isAuth,
    	
    	async (req: Request, res: Response) => {
        
        try {
            return res.render('page-my-account', {
                user: req.session.user,
            });
        } catch (e) {
            throw e;
        }
    });
                                                                                
    route.post('/my-account', middlewares.isAuth, async(req: Request, res: Response) => 
    {
    	const bodyRequest = req.body;
        const newPassword = bodyRequest.password.trim();
        const newPasswordConfirmation = bodyRequest.password_confirmation.trim();
		
		console.log("Entering");
		
		let userItem: IUserInputDTO = {
            name: bodyRequest.name,
            email: bodyRequest.email,
		};
		
		if( newPassword != '' && newPasswordConfirmation != '' ) // we need to change it ..
		{
			if( newPassword == newPasswordConfirmation )
			{
				const { salt, password } = await Container.get(AuthService).generatePassword(newPassword);
				
				userItem.salt = salt;
				userItem.password = password;
			}
		}
		console.log("Entering 2");
		try
		{
        	await Container.get(UserService).update(req, req.session.user.id, userItem);
        	
        	req.session.flash = {msg: "Votre compte a bien été mis à jour.", status: true};
		}
		catch(e)
		{
			req.session.flash = {msg: "Votre compte a bien été mis à jour.", status: false};
		}
        
        console.log(req.session.flash);
        
        return res.redirect('/users/my-account');
    });
    
    
};
