import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { IProduct, IProductInputDTO } from '../../interfaces/IProduct';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/products', route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const logger: any = Container.get('logger');
    try {

      const ProductModel: any = Container.get('productModel')
      const products = await ProductModel.findAll(
        {
          where: {
            deleted: false,
            active: true
          },
          include: ['picture']
        }
      );
      return res.json({ products }).status(200);
    }
    catch (e) {
      logger.error('🔥 error: %o', e);

      return next(e);
    }
  });
             
};