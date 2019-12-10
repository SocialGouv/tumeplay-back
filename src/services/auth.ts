import { Service, Inject } 		from 'typedi';
import jwt 						from 'jsonwebtoken';
import config					from '../config';
import argon2 					from 'argon2';
import UserModel 				from '../models/user';
import { randomBytes } 			from 'crypto';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import events 					from '../subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';


@Service()
export default class AuthService 
{
	constructor(
		@Inject('userModel') 	private userModel : Models.UserModel,
		@Inject('logger') 		private logger,
		@EventDispatcher() 		private eventDispatcher: EventDispatcherInterface,
	) 
	{

	}

	public async create(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> 
	{
		try 
		{
			const salt = randomBytes(32);

			this.logger.silly('Hashing password');
			
			const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
			
			this.logger.silly('Creating user db record');
			     
			const userRecord = await this.userModel.create({
				...userInputDTO,
				salt: salt.toString('hex'),
				password: hashedPassword,
			});
			
			
			this.logger.silly('Generating JWT');
			const token = this.generateToken(userRecord);

			if (!userRecord) {
			throw new Error('User cannot be created');
			}                      
			
			/*this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord }); */

			
			var jsonString 	= JSON.stringify(userRecord);
			var user 		= JSON.parse(jsonString);
			
			Reflect.deleteProperty(user, 'password');
			Reflect.deleteProperty(user, 'salt');
			
			return { user, token };
		} 
		catch (e) 
		{
			this.logger.error(e);
			throw e;
		}
	}

	public async login(email: string, password: string): Promise<{ user: IUser; token: string }> 
	{
		const userRecord = await this.userModel.findOne({
		   where: {
			   email: email
		   }
		});
		
		if (!userRecord) 
		{
			throw new Error('User not registered');
		}                                                    
		
		//this.logger.debug('Having user  : %o', userRecord);
		this.logger.silly('Checking password');
		
		const validPassword = await argon2.verify(userRecord.password, password);
		
		if (validPassword) 
		{
			this.logger.silly('Password is valid!');
			this.logger.silly('Generating JWT');
			const token = this.generateToken(userRecord);

			var jsonString 	= JSON.stringify(userRecord);
			var user 		= JSON.parse(jsonString);
			
			Reflect.deleteProperty(user, 'password');
			Reflect.deleteProperty(user, 'salt');
			
			return { user, token };
		} 
		else 
		{
			throw new Error('Invalid Password');
		}
	}

	private generateToken(user) 
	{
		const today = new Date();
		const exp 	= new Date(today);
		
		exp.setDate(today.getDate() + 60);

		this.logger.silly(`Sign JWT for userId: ${user.id}`);
		return jwt.sign
		(
			{
				id: user.id, // We are gonna use this in the middleware 'isAuth'
				//role: user.role,
				name: user.name,
				exp: exp.getTime() / 1000,
			},
			config.jwtSecret,
		);
	}
}