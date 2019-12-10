import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { IProfileInputDTO, IProfile } from '../../interfaces/IProfile';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/profiles', route);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    const logger: any = Container.get('logger');
    try {

      const ProfileModel: any = Container.get('profileModel')
      const profiles = await ProfileModel.findAll();
      return res.json({ profiles }).status(200);
    }
    catch (e) {
      logger.error('🔥 error: %o', e);

      return next(e);
    }
  });

  route.post(
    '/newProfile',
    celebrate(
      {
        body: Joi.object(
          {
            surname: Joi.string().required(),
            name: Joi.string().required(),
            email: Joi.string().required(),
            userId: Joi.number().integer(), // @TODO-medium: add .required()  ?
          }
        ),
      }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: any = Container.get('logger');
      logger.debug('Calling API newProfile endpoint with body: %o', req.body);

      try {
        const profileItem: IProfileInputDTO = req.body;
        const ProfileModel: any = Container.get('profileModel')
        const profile = await ProfileModel.create(profileItem);
        return res.json({ profile }).status(200);
      }
      catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};