import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { IShippingAddress, IShippingAddressInputDTO } from '../../interfaces/IShippingAddress';

const route = Router();

export default (app: Router) => {
  app.use('/shipping-addresses', route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const logger: any = Container.get('logger');
    try {

      const ShippingAddressModel: any = Container.get('shippingAddressModel')
      const shippingAddresses = await ShippingAddressModel.findAll();
      return res.json({ shippingAddresses }).status(200);
    }
    catch (e) {
      logger.error('🔥 error: %o', e);

      return next(e);
    }
  });

  route.get('/byUserId/:userId', async (req: Request, res: Response, next: NextFunction) => {
    const logger: any = Container.get('logger');
    try {
      const userId = +req.params.userId;

      const ShippingAddressModel: any = Container.get('shippingAddressModel')
      const shippingAddresses = await ShippingAddressModel.findAll({ where: { userId } });
      return res.json({ shippingAddresses , userId}).status(200);
    }
    catch (e) {
      logger.error('🔥 error: %o', e);

      return next(e);
    }
  });

  route.post(
    '/newShippingAddress',
    celebrate(
      {
        body: Joi.object(
          {
            num: Joi.string(),
            street: Joi.string(),
            cp: Joi.string(),
            city: Joi.string(),
            concatenation: Joi.string(),
            userId: Joi.number().integer().required()
          }
        ),
      }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: any = Container.get('logger');
      logger.debug('Calling API newShippingAddress endpoint with body: %o', req.body);

      try {
        const shippingAddressItem: IShippingAddressInputDTO = req.body;
        const ShippingAddressModel: any = Container.get('shippingAddressModel')
        const shippingAddress = await ShippingAddressModel.create(shippingAddressItem);
        return res.json({ shippingAddress }).status(200);
      }
      catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};