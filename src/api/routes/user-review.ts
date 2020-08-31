import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { IShippingMode, IShippingModeDTO } from '../../interfaces/IShippingMode';

const route = Router();

export default (app: Router) => {
    app.use('/user-review', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger: any = Container.get('logger');
        try {
            const shippingModeModel: any = Container.get('shippingModeModel');
            const shippingModes = await shippingModeModel.findAll();
            return res.json({ shippingModes }).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);

            return next(e);
        }
    });
};
