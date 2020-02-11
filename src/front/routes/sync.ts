import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
import SyncDefaultData from '../../services/synchronizer/sync-default-data';
const route = Router();

export default (app: Router) => {
    app.use('/synchronize', route);

    route.get('/sync', middlewares.isAuth, async (req: Request, res: Response) => {
        console.log('done with the sequelize synchro');

        let syncDefaultData = Container.get(SyncDefaultData);

        await syncDefaultData.syncDefaultThemes();
        await syncDefaultData.syncDefaultCategories();
        await syncDefaultData.syncDefaultQuestions();
        await syncDefaultData.syncDefaultContents();
        await syncDefaultData.syncDefaultProducts();
        await syncDefaultData.syncDefaultBoxs();

        return res.redirect('/');
    });
};
