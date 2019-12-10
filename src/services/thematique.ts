import { Service, Inject } 				from 'typedi';
import config							from '../config';
import { IThematique, IThematiqueInputDTO }	from '../interfaces/IThematique';
import events 							from '../subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';


@Service()
export default class ThematiqueService 
{
	constructor(
		@Inject('thematiqueModel') private thematiqueModel : Models.ThematiqueModel,
		@Inject('logger') 		private logger,
		@EventDispatcher() 		private eventDispatcher: EventDispatcherInterface,
	) 
	{

	}

	public async create(thematiqueInput: IThematiqueInputDTO): Promise<{ thematique: IThematique }> 
	{
		try 
		{
			this.logger.silly('Creating thematique',thematiqueInput);
			
			thematiqueInput.active = ( thematiqueInput.active == "on" );
			     
			const thematiqueRecord = await this.thematiqueModel.create({
				...thematiqueInput
			});
			
			if (!thematiqueRecord) {
				throw new Error('Content cannot be created');
			}

			return { thematiqueRecord };
		} 
		catch (e) 
		{
			this.logger.error(e);
			throw e;
		}
	}

	public async update(thematiqueId : Number, thematiqueInput: IThematiqueInputDTO): Promise<{ thematique: IThematique }> 
	{
		const thematiqueRecord = await this.thematiqueModel.findOne({
		   where: {
			   id: thematiqueId
		   }
		});
		
		if (!thematiqueRecord) 
		{
			throw new Error('Content not found.');
		}                                                    
		
		this.logger.silly('Updating thematique');
				
		thematiqueInput.active = ( thematiqueInput.active == "on" );
		
		await thematiqueRecord.update(thematiqueInput);
		
		return { thematiqueRecord };
	
	}
}