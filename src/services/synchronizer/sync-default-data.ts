import Container, { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/eventDispatcher';
import { IThematique, IThematiqueInputDTO } from '../../interfaces/IThematique';

let fs = require("fs");

// Default files
import defaultThemeList from '../../default_files/Themes';
import defaultCategoryList from '../../default_files/Categories';
import defaultQuestionList from '../../default_files/Questions';
import defaultContentList from '../../default_files/Contents';
import defaultProductList from '../../default_files/Products';
import defaultBoxList from '../../default_files/Boxs';

import ThematiqueService from '../thematique';

import { IUserInputDTO } from '../../interfaces/IUser';
import { IQuestionCategoryDTO } from '../../interfaces/IQuestionCategory';

import UserService from '../user';
import AuthService from '../auth';
import QuestionCategoryService from '../question.category';
import { IQuestionContentDTO, IQuestionContentForDefault } from '../../interfaces/IQuestionContent';
import QuestionContentService from '../question.content'; 

import config from '../../config';

@Service()
export default class SyncDefaultData {
    constructor(
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {

    }

    public async generatePicture(item, fromFolder, targetFolder, fileName) 
    {
    	var fromPath = 'src/default_files/pictures/' + fromFolder + '/' + fileName;
    	       
    	var targetName = item.id + '-' + fileName.replace(/ /g, '');
    	var targetPath = targetFolder + '/' + targetName;
    	       
    	try
    	{
    		if( !fs.existsSync(fromPath) )
    		{
    			this.logger.silly('From path does not exist.');
				return null;
    		}
    		
    		const stats 	= fs.statSync(fromPath);
    		const _fileSize = stats.size;
    		
			if( fs.existsSync(targetPath) )
			{
				this.logger.silly('File exist. Removing it.');
				fs.unlinkSync(targetPath);
			}
			
			fs.createReadStream(fromPath).pipe(fs.createWriteStream(targetPath));
			
			return {
				//id : null,
				originalname: fileName,
				encoding: "7bit",
				mimeType: "image/jpeg",
				destination: targetFolder,
				filename: targetName, 
				size: _fileSize,
				path: targetPath,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
    	}
    	catch(e)
    	{
			this.logger.silly('ERRIR : ' + e);
			 
            throw e;
    	}
    	
    	return false;
    }
    
    public async syncDefaultThemes(): Promise<{ success: boolean }> {
        try {
            console.info('syncDefaultThemes...');
            let themesToCreate: IThematiqueInputDTO[] = defaultThemeList.map(defaultThemeItem => {
                return ({
                	id: defaultThemeItem.id,
                	title: defaultThemeItem.value,
                    active: "on",
                    pictureId: null,        
                    isDefaultData: true
                });
            });
            let thematiqueService = Container.get('thematiqueModel'); 

            await Promise.all(themesToCreate.map(async (themeObj) => {
                try
                {
	                let thematique = await thematiqueService.findOne({where : { id : themeObj.id }});
	                if (thematique) {
	                    // Updating existing theme
	                    await thematiqueService.update(themeObj, { where: {id: thematique.id} })
	                } else {
	                    // Creating theme
	                    await thematiqueService.create(themeObj);
	                }
				}
				catch(e)
				{
					throw new Error(e);
				}
            }));

            return { success: true };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async syncDefaultCategories(): Promise<{ success: boolean }> {
        // Getting a list of all themes:
        this.logger.silly('syncDefaultCategories()...');

        
        let categoriesToCreate: IQuestionCategoryDTO[] = defaultCategoryList.map((categoryItemTemp) => {
            return (
                {
                	"id" : categoryItemTemp.id,
                    "title": categoryItemTemp.title,
                    "published": true, 
                    "deleted": false,
                    "isDefaultData": true,
                }
            );
        });


        this.logger.silly('syncDefaultCategories() got categories to create:', categoriesToCreate);

        let questionCategoryService = Container.get('questionCategoryModel');
        // Checking if question category already exist
        await Promise.all(categoriesToCreate.map(async (categoryObj) => {
         	console.log(categoryObj.id);
            let questionCategory = await questionCategoryService.findOne({where : { id : categoryObj.id }});

            if (questionCategory) {
                // Updating existing question category
                await questionCategoryService.update(categoryObj, { where: { id : questionCategory.id } } )
            } else {
                // Creating question category
                await questionCategoryService.create(categoryObj);
            }
            
        }));

        this.logger.silly('Returning.');
        
        return ({ success: true });
    }

    public async syncDefaultQuestions(): Promise<{ success: boolean }> {
        let questionCategoryService = Container.get(QuestionCategoryService);
        let { questionCategories } = await questionCategoryService.findAll();
        
        let thematiquesService = Container.get(ThematiqueService);
        let { thematiques } = await thematiquesService.findAll();
        
        let questionsToCreate: IQuestionContentDTO[] = defaultQuestionList.map((questionItemTemp: IQuestionContentForDefault) => 
        {
            let category = questionCategories.find((e) => { return (e.id === questionItemTemp.category) });
            let theme = thematiques.find((e) => { return (e.id === questionItemTemp.theme) });
            if (!category) console.error('No category found ( by id Fictitious ) for this question:', questionItemTemp);
            return ({
                "title": questionItemTemp.question,
                "answerText": questionItemTemp.explanation,
                "content": questionItemTemp.question,
                "published": true,
                "categoryId": category ? category.id : null,
                "themeId" : theme.id,
                "pictureId": null,
                "id": questionItemTemp.id,
                "isDefaultData": true,
                "answersExtras": questionItemTemp.answers,
                "rightAnswer": questionItemTemp.rightAnswer,
                "defaultPicturePath": questionItemTemp.picture && questionItemTemp.picture !== 'undefined' ? questionItemTemp.picture : null,
            })
        })

        console.log("Preparing entry");
        
        let questionContentService = Container.get(QuestionContentService);

        await Promise.all(questionsToCreate.map(async (questionObj) => {
        	try
        	{
        		this.logger.silly("Searching " + questionObj.id);
        		let pictureModelService = Container.get('pictureModel');   
	            let { questionContent } = await questionContentService.findById(questionObj.id);
	            let picture = await this.generatePicture(questionObj, 'quizz', 'uploads/pictures/question', questionObj.defaultPicturePath); 
	                                                       
	            if( picture )
	            {                                           
            		this.logger.silly('CREATING PICTURE');
					picture = await pictureModelService.create({
						...picture
					});
					
					this.logger.silly('PICTURE : %o', picture.id);
	            }
	            
	            
	                                           
	            if (questionContent != null) 
	            {
	            	this.logger.silly('Found existing content.');
            		if( questionContent.pictureId )
            		{
            			const previousPicture = questionContent.pictureId;
            			
            			
            			questionContent.pictureId = null;
            			
            			this.logger.silly("Updating " + questionContent.id);               
            			
            			await questionContentService.update(questionContent.id, questionContent);
            			
						await pictureModelService.destroy({
						    where: {
						        id : questionContent.pictureId
						    }
						});
            		}
            		questionContent.pictureId = picture.id;
            		questionObj.pictureId = picture.id;
	                // Updating existing question category
	                await questionContentService.updateWithAnswers(questionContent.id, { ...questionObj })
	            }
	            else 
	            {
	                // Creating question category
	                this.logger.silly('Creating new content.');
	                if (picture && picture.id )
	                {
						questionObj.pictureId = picture.id;	
	                }
	                
	                await questionContentService.createWithAnswers(questionObj);
	            } 
			}
			catch(e)
			{
				this.logger.silly('ERROR ' + e );
				
				return;
			}
        }));

        this.logger.silly('Returning.');
        
        return { success: true }
    }
    
    public async syncDefaultContents(): Promise<{ success: boolean }> {
    	// Getting a list of all themes:
        this.logger.silly('syncDefaultContent()...');
        
        let categoryService = Container.get(QuestionCategoryService);
        let { questionCategories } = await categoryService.findAll();
        
        let thematiquesService = Container.get(ThematiqueService);
        let { thematiques } = await thematiquesService.findAll();
        
        
        let contentsToCreate = defaultContentList.map((contentItem) => {
            return (
                {
                	"id" : contentItem.id,
                    "title": contentItem.title,
                    "text": contentItem.text,
                    "published": true,       
                    "pictureId": null,
                    "themeId": contentItem.theme,
                    "categoryId": contentItem.category,
                    "picture": contentItem.picture,
                }
            );
        });


        
        let contentService = Container.get('contentModel');
        // Checking if question category already exist
        await Promise.all(contentsToCreate.map(async (contentObject) => 
        {
        	try
        	{
        		let pictureModelService = Container.get('pictureModel');
        		let category = questionCategories.find((e) => { return (e.id === contentObject.categoryId) });
	            let theme = thematiques.find((e) => { return (e.id === contentObject.themeId) });
	            
	            if( !category || !theme )
	            {
					this.logger.error('No category / theme spotted : ' + contentObject.themeId + ' | ' + contentObject.categoryId);	
	            }
	            
	            let localContent = await contentService.findOne({where : { id : contentObject.id }});
	            let picture = await this.generatePicture(contentObject, 'content', 'uploads/pictures/content', contentObject.picture); 
		                                                       
		            if( picture )
		            {
            			//this.logger.silly('CREATING PICTURE');
						picture = await pictureModelService.create({
							...picture
						});
		            }
		            
	            if (localContent) {
            		if( localContent.pictureId )
            			{
            				const previousPicture = contentObject.pictureId;
            				
            				contentObject.pictureId = null;
            				
            				await contentService.update(contentObject, { where: { id : contentObject.id } } )

							await pictureModelService.destroy({
							    where: {
							        id : previousPicture
							    }
							});
            			}
            			localContent.pictureId = picture.id;
            			contentObject.pictureId = picture.id;
		                
	                // Updating existing question category
	                await contentService.update(contentObject, { where: { id : contentObject.id } } )
	            } else {
	                // Creating question category
	                contentObject.pictureId = picture.id;
	                await contentService.create(contentObject);
	            }
			}
			catch(e)
			{
				this.logger.error('ERROR : ' + e );
				
				return;
			}                   
        }));
        this.logger.silly('Returning.'); 
        return ({ success: true });
	}
	
	
    public async syncDefaultProducts(): Promise<{ success: boolean }> {
    	// Getting a list of all themes:
        this.logger.silly('syncDefaultProducts()...');
        
        let productService = Container.get("productModel");
        
        let productsToCreate = defaultProductList.map((productItem) => {
            return (
                {
                	"id" : productItem.id,
                    "title": productItem.title,
                    "description": productItem.title,
                    "shortDescription": productItem.shortTitle,
                    "defaultQty" : productItem.qty ? productItem.qty : null,
                    "active": true,       
                    "deleted": false,
                    "picture": productItem.picture,
                }
            );
        });
        
                this.logger.silly(productsToCreate);

        // Checking if question category already exist
        await Promise.all(productsToCreate.map(async (productToCreate) => 
        {
        	try
        	{
        		let pictureModelService = Container.get('pictureModel');
        		
	            let localProduct = await productService.findOne({where : { id : productToCreate.id }});
	            let picture = await this.generatePicture(productToCreate, 'product', 'uploads/pictures/product', productToCreate.picture); 
		        this.logger.silly("Create picture ...");                                           
		        if( picture )
		        {
            		//this.logger.silly('CREATING PICTURE');
					picture = await pictureModelService.create({
						...picture
					});
		        }
		            
	            if (localProduct) {
            		if( localProduct.pictureId )
            			{
            				const previousPicture = localProduct.pictureId;
            				
            				localProduct.pictureId = null;
            				
            				await productService.update(localProduct, { where: { id : productToCreate.id } } )

							await pictureModelService.destroy({
							    where: {
							        id : previousPicture
							    }
							});
            			}
            			localProduct.pictureId = picture.id;
            			productToCreate.pictureId = picture.id;
		                
	                // Updating existing question category
	                await productService.update(productToCreate, { where: { id : productToCreate.id } } )
	            } else {
	                // Creating question category
	                productToCreate.pictureId = picture.id;
	                await productService.create(productToCreate);
	            }
			}
			catch(e)
			{
				this.logger.error('ERROR : ' + e );
				
				return;
			}                   
        }));
        this.logger.silly('Returning.'); 
        return ({ success: true });
	}
	
	
	
    public async syncDefaultBoxs(): Promise<{ success: boolean }> {
    	// Getting a list of all themes:
        this.logger.silly('syncDefaultBoxs()...');
                                                           
        let boxProductService = Container.get("boxProductModel");
        let boxService = Container.get("boxModel");
        
        let boxsToCreate = defaultBoxList.map((boxItem) => {
            return (
                {
                	"id" : boxItem.id,
                    "title": boxItem.title,
                    "description": boxItem.description,
                    "shortDescription": boxItem.description,
                    "price" : 500,
                    "active": true,       
                    "deleted": false,
                    "picture": boxItem.picture,
                    "products" : boxItem.products,
                }
            );
        });
        
        this.logger.silly(boxsToCreate);

        // Checking if question category already exist
        await Promise.all(boxsToCreate.map(async (boxToCreate) => 
        {
        	try
        	{
        		let pictureModelService = Container.get('pictureModel');
        		
	            let localBox = await boxService.findOne({where : { id : boxToCreate.id }});
	            let picture = await this.generatePicture(boxToCreate, 'box', 'uploads/pictures/box', boxToCreate.picture); 
		        this.logger.silly("Create picture ...");                                           
		        if( picture )
		        {
            		//this.logger.silly('CREATING PICTURE');
					picture = await pictureModelService.create({
						...picture
					});
		        }
		            
	            if (localBox) {
            		if( localBox.pictureId )
            		{
            			const previousPicture = localBox.pictureId;
            			
            			localBox.pictureId = null;
            			
            			await boxService.update(localBox, { where: { id : localBox.id } } )

						await pictureModelService.destroy({
							where: {
							    id : previousPicture
							}
						});
            		}
            		localBox.pictureId = picture.id;
            		boxToCreate.pictureId = picture.id;
		            
	                // Updating existing question category
	                await boxService.update(boxToCreate, { where: { id : boxToCreate.id } } )
	            } else {
	                // Creating question category
	                boxToCreate.pictureId = picture.id;
	                await boxService.create(boxToCreate);
	            }
	            
	            await boxProductService.destroy({
					where: {
						boxId : boxToCreate.id
					}
				});
	            
	            const localProducts =  boxToCreate.products.map((productItem) => {
		            return (
		                {
                			"boxId" : boxToCreate.id,
                			"productId" : productItem.product,
                			"qty" : ( productItem.qty ? productItem.qty : null ),
		                }
		            );
		        });
		        
		        await boxProductService.bulkCreate(localProducts);
			}
			catch(e)
			{
				this.logger.error('ERROR : ' + e );
				
				return;
			}                   
        }));
        this.logger.silly('Returning.'); 
        return ({ success: true });
	}
    
    public async createInitAdmin(): Promise<{ success: boolean }> {
        //   initial User setup
        const initialUser: IUserInputDTO = {
            name: config.defaultAdminLogin,
            email: config.defaultAdminLogin,
            password: config.defaultAdminPassword,
            roles: [config.roles.administrator]
        };

        try {
            // Checking if user already in the db
            const userServiceInstance = Container.get(UserService);
            const result_findUsers_byEmail = await userServiceInstance.findByEmail(initialUser.email);
            if (result_findUsers_byEmail.userRecords.length !== 0) 
            {
                console.warn('User already exists, length', result_findUsers_byEmail.userRecords.length);
            } 
            else 
            {
                // create only when the user does not already exist: 
                console.info('This is a new user. So now creating...');
                const authServiceInstance = Container.get(AuthService);
                const { user, token } = await authServiceInstance.create(initialUser);
                console.info(`created user: ${JSON.stringify(user)}`);
            }
            return ({ success: true });
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }

}