import { Service, Inject } from 'typedi';
import { IContent, IContentInputDTO } from '../interfaces/IContent';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IContentZone, IContentZoneDTO } from '../interfaces/IContentZone';
import config from '../config';

@Service()
export default class ContentService {
    public constructor(
        @Inject('contentModel') private contentModel: Models.QuestionContentModel,
        @Inject('contentZoneModel') private contentZoneModel: any,

        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}
    
    public async findAll(req, criterias) {
        try {
            this.logger.silly('Finding contents');
            
            this.alterQuery(req, criterias);
            
            const contents = await this.contentModel.findAll(criterias);
            
            return contents;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findOne(req, criterias) {
        try {
            this.logger.silly('Finding one content');
            
            this.alterQuery(req, criterias);
            
            console.log("Criterias : " + JSON.stringify(criterias));
            
            const content = await this.contentModel.findOne(criterias);
            
            return content;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    
    
    public async create(contentInput: IContentInputDTO): Promise<{ content: IContent }> {
        try {
            this.logger.silly('Creating content');
            
            const contentRecord = await this.contentModel.create({
                ...contentInput,
            });

            if (!contentRecord) {
                throw new Error('Content cannot be created');
            }

            return {content: contentRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(req, contentId: Integer, contentInput: IContentInputDTO): Promise<{ content: IContent }> {
        const criterias = {
            where: {
                id: contentId,
            },
        };
        
        this.alterQuery(criterias);
        
        const contentRecord = await this.contentModel.findOne(criterias);

        if (!contentRecord) {
            throw new Error('Content not found.');
        }

        this.logger.silly('Updating content');
                                 
        await contentRecord.update(contentInput);

        return { contentRecord };
    }
    
    public async changeState(req, contentId: Integer, targetState: Integer): Promise<{  }> {
    	
    	await this.update(req, contentId, { published: targetState });
    	
        return {};
	}
	
	public async changeCategory(req, contentId: Integer, targetCategory: Integer, targetThematique: Integer): Promise<{  }> {
    	
    	let data = {};
    	
    	if( targetCategory != '' )
    	{
			data.categoryId = targetCategory;
    	}
    	
    	if( targetThematique != '' )
    	{
			data.themeId = targetThematique;
    	}
    	
    	await this.update(req, contentId, data);
    	
        return {};
	}
	
	public async duplicate(req, contentId: Integer): Promise<{ content: IContent }> {
		const criterias = {
            where: {
                id: contentId,
            },
            include: ['availability_zone'],
        };
        
        this.alterQuery(criterias);
        
		const contentRecord = await this.contentModel.findOne(criterias);
        
        if (!contentRecord) {
            throw new Error('Content not found.');
        }
        
        this.logger.silly('Duplicate content.');
        
        const contentInput = {
			title: contentRecord.title,
			text: contentRecord.text,
			link: contentRecord.link,
			published: contentRecord.published,
			comment: contentRecord.comment,
			pictureId: contentRecord.pictureId,
			themeId: contentRecord.themeId,
			categoryId: contentRecord.categoryId,	
        };
        
        const { content } = await this.create(contentInput);
        
        if( contentRecord.availability_zone.length > 0 )
        {
			const localZones = contentRecord.availability_zone.map( item => {
				return {
	                contentId: content.id,
	                availabilityZoneId: item.id,
	            };                             
			});
			
			await this.bulkCreateZone(localZones);
        }
        
        return { contentRecord };
	}
    
    public async delete(contentId: Integer) {
	    await this.contentModel.destroy({ where: {id: contentId}}) ;
	    
	    return;
    }
    
    public getContentStates() {
		const states = [
			{ id: 0, title: 'Archivé' },
			{ id: 1, title: 'Publié' },
			{ id: 2, title: 'Dépublié' },
			{ id: 3, title: 'En attente de validation' },
			{ id: 4, title: 'En attente de visuel' },
			{ id: 5, title: 'Rédaction en cours' },
		];
		return states;
    }
    
    public getContentStatesAsArray()
    {
		const states  = this.getContentStates();
		const _return = [];
		
		states.forEach( item => {
			_return[item.id] = item.title;
		});
		
		return _return;
    }
    
    private alterQuery(req, criterias)
    {
        if( typeof req.session !== 'undefined' && typeof req.session.zones !== "undefined" && req.session.zones.length > 0 )
        {
            if( req.session.roles.indexOf(config.roles.administrator) < 0 )
            {
                this.logger.silly("Altering criterias to add zone constraints");
                
                if(typeof criterias.include === 'undefined' )
                {
                    criterias.include = [];
                }
                
                criterias.include.push({
                    association: 'availability_zone',
                    where: { id : req.session.zones}   
                });
            }
            else
            {
                this.logger.silly("Skipping due to user role.");
            }
        }
        
        this.logger.silly("Out of alter.");
        
        return criterias;
    }
    
    private transformContents(contents)
    {
		return contents.map( content => {
			return {
				'id' : content.id,
				'title' : content.title,
				'updatedAt' : content.updatedAt,
				'itsTheme' : content.itsTheme.title,
				'itsFamily': content.itsQuestionCategory.title,
			};
	    });
    }
    
    public async getNeedingActionContents(req)
    {
		const states  = await this.getContentStates();
		const _return = {
			'waiting_validation' : {},
			'redacting' : {},
			'waiting_picture': {},
			'waiting_sound'  : {},
			'low_quality': {},
		};
		
		const _queryArgs = {
			where: {
                published: 3,
            },
            order: [['updatedAt', 'ASC']],
	        include: ['itsTheme', 'itsQuestionCategory'],
		};
		
        this.alterQuery(req, _queryArgs);
        
		const _waitingContent = await this.contentModel.findAll(_queryArgs);
		                     
	    _return['waiting_validation'] = this.transformContents(_waitingContent);
		
		_queryArgs.where.published = 5; // Rédaction en cours
		
		const _redactingContent = await this.contentModel.findAll(_queryArgs);		
		_return['redacting'] = this.transformContents(_redactingContent);		
		
		_queryArgs.where.published = 4; // En attente de visuel               		
		const _waitingPictureContent = await this.contentModel.findAll(_queryArgs);
		_return['waiting_picture'] = this.transformContents(_waitingPictureContent);		
		
		_queryArgs.where.published = 6; // En attente d'audio                 		
		const _waitingSoundContent = await this.contentModel.findAll(_queryArgs);
		_return['waiting_sound'] = this.transformContents(_waitingSoundContent);		
		                                       
		return _return;
    }
    
    public async getContentsStatistics(req)
    {
		const states  = await this.getContentStates();
		const _return = {
			'byState' : {},
			'byTheme' : {},
			'byFamily': {},
			'themes'  : {},
			'families': {},
			'total'	  : 0,
			'lastPublished' : [],
		};

        let criterias = {
            where: {
                published: 1,
            },
            order: [['updatedAt', 'DESC']],
            include: ['itsTheme', 'itsQuestionCategory'],
            limit : 10
        };                                    
        
		const _lastPublished = await this.findAll(req, criterias);

	    _lastPublished.forEach( content => {
			_return['lastPublished'].push({
				'id' : content.id,
				'title' : content.title,
				'updatedAt' : content.updatedAt,
				'itsTheme' : content.itsTheme.title,
				'itsFamily': content.itsQuestionCategory.title,
			});
	    });
        
        criterias = {
            where: {
                published: 1,
            },
            order: [['updatedAt', 'DESC']],
            include: ['itsTheme', 'itsQuestionCategory'],
        };                              
		const contents = await this.findAll(req, criterias);
	    
	    contents.forEach(content => 
	    {
	        if( content.itsTheme && content.itsTheme.id )
	        {
				const localTheme  = content.itsTheme.id;
				
				_return['themes'][localTheme] = content.itsTheme.title;
				_return['byTheme'][localTheme]  = ( _return['byTheme'][localTheme] ? _return['byTheme'][localTheme] + 1 : 1 );
	        }

	        if( content.itsQuestionCategory && content.itsQuestionCategory.id )
	        {
				const localFamily = content.itsQuestionCategory.id;
				_return['families'][localFamily] = content.itsQuestionCategory.title;
	        	_return['byFamily'][localFamily] = ( _return['byFamily'][localFamily] ? _return['byFamily'][localFamily] + 1 : 1 );
	        }
	        
	        if( content.published != null )
	        {
				const localState  = content.published;
	        	
	        	_return['byState'][localState]  = ( _return['byState'][localState] ? _return['byState'][localState] + 1 : 1 );	
	        }
				                                                                                                              
	    });

		_return['total'] = contents.length;

		return _return;
    }
    
    public async bulkCreateZone(contentZoneInputList: IContentZoneDTO[]): Promise<{ contentZone: IContentZone[] }> {
        try {
            this.logger.silly('Creating contentZones');
            const contentZones: IContentZone[] = await this.contentZoneModel.bulkCreate(contentZoneInputList);

            if (!contentZones) {
                throw new Error('zone Order mappings could not be created');
            }

            return {contentZone: contentZones };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async bulkDelete(contentId: number): Promise<{}> {
        try {
            this.logger.silly('Deleting Contents');

            const contentZones: IContentZone[] = await this.contentZoneModel.destroy({
                where: {
                    contentId: contentId,
                },
            });

            return {};
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}