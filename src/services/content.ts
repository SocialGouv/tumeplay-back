import { Service, Inject } from 'typedi';
import ContentModel from '../models/content';
import { IContent, IContentInputDTO } from '../interfaces/IContent';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class ContentService {
    public constructor(
        @Inject('contentModel') private contentModel: Models.ContentModel,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(contentInput: IContentInputDTO): Promise<{ content: IContent }> {
        try {
            this.logger.silly('Creating content');
            
            const contentRecord = await this.contentModel.create({
                ...contentInput,
            });

            if (!contentRecord) {
                throw new Error('Content cannot be created');
            }

            return { contentRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(contentId: Integer, contentInput: IContentInputDTO): Promise<{ content: IContent }> {
        const contentRecord = await this.contentModel.findOne({
            where: {
                id: contentId,
            },
        });

        if (!contentRecord) {
            throw new Error('Content not found.');
        }

        this.logger.silly('Updating content');
                                 
        await contentRecord.update(contentInput);

        return { contentRecord };
    }
    
    public async changeState(contentId: Integer, targetState: Integer): Promise<{  }> {
    	
    	await this.update(contentId, { published: targetState });
    	
        return {};
	}
	
	public async changeCategory(contentId: Integer, targetCategory: Integer, targetThematique: Integer): Promise<{  }> {
    	
    	let data = {};
    	
    	if( targetCategory != '' )
    	{
			data.categoryId = targetCategory;
    	}
    	
    	if( targetThematique != '' )
    	{
			data.themeId = targetThematique;
    	}
    	
    	await this.update(contentId, data);
    	
        return {};
	}
	
	public async duplicate(contentId: Integer): Promise<{ content: IContent }> {
		
		const contentRecord = await this.contentModel.findOne({
            where: {
                id: contentId,
            },
        });
        
        if (!contentRecord) {
            throw new Error('Content not found.');
        }
        
        this.logger.silly('Duplicate content.');
        
        const contentInput = {
			title: contentRecord.title,
			text: contentRecord.text,
			link: contentRecord.link,
			published: contentRecord.published,
			pictureId: contentRecord.pictureId,
			themeId: contentRecord.themeId,
			categoryId: contentRecord.categoryId,	
        }                     
        
        await this.create(contentInput);
        
        return { contentRecord };
	}
    
    public async delete(contentId: Integer) {
	    await this.contentModel.destroy({ where: {id: contentId}}) ;
	    
	    return;
    }
    
    public async getContentStates() {
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
    
    public async getContentStatesAsArray()
    {
		const states  = await this.getContentStates();
		const _return = [];
		
		states.forEach( item => {
			_return[item.id] = item.title;
		});
		
		return _return;
    }
}
