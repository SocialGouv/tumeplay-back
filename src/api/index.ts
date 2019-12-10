import { Router } 	from 'express';
import auth 		from './routes/auth';
import user 		from './routes/user';
import contents 	from './routes/contents'
import quizzs   	from './routes/quizzs'
import  thematiques from './routes/thematiques';
import  pictures from './routes/pictures';
import  profile from './routes/profile';
import  shippingAddress from './routes/shipping-address';
import  product from './routes/products';
import  shippingMode from './routes/shipping-mode';
import  order from './routes/order';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	
	auth(app);
	user(app);   
	contents(app);
	quizzs(app);
	thematiques(app);
	pictures(app);
	profile(app);
	shippingAddress(app);
	product(app);
	shippingMode(app);
	order(app);
	
	return app
}