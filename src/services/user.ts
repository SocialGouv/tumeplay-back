import { Service, Inject } 			from 'typedi';
import { EventDispatcher, EventDispatcherInterface } 	from '../decorators/eventDispatcher';
import {IUser, IUserInputDTO }	from '../interfaces/IUser';



@Service()
export default class UserService 
{
	constructor(
		@Inject('userModel') private userModel : Models.UserModel,
		@Inject('logger') 		 		 private logger,
		@EventDispatcher() 		 		 private eventDispatcher: EventDispatcherInterface,
	) 
	{

	}


	public async findById(id: string): Promise<{ userRecords:IUser[] }> 
	{
		try 
		{
            
			const userRecords:IUser[] = await this.userModel.findAll({where: {id}});
			if (!userRecords) {
                throw new Error('User cannot be created');
			}                      
			
			/*this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord }); */

			return { userRecords };
		} 
		catch (e) 
		{
			this.logger.error(e);
			throw e;
		}
	}
	
	public async findByEmail(email: string): Promise<{ userRecords:IUser[] }> 
	{
		try 
		{
            
			const userRecords:IUser[] = await this.userModel.findAll({where: {email}});
			if (!userRecords) {
                throw new Error('User cannot be created');
			}                      
			
			/*this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord }); */

			return { userRecords };
		} 
		catch (e) 
		{
			this.logger.error(e);
			throw e;
		}
	}
}