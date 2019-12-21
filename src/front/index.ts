import { Router, Request, Response, NextFunction } from 'express';
import { Container } 		from 'typedi';
import AuthService 			from '../services/auth';

import { celebrate, Joi } 	from 'celebrate';
import path 				from 'path';

import contents 			from './routes/contents'
import quizzs				from './routes/quizzs';
import thematiques 			from './routes/thematiques';
import pictures 			from './routes/pictures';
import products 			from './routes/products';
import orders 				from './routes/orders';
import profiles 				from './routes/profiles';
import boxs from './routes/boxs';
import sync from './routes/sync';

import config from '../config';

const route = Router();

// guaranteed to get dependencies
export default () => {
	const app = Router();

    contents(app);
    quizzs(app);
	thematiques(app);
	pictures(app);
	products(app);
	orders(app);
	profiles(app);
	boxs(app);
	sync(app);
	
	app.use('/', route);
        
	route.get('', (req: any, res: Response) => {
		if (req.session.loggedin) 
		{
			res.redirect('/contents');
		}
		else
		{
			res.sendFile(path.join(__dirname + '../../../public/page-login.html'));	
		}
	    
	});
	
	route.post('/login', 
		celebrate(
			{
				body: Joi.object(
					{
						email	 : Joi.string().required(),
						password : Joi.string().required(),
				}),
		}),
		async (req: any, res: Response, next: NextFunction) => 
		{
			const logger:any = Container.get('logger');
			logger.debug('Calling Front Login endpoint with body: %o', req.body);

			try 
			{
				const { email, password } = req.body;
				const authServiceInstance = Container.get(AuthService);
				const { user, token } 	  = await authServiceInstance.login(email, password);
	
				logger.debug('Having user  : %o', user);
				logger.debug('Having token : %o', token);

				const localRoles 	 = JSON.parse(user.roles);
				
				if( localRoles != config.roles.administrator  )
				{
					throw new Error('Access denied.');
				}
				
				req.session.loggedin = true;
				req.session.username = email;
				req.session.name 	 = user.name;
				req.session.roles 	 = JSON.parse(user.roles);
				
				return res.redirect('/contents');
			} 
			catch (e) 
			{
				logger.error('🔥 error: %o',  e );
				
				return res.redirect('/');
				return next(e);
			}
		},
	);	
	
	route.get('/home', async(req: any, res: Response) =>  
	{
		try
		{
			if (req.session.loggedin) 
			{
				
				return res.redirect('/contents');
				return res.render("index", {
			        username: req.session.name
			    });
				//return res.sendFile(path.join(__dirname + '../../../public/index.html'));
			} else {
				return res.redirect('/');
			}
		}
		catch(e)
		{
			throw e;
		}
		//res.end();
	});
	
	
	route.get('/logout', async(req: any, res: Response) => {
		try
		{
			if (req.session.loggedin) 
			{
				req.session.loggedin = false;

			} 
			return res.redirect('/');		
		}
		catch(e)
		{
			throw e;
		}
	});

	return app
}