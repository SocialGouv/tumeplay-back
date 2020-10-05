import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';

import UserService from '../../services/user';
import ContentService from '../../services/content';
import QuestionContentService from '../../services/question.content';
import QuestionAnswerService from '../../services/question.answer';

import PictureService from '../../services/picture';
import { IContentInputDTO } from '../../interfaces/IContent';
import { IPictureInputDTO } from '../../interfaces/IPicture';
import { celebrate, Joi } from 'celebrate';
import {IQuestionContentDTO} from "../../interfaces/IQuestionContent";
import {IQuestionAnswerDTO} from "../../interfaces/IQuestionAnswer";
import QuestionFeedbackService from "../../services/question.feedback";
import {IContentZoneDTO} from "../../interfaces/IContentZone";

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
	
	const aclSection = 'contents';
	
    app.use('/contents', route);

    route.get('/', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
        try {
            let likes = '';
            let dislikes = '';
            
            const logger: any = Container.get('logger');

            const contentServiceInstance = Container.get(ContentService);
            
            const contents = await contentServiceInstance.findAll(req, { include: ['picture', 'itsTheme', 'itsQuestionCategory', 'itsQuestionContent', 'availability_zone'] });
            
            const questionFeedbackService = Container.get(QuestionFeedbackService);
            for( let i = 0; i < contents.length; i++ )
            {
                let content = contents[i];

                likes 	 = await questionFeedbackService.getLikedContents(content.questionId);
                dislikes = await questionFeedbackService.getDislikedContents(content.questionId);
                content	 = Object.assign(content, {likes: likes},{dislikes: dislikes});
            }
               
               
            const contentStates 	 = await contentServiceInstance.getContentStates();
            const contentStatesArray = await contentServiceInstance.getContentStatesAsArray();
                             
            const categories = await Container.get('questionCategoryModel').findAll();
            const themes 	 = await Container.get('thematiqueModel').findAll();
            const zones  	 = await Container.get(UserService).getAllowedZones(req);
            
            return res.render('page-contents', {
                contents: contents,
                contentStates: contentStates,
                thematiques: themes,
                categories: categories,
                contentStatesArray: contentStatesArray,
                contentLikes: likes,
                zones: zones
            });
        } catch (e) {
            throw e;
        }
        //res.end();
    });

    route.get('/add', 
    	middlewares.isAuth,
    	middlewares.isAllowed(aclSection, 'global', 'edit'), 
    	async (req: Request, res: Response) => {
        try {
            
            const categories 	= await Container.get('questionCategoryModel').findAll();                                                                                
            const contentStates = await Container.get(ContentService).getContentStates();
                                            
            const themes = await Container.get('thematiqueModel').findAll();            
            const zones  = await Container.get(UserService).getAllowedZones(req);
                      
            return res.render('page-contents-edit', {
                themes: themes,
                categories: categories,
                contentStates: contentStates,
                allZones: zones,           
            });
        } catch (e) {
            throw e;
        }
    });

    route.post('/add',
    	middlewares.isAuth,
    	middlewares.isAllowed(aclSection, 'global', 'edit'),
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
	                const { picture } = await Container.get(PictureService).create(picObject);
	                // Assigning pic id to the thematique item
	                contentItem.pictureId = picture.id;
	            }
	            
	            let   targetZones = [];
                const zones = await Container.get(UserService).getAllowedZones(req);
                if( zones && zones.length == 1 )
                {
					targetZones = [zones[0].id];
                }   
                else
                {
					targetZones = req.body.zoneId;
                }   
                
	            contentItem.questionId = await handleQuestionData(req, req.body.question, req.body.theme, req.body.category, req.files.questionContentPicture, req.body.answerItems, targetZones);

                const {content} = await Container.get(ContentService).create(contentItem);
                
                
                if( targetZones.length > 0 )
                {
					await handleZones(content.id, targetZones);	
                }
                
            	return res.redirect('/contents');
        } catch (e) {
            throw e;
        }
		}
    );

    route.get('/edit/:id', 
    	middlewares.isAuth,
    	middlewares.isAllowed(aclSection, 'global', 'edit'), 
    	async (req: Request, res: Response) => {
        try {
            const documentId = req.params.id;
            const userZones  = req.session.zones;
            
            const categories = await Container.get('questionCategoryModel').findAll();

            const contentServiceInstance = Container.get(ContentService);
            const contentStates 		 = await contentServiceInstance.getContentStates();
            
            
            const themes = await Container.get('thematiqueModel').findAll();            
            const zones  = await Container.get(UserService).getAllowedZones(req);

            const ContentZoneModel: any = Container.get('contentZoneModel');

            const content = await contentServiceInstance.findOne(req, {
                where: {
                    id: documentId,
                },
                include: [
                	'itsQuestionContent',
                	'availability_zone'
                ]
            });
            
            if( !content )
            {
                return res.redirect('/contents');
            }
            
            content.zoneIds = content.availability_zone.map(item => {
				return item.id;
            });
                                 
            let questionAnswers = null;
            let questionPicture = null;
            
            if( content.itsQuestionContent )
            {
	            questionAnswers = await Container.get('questionAnswerModel').findAll({
	                where: {
	                    questionContentId: content.itsQuestionContent.id,
	                },
	            });

                if (content.itsQuestionContent.pictureId) {

                    questionPicture = await Container.get('pictureModel').findOne({
                        where: {
                            id: content.itsQuestionContent.pictureId,
                        },
                    });                          
                }
            }

            return res.render('page-contents-edit', {
                content: content,
                themes: themes,
                categories: categories,
                contentStates: contentStates,
                question: content.itsQuestionContent,
                answers: questionAnswers,
                questionPicture: questionPicture,
                allZones: zones,         
            });
            } catch (e) {
                throw e;
            }
        },
    );

    route.post(
        '/edit/:id',
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),
        uploadContent.fields([
            {
                name: 'contentPicture',
                maxCount: 1,
            },
            {
                name: 'questionContentPicture',
                maxCount: 1,
            },
        ]),
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
                    const { picture } = await Container.get(PictureService).create(picObject[0]);
                    // Assigning pic id to the thematique item
                    contentItem.pictureId = picture.id;
                }
                
                let   targetZones = [];
                const zones = await Container.get(UserService).getAllowedZones(req);
                if( zones && zones.length == 1 )
                {
					targetZones = [zones[0].id];
                }   
                else
                {
					targetZones = req.body.zoneId;
                }                                                                                                                                                             
                contentItem.questionId = await handleQuestionData(req, req.body.question, req.body.theme, req.body.category, req.files.questionContentPicture, req.body.answerItems, targetZones);
                
                await Container.get(ContentService).update(req, documentId, contentItem);
                
                if( targetZones.length > 0 )
                {
					await handleZones(documentId, targetZones);	
                }
                                                                
                return res.redirect('/contents');
            } catch (e) {
                throw e;
            }
        },
    );
    
    route.post('/delete/:id', 
    	middlewares.isAuth,
    	middlewares.isAllowed(aclSection, 'global', 'delete'),  
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Delete endpoint with body: %o', req.body);

        try {
            await Container.get(ContentService).delete(req, req.params.id);
                                               
            return res.redirect('/contents');
        } catch (e) {
            throw e;
        }
    });

    route.post('/duplicate', middlewares.isAuth, async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Front Delete endpoint with body: %o', req.body);

        try {
        	const contentService = Container.get(ContentService);
        	
            const documentsId = req.body.contents;
            
            documentsId.forEach( async documentId => {
            	// We leave the same pictureID, and this is a normal effect ( if we update through form, new picture is created )
				const content = await contentService.duplicate(req, documentId);
				
				logger.debug(content);
            });
            
            return res.json().status(200);
        } catch (e) {
            throw e;
        }
    });
    
    route.post('/change-state', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Change State endpoint with body: %o', req.body);

        try {
            const targetState = req.body.targetState;
            const documentsId = req.body.contents;
            
            const contentService = Container.get(ContentService);
            
            documentsId.forEach( async documentId => {
				await contentService.changeState(req, documentId, targetState);
            });
            
            return res.json({success : true}).status(200);
        } catch (e) {
            throw e;
        }
    });
    
    route.post('/change-category', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),
    	async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Change Category endpoint with body: %o', req.body);

        try {
            const targetThematique  = req.body.thematique;
            const targetCategory    = req.body.category;
            const documentsId 		= req.body.contents;
            
            const contentService 	= Container.get(ContentService);
            
            documentsId.forEach( async documentId => {
				await contentService.changeCategory(req, documentId, targetCategory, targetThematique);
            });                                                                                   
            
            return res.json({success : true}).status(200);
        } catch (e) {
            throw e;
        }
    });
    
    
    route.post('/change-zone/:type', 
        middlewares.isAuth, 
        middlewares.isAllowed(aclSection, 'global', 'edit'),
        async (req: any, res: Response) => {
        const logger: any = Container.get('logger');
        logger.debug('Calling Change Zone endpoint with body: %o', req.body);

        try {
            const targetType      = req.params.type;
            const targetZone      = req.body.zone;    
            const documentsId     = req.body.contents;
            
            const contentService  = Container.get(ContentService);
            
            documentsId.forEach( async documentId => {
                
                const content = await contentService.findOne(req, {
                    where: {
                        id: documentId,
                    },
                    include: [
                        'itsQuestionContent',
                        'availability_zone'
                    ]
                });
                
                let targetZones = [];
                if( targetType == 'add' )
                {
                    targetZones.push({ contentId: documentId, availabilityZoneId: parseInt(targetZone)});
                }
                
                content.availability_zone.forEach( item => {
                    if( item.id == targetZone ) // Either we are in add mode, and zone is already added; or we are in del mode, and we skip it.
                    {
                        return;
                    }    
                    targetZones.push({ contentId: documentId, availabilityZoneId: item.id});
                })
                
                await contentService.bulkDelete(documentId);
                
                if( targetZones.length > 0 )
                {
                    await contentService.bulkCreateZone(targetZones);    
                }
                
            });                                                                                   
            
            return res.json({success : true}).status(200);
        } catch (e) {
            throw e;
        }
    });
    
    
    const handleZones = async (currentContent, zoneId) => { 
        const contentServiceInstance = Container.get(ContentService);

        await contentServiceInstance.bulkDelete(currentContent);

        zoneId = ( typeof zoneId != 'undefined' &&  Array.isArray(zoneId) ) ? zoneId : [zoneId];
        var filteredZones = zoneId.filter(function (el) {
            return el != 0;
        });
        let zonesItems: IContentZoneDTO[] = filteredZones.map((zoneItem) => {
            return {
                contentId: currentContent,
                availabilityZoneId: zoneItem,
            };
        });

        if (zonesItems.length > 0) {
            // Creating zones
            await contentServiceInstance.bulkCreateZone(zonesItems);
        }
    };
    
    const handleQuestionData = async (req, requestQuestion, selectedCategory, selectedTheme, picObject, requestAnswerItems, targetZones) => {
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
            const { picture } = await Container.get(PictureService).create(picObject[0] as IPictureInputDTO);
            // Assigning pic id to the thematique item
            questionContentItem.pictureId = picture.id;
        }

        const questionServiceInstance = Container.get(QuestionContentService);

        if( requestQuestion.id )
        {			
	        await questionServiceInstance.update(req, requestQuestion.id, questionContentItem);        		
	        
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
                await Container.get('questionAnswerModel').destroy({ where: { questionContentId: questionId } });

                await Container.get(QuestionAnswerService).bulkcreate(answerItems);
            }
        }
        
        if( targetZones && targetZones.length > 0 )
        {
        	 targetZones = ( typeof targetZones != 'undefined' &&  Array.isArray(targetZones) ) ? targetZones : [targetZones];
 	         var filteredZones = targetZones.filter(function (el) {
	            return el != 0;
	         });
	         
	         let localZones = filteredZones.map((zoneItem) => {
	            return {
	                questionContentId: questionId,
	                availabilityZoneId: zoneItem,
	            };
	         });

			 await questionServiceInstance.bulkDeleteZone(questionId);
			 await questionServiceInstance.bulkCreateZone(localZones);
        }
        
        logger.silly('Updated a question');

        return questionId;
    };
    route.post(
        '/reset/:id',
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'delete'),
        async (req: any, res: Response) => {
            const logger: any = Container.get('logger');
            logger.debug('Calling Front Delete endpoint with body: %o', req.body);

            try {
                const documentId = req.params.id;

                const content = await Container.get('contentModel').findOne({
                    where: {
                        id: documentId,
                    },
                    include: ['itsQuestionContent'],
                });

                if (content.itsQuestionContent.id) {
                    await Container.get(QuestionFeedbackService).bulkDelete(content.itsQuestionContent.id);
                }

                return res.redirect('/contents');
            } catch (e) {
                throw e;
            }
        },
    );
};
