import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { IOrder } from '../../interfaces/IOrder';
import { IProfile, IProfileInputDTO } from '../../interfaces/IProfile';
import { celebrate, Joi } from 'celebrate';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
    const routes = {
        PROFILE_ROOT: '/profiles'
    }

    const pageNames = {
        profile: {
            viewList: 'page-profiles',
            addEdit: 'page-profiles-edit'
        }
    }

    app.use(routes.PROFILE_ROOT, route);


    route.get('/', async (req: Request, res: Response) => {
        try {
            const ProfileModel: any = Container.get('profileModel')

            const profiles: IProfile[] = await ProfileModel.findAll();
            return res.render(pageNames.profile.viewList, {
                username: req['session'].name,
                profiles
            });
        }
        catch (e) {
            throw e;
        }
    });

};