import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';

import ContentService from '../../services/content';
import QuestionContentService from '../../services/question.content';
import QuestionAnswerService from '../../services/question.answer';

import PictureService from '../../services/picture';
import { IContentInputDTO } from '../../interfaces/IContent';
import { IPictureInputDTO } from '../../interfaces/IPicture';
import { celebrate, Joi } from 'celebrate';

var multer = require('multer');

var contentMulterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "contentPicture") {
        cb(null, 'uploads/pictures/content');
      } else { 
        cb(null, 'uploads/pictures/question');
      }
  	},
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

var uploadContent = multer({ storage: contentMulterStorage });

const route = Router();

export default (app: Router) => {
    app.use('/contents', route);

    route.get('/', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const ContentModel: any = Container.get('contentModel');

            const contents = await ContentModel.findAll({ include: ['picture', 'itsTheme', 'itsQuestionCategory'] });
            
            const logger: any = Container.get('logger');

            
            const contentServiceInstance = Container.get(ContentService);
            const contentStates = await contentServiceInstance.getContentStates();
            const contentStatesArray = await contentServiceInstance.getContentStatesAsArray();
            
            const CategoryModelService: any = Container.get('questionCategoryModel');
            const categories = await CategoryModelService.findAll();
            
            const ThemeModelService: any = Container.get('thematiqueModel');
            const themes = await ThemeModelService.findAll();

            
            return res.render('page-contents', {
                username: req['session'].name,
                contents: contents,
                contentStates: contentStates,
                thematiques: themes,
                categories: categories,
                contentStatesArray: contentStatesArray
            });
        } catch (e) {
            throw e;
        }
        //res.end();
    });

    route.get('/add', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const CategoryModelService: any = Container.get('questionCategoryModel');
            const categories = await CategoryModelService.findAll();

            
            const contentServiceInstance = Container.get(ContentService);
            const contentStates = await contentServiceInstance.getContentStates();
            
            
            const ThemeModelService: any = Container.get('thematiqueModel');
            const themes = await ThemeModelService.findAll();

            return res.render('page-contents-edit', {
                username: req['session'].name,
                themes: themes,
                categories: categories,
                contentStates: contentStates
            });
        } catch (e) {
            throw e;
        }
    });

    route.post('/add', 
    	middlewares.isAuth, 
    	uploadContent.fields(
		  [
		      { 
		        name: 'contentPicture', 
		        maxCount: 1 
		      }, 
		      { 
		        name: 'questionContentPicture', 
		        maxCount: 1 
		      }
		    ]
		),
		async (req: any, res: Response) => {
	        const logger: any = Container.get('logger');
	        logger.debug('Calling Front Create endpoint with body: %o', req.body);

	        try {
	            let contentItem: IContentInputDTO = {
	                title: req.body.title,
	                text: req.body.text,
	                link: req.body.link,
	                published: req.body.published,
	                comment: req.body.comment,
	                themeId: req.body.theme,
	                categoryId: req.body.category,
	                pictureId: null,
	            };

	            // Setup picture
	            const picObject: IPictureInputDTO = req.file;

	            if (picObject) {
	                // Processing the file if any file in req.file (PICTURE)
	                let pictureServiceInstance = Container.get(PictureService);
	                const { picture } = await pictureServiceInstance.create(picObject);
	                // Assigning pic id to the thematique item
	                contentItem.pictureId = picture.id;
	            }
	            
	            contentItem.questionId = await handleQuestionData(req.body.question, req.body.theme, req.body.category, req.files.questionContentPicture, req.body.answerItems);
	            
	            const contentServiceInstance = Container.get(ContentService);
	            await contentServiceInstance.create(contentItem);

	            return res.redirect('/contents');
	        } catch (e) {
	            throw e;
	        }
		}
    );

    route.get('/edit/:id', middlewares.isAuth, async (req: Request, res: Response) => {
        try {
            const documentId = req.params.id;
            const ContentModel: any = Container.get('contentModel');

            const CategoryModelService: any = Container.get('questionCategoryModel');
            const categories = await CategoryModelService.findAll();

            const contentServiceInstance = Container.get(ContentService);
            const contentStates = await contentServiceInstance.getContentStates();
            
            
            const ThemeModelService: any = Container.get('thematiqueModel');
            const themes = await ThemeModelService.findAll();

            const content = await ContentModel.findOne({
                where: {
                    id: documentId,
                },
                include: [
                	'itsQuestionContent',
                ]
            });
            
            let questionAnswers = null;
            let questionPicture = null;
            
            if( content.itsQuestionContent )
            {
				const questionAnswerModel = Container.get('questionAnswerModel');

	            questionAnswers = await questionAnswerModel.findAll({
	                where: {
	                    questionContentId: content.itsQuestionContent.id,
	                },
	            });
				
				if( content.itsQuestionContent.pictureId )
				{
					const pictureModel = Container.get('pictureModel');
					
					questionPicture = await pictureModel.findOne({
		                where: {
		                    id: content.itsQuestionContent.pictureId
		                }
					});
					
					console.log(questionPicture);
				}
            }                                                           
            
            return res.render('page-contents-edit', {
                username: req['session'].name,
                content: content,
                themes: themes,
                categories: categories,     
                contentStates: contentStates,
                question: content.itsQuestionContent,
                answers: questionAnswers,
                questionPicture: questionPicture,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
        '/edit/:id',
        middlewares.isAuth,
        uploadContent.fields(
		  [
		      { 
		        name: 'contentPicture', 
		        maxCount: 1 
		      }, 
		      { 
		        name: 'questionContentPicture', 
		        maxCount: 1 
		      }
		    ]
		),
        async (req: any, res: Response) => {
            try {
                const logger = Container.get<any>('logger');
                const documentId = req.params.id;

                let contentItem: IContentInputDTO = {
                    title: req.body.title,
                    text: req.body.text,
                    link: req.body.link,
                    published: req.body.published,
                    comment: req.body.comment,
                    themeId: req.body.theme,
                    categoryId: req.body.category,
                    pictureId: undefined,
                };
                
                const picObject: IPictureInputDTO = req.files.contentPicture;

                if (picObject) {
                    // Processing the file if any file in req.file (PICTURE)
                    let pictureServiceInstance = Container.get(PictureService);
                    const { picture } = await pictureServiceInstance.create(picObject[0]);
                    // Assigning pic id to the thematique item
                    contentItem.pictureId = picture.id;
                }
                                                                                                                                                                                
                contentItem.questionId = await handleQuestionData(req.body.question, req.body.theme, req.body.category, req.files.questionContentPicture, req.body.answerItems);
                
                const contentServiceInstance = Container.get(ContentService);
                await contentServiceInstance.update(documentId, contentItem);
                
                return res.redirect('/contents');
            } catch (e) {
                throw e;
            }
        },
    );
    
    route.post('/delete/:id', middlewares.isAuth, async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Delete endpoint with body: %o', req.body);

        try {
            const documentId = req.params.id;

            const contentServiceInstance = Container.get(ContentService);
            await contentServiceInstance.delete(documentId);


            return res.redirect('/contents');
        } catch (e) {
            throw e;
        }
    });

    route.post('/duplicate', middlewares.isAuth, async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Delete endpoint with body: %o', req.body);

        try {
        	const ContentModel: any = Container.get('contentModel');
        	const contentService = Container.get(ContentService);
        	
            const documentsId = req.body.contents;
            
            documentsId.forEach( async documentId => {
            	// We leave the same pictureID, and this is a normal effect ( if we update through form, new picture is created )
				const content = await contentService.duplicate(documentId);
				
				logger.debug(content);
            });
            
            return res.json().status(200);
        } catch (e) {
            throw e;
        }
    });
    
    route.post('/change-state', middlewares.isAuth, async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Delete endpoint with body: %o', req.body);

        try {
            const targetState = req.body.targetState;
            const documentsId = req.body.contents;
            
            const contentService = Container.get(ContentService);
            
            documentsId.forEach( async documentId => {
				await contentService.changeState(documentId, targetState);
            });
            
            return res.json({success : true}).status(200);
        } catch (e) {
            throw e;
        }
    });
    
    route.post('/change-category', middlewares.isAuth, async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Delete endpoint with body: %o', req.body);

        try {
            const targetThematique = req.body.thematique;
            const targetCategory   = req.body.category;
            const documentsId 	= req.body.contents;
            
            const contentService = Container.get(ContentService);
            
            documentsId.forEach( async documentId => {
				await contentService.changeCategory(documentId, targetCategory, targetThematique);
            });                                                                                   
            
            return res.json({success : true}).status(200);
        } catch (e) {
            throw e;
        }
    });
    
    
    const handleQuestionData = async (requestQuestion, selectedCategory, selectedTheme, picObject, requestAnswerItems) => {
        const logger: any = Container.get('logger');
        
        let questionId = null;
        
        if( requestQuestion.content == '' )
        {
			return questionId;
        }
        
        let questionContentItem: IQuestionContentDTO = {
            title: 		requestQuestion.title,
            answerText: requestQuestion.answerText,
            content: 	requestQuestion.content,
            published: 	( requestQuestion.published ? requestQuestion.published : "false" ),
            categoryId: selectedCategory ? selectedCategory : null,
            themeId: 	selectedTheme ? selectedCategory : null,
            pictureId: 	undefined,
        };
        logger.silly('%o', questionContentItem);

        // Processing picture
        if (picObject) {
            // Processing the file if any file in req.file (PICTURE)
            const pictureServiceInstance = Container.get(PictureService);
            const { picture } = await pictureServiceInstance.create(picObject[0] as IPictureInputDTO);
            // Assigning pic id to the thematique item
            questionContentItem.pictureId = picture.id;
        }

        const questionServiceInstance = Container.get(QuestionContentService);
        
        if( requestQuestion.id )
        {			
	        await questionServiceInstance.update(requestQuestion.id, questionContentItem);        		
	        
	        questionId = requestQuestion.id;
        }
        else
        {
			const { questionContent } = await questionServiceInstance.create(questionContentItem);	
			
			questionId = questionContent.id;
        }
        
        if (requestAnswerItems && Array.isArray(requestAnswerItems)) {
            let answerItems: IQuestionAnswerDTO[] = requestAnswerItems.map(answerItem => {
                if (answerItem.title != '') {
                    
                    return {                            	
                        title: answerItem.title,
                        isCorrect: answerItem.questionState === 'isCorrect',
                        isNeutral: answerItem.questionState === 'isNeutral',
                        published: true, // @TODO: is published really needed in question answer ?
                        questionContentId: questionId,
                    };
                }
            });
            if (answerItems.length > 0) {
                // Creating answers
                const questionAnswerService = Container.get(QuestionAnswerService);
                const questionAnswerModel = Container.get('questionAnswerModel');

                await questionAnswerModel.destroy({ where: { questionContentId: questionId } });

                await questionAnswerService.bulkcreate(answerItems);
            }
        }
        
        logger.silly('Updated a question');

        return questionId;
    };
};
