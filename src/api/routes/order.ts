import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
const route = Router();

export default (app: Router) => {
	app.use('/orders', route);

	route.get('/', async (req: Request, res: Response, next: NextFunction) => {
		const logger: any = Container.get('logger');
		try {
			
            const OrderModel:any  = Container.get('orderModel')
            const orders = await OrderModel.findAll(
				{
					include: ['shippingMode','shippingAddress','products','profile']
				}
			);          
			                 
			
			return res.json({ orders }).status(200);
		}
		catch (e) {
			logger.error('🔥 error: %o', e);

			return next(e);
		}
	});

};
