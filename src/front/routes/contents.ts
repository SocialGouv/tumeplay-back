import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';

import UserService from '../../services/user';
import ContentService from '../../services/content';
import SoundService from '../../services/sound';
import AvailabilityZoneService from '../../services/availability.zone';
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

import ExportGeneratorService from '../../services/export.generator';
import DateFormatterService from '../../services/date.formatter';


var multer = require('multer');

var contentMulterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "contentPicture") {
        cb(null, 'uploads/pictures/content');
      } 
      else if ( file.fieldname.includes('contentSound') )
      {
          cb(null, 'uploads/sounds/content')
      }
      else if ( file.fieldname.includes('questionSound') || file.fieldname.includes('questionAnswerSound') )
      {
          cb(null, 'uploads/sounds/question')
      }
      else {
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
                                            
            const themes    = await Container.get('thematiqueModel').findAll();            
            const zones     = await Container.get(UserService).getAllowedZones(req);
            const hasSound  = await Container.get(AvailabilityZoneService).hasSoundEnabled(zones);
            
            return res.render('page-contents-edit', {
                themes: themes,
                categories: categories,
                contentStates: contentStates,
                allZones: zones,
                hasSound: hasSound,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post('/add',
    	middlewares.isAuth,
    	middlewares.isAllowed(aclSection, 'global', 'edit'),
    	uploadContent.any(),
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
	            let contentPicture = null;
                let questionPicture = null;
				
				if( req.files && req.files.length > 0 )
				{
	                for( let i = 0; i < req.files.length; i++ )
					{
						const currentFile = req.files[i];
						if( currentFile.fieldname == 'contentPicture')	
						{
							contentPicture = currentFile;
						}
						if( currentFile.fieldname == 'questionPicture' )	
						{
							questionPicture = currentFile;
						}                         
					}
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
                
	            contentItem.questionId = await handleQuestionData(req, req.body.question, req.body.theme, req.body.category, questionPicture, req.body.answerItems, targetZones);

                const {content} = await Container.get(ContentService).create(contentItem);
                
                
                if( targetZones && targetZones.length > 0 )
                {
					await handleZones(content.id, targetZones);	
                }
                
                await handleSounds(req, content.id, content.questionId, targetZones, req.files);
                
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
            
            
            const themes 	= await Container.get('thematiqueModel').findAll();            
            const zones  	= await Container.get(UserService).getAllowedZones(req);
            const hasSound  = await Container.get(AvailabilityZoneService).hasSoundEnabled(zones);
            
            const ContentZoneModel: any = Container.get('contentZoneModel');

            const content = await contentServiceInstance.findOne(req, {
                where: {
                    id: documentId,
                },
                include: [
                	'picture',
                	'itsQuestionContent',
                	'availability_zone',
                	'sounds'
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
            let questionSounds 	= null;
            
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
                
                const localQuestion = await Container.get('questionModel').findOne({
					where: {
						id: content.itsQuestionContent.id,
					},
					include: [
                		'sounds'
	                ]
                });
                questionSounds = localQuestion.sounds;
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
                hasSound: hasSound,
                questionSounds: questionSounds
            });
            } catch (e) {
                throw e;
            }
        },
    );

    route.post('/delete-sound/:type/:itemId/:soundId', 
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),
		async (req: any, res: Response) => {
            try {
                const logger = Container.get<any>('logger');
        		const targetType = req.params.type;
        		const targetId = req.params.soundId;
        		const originId = req.params.itemId;
        		
        		if( targetType == 'content' )
        		{
					await Container.get(SoundService).deleteContentSound(originId, targetId);	
        		}
        		
        		if( targetType == 'question' )
        		{
					await Container.get(SoundService).deleteQuestionSound(originId, targetId);
        		}
        		
        		return res.json({success : true}).status(200);
			}
			catch(e)
			{
				throw e;
			}
		}
    );
    
    route.post(
        '/edit/:id',
        middlewares.isAuth,
        middlewares.isAllowed(aclSection, 'global', 'edit'),
		uploadContent.any(),
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
                    pictureId: undefined
                };
                
                let contentPicture = null;
                let questionPicture = null;
				
				if( req.files && req.files.length > 0 )
				{
	                for( let i = 0; i < req.files.length; i++ )
					{
						const currentFile = req.files[i];
						if( currentFile.fieldname == 'contentPicture')	
						{
							contentPicture = currentFile;
						}
						if( currentFile.fieldname == 'questionPicture' )	
						{
							questionPicture = currentFile;
						}
					}
				}                              
				
                if (contentPicture) {
                    // Processing the file if any file in req.file (PICTURE)
                    const { picture } = await Container.get(PictureService).create(contentPicture);
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
                contentItem.questionId = await handleQuestionData(req, req.body.question, req.body.theme, req.body.category, questionPicture, req.body.answerItems, targetZones);
                
                await Container.get(ContentService).update(req, documentId, contentItem);
                
                if( typeof targetZones != 'undefined' && targetZones.length > 0 )
                {
					await handleZones(documentId, targetZones);	
                }
                
                await handleSounds(req, documentId, contentItem.questionId, targetZones, req.files);
                                                                
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
    
    const handleSounds = async(req, documentId, questionId, zones, bodyFiles) => {
		if( typeof bodyFiles != 'undefined' && bodyFiles.length > 0 )
		{
			for( let i = 0; i < bodyFiles.length; i++ )
			{
				const currentFile = bodyFiles[i];
				if( currentFile.fieldname.includes('contentSound') )	
				{
					const targetZone = currentFile.fieldname.replace('contentSound[zone_', '').replace(']', '');
					
					currentFile.availabilityZoneId = parseInt(targetZone);
					
					const {sound} = await Container.get(SoundService).create(currentFile);
					
					if( sound )
					{
						await Container.get(SoundService).handleContentSound(documentId, sound.id);
					}
				}
				if( currentFile.fieldname.includes('questionSound') )	
				{
					const targetZone = currentFile.fieldname.replace('questionSound[zone_', '').replace(']', '');
					
					currentFile.availabilityZoneId = parseInt(targetZone);
					
					const {sound} = await Container.get(SoundService).create(currentFile);
					
					if( sound )
					{
						await Container.get(SoundService).handleQuestionSound(questionId, sound.id, "question");
					}
				}
				
				if( currentFile.fieldname.includes('questionAnswerSound') )	
				{
					const targetZone = currentFile.fieldname.replace('questionAnswerSound[zone_', '').replace(']', '');
					
					currentFile.availabilityZoneId = parseInt(targetZone);                                 
					const {sound} = await Container.get(SoundService).create(currentFile);
					
					if( sound )
					{
						await Container.get(SoundService).handleQuestionSound(questionId, sound.id, "answer");
					}
				}
			}
		}
    }
    
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
        
        if( typeof requestQuestion == 'undefined' || requestQuestion.content == '' )
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
            const { picture } = await Container.get(PictureService).create(picObject as IPictureInputDTO);
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
            logger.debug('Calling Reset stats endpoint with body: %o', req.body);

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
    
    
    route.post(
    	'/export/csv', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
    	try {
    		const logger: any 	= Container.get('logger');
    		const docIds 		= req.body.ids;
    		
    		const dateService   = Container.get(DateFormatterService);
			const exportService = Container.get(ExportGeneratorService);	
			
			const contentServiceInstance = Container.get(ContentService);

			console.log(req);
			console.log(req.body);
			
			let dbContents  = [];
			if( typeof docIds != 'undefined' && docIds.length > 0 )
			{
				dbContents	= await contentServiceInstance.findAll(req, { where: { id: docIds }, include: ['picture', 'itsTheme', 'itsQuestionCategory', 'itsQuestionContent', 'availability_zone']});
			}
			else
			{
				dbContents	= await contentServiceInstance.findAll(req, { include: ['picture', 'itsTheme', 'itsQuestionCategory', 'itsQuestionContent', 'availability_zone']});
			}
			
			const contentStates = contentServiceInstance.getContentStatesAsArray();
			
			const contents = dbContents.map(item => {
				//const dateObject = new Date(item.orderDate);
				const date 		 = dateService.format(item.updatedAt);
				
				return [
					item.id,
					item.title,
					item.text,
					contentStates[item.published],
					item.itsTheme ? item.itsTheme.title : '',
					item.itsQuestionCategory ? item.itsQuestionCategory.title : '',
					date.day + "/" + date.month + "/" + date.year,
				]
			});
			
			const headers = [
				"Num",
				"Titre",
				"Contenu",
				"Publié",
				"Thématique",
				"Catégorie",
				"Mis à jour",
			]; 
			
			contents.unshift(headers);
			   
			logger.debug("Got orders.");
			
			const { tmpFile }   = await exportService.generateCsv(contents);
			
			const date  = dateService.format(new Date());
			
			res.download(tmpFile, 'Export-Contenus-' + date.year + date.month + date.day + '.csv');
    	}
    	catch(e) {
			console.log(e);	
    	}
	});
};
