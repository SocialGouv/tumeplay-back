import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
// SERVICES
import FeedbackService from '../../services/feedback';
// ----
import { IFeedbackInputDTO, IFeedback } from '../../interfaces/IFeedback';



const route = Router();

export default (app: Router) => {
	const aclSection = 'reviews';
	
    app.use('/feedback', route);
    route.get('/', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
        try {
            const feedbackService: any = Container.get('feedbackModel');

            const feedbacks: IFeedback[] = await feedbackService.findAll({ order:[ ['id', 'DESC'] ]});

            return res.render('page-feedback', { feedbacks });
        } catch (e) {
            throw e;
        }
        //res.end();
    });
    route.get(
    	'/list', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
        try {
            const feedbackService: any = Container.get('feedbackModel');
            const questionFeedbackService: any = Container.get('questionFeedbackModel');

            const feedbacks: IFeedback[] = await questionFeedbackService.findAll({ order:[ ['id', 'DESC'] ],include: ['question', 'feedback']});

            return res.render('page-user-review', {  feedbacks});
        } catch (e) {
            throw e;
        }
        //res.end();
    });
    route.get(
    	'/add', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	async (req: Request, res: Response) => {
        try {
            return res.render('page-feedback-edit', {});
        } catch (e) {
            throw e;
        }
    });
    route.post(
    	'/add',
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	async (req: any, res: Response) => 
    {
        try {
            let feedbackItem: IFeedbackInputDTO = {
                title: req.body.title
            };                          
            
            await Container.get(FeedbackService).create(feedbackItem);

            return res.redirect('/feedback');
        } catch (e) {
            throw e;
        }
    });

    route.get(
    	'/edit/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),  
    	async (req: Request, res: Response) => {
        try {
            const documentId = req.params.id;

            const feedback: IFeedback = await Container.get('feedbackModel').findOne({
                where: {
                    id: documentId,
                },                           
            });
            
            return res.render('page-feedback-edit', {
                feedback,
            });
        } catch (e) {
            throw e;
        }
    });



};
