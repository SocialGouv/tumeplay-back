import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import QuestionFeedbackService from '../../services/question.feedback';
import { celebrate, Joi, errors } from 'celebrate';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
    const Feedback_ROOT = '/feedback';

    app.use(Feedback_ROOT, route);

    route.post(
        '/confirm',
        middlewares.isAuth,
        celebrate({
            body: Joi.object({
                userFeedback: Joi.object(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: any = Container.get('logger');
            const userFeedback = req.body.userFeedback;
            const questionFeedbackServiceInstance = Container.get(QuestionFeedbackService);
            console.log(req.body);


            let success = false;

            let questionFeedbackRecord = await questionFeedbackServiceInstance.findOne(userFeedback);

            logger.debug("Found question content %o", questionFeedbackRecord);

            if( !questionFeedbackRecord.id )
            {
                logger.debug("CREATE");
                questionFeedbackRecord = await questionFeedbackServiceInstance.create(userFeedback);
                success = true;


            }


            return res.json({success : success}).status(200);
        },
    );

    app.use(errors());
};
