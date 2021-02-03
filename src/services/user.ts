import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import { Op } from 'sequelize';
import config from '../config';
import AclService from './acl';

@Service()
export default class UserService {
    public constructor(
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('userZoneModel') private userZoneModel: Models.UserZone,
        @Inject('userPoiModel') private userPoiModel: Models.UserPoi,
        @Inject('availabilityZoneModel') private availabilityZoneModel: Models.AvailabilityZoneModel,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async findAll(req, criterias) 
    {
        try {
            this.logger.silly('Finding users');
            
            this.alterQuery(req, criterias);
            
            const users = await this.userModel.findAll(criterias);
            
            return users;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findOne(req, criterias) 
    {
        try {
            this.logger.silly('Finding user');
            
            this.alterQuery(req, criterias);
            
            const user = await this.userModel.findOne(criterias);
            
            return user;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async findByRole(req, role)
    {
		try {
			let criterias = {
				where: { 
					roles: { [Op.like]:  '%'+role+'%' }
				}
			};
            this.logger.silly('Finding user');
            
            this.alterQuery(req, criterias);
            
            const users = await this.userModel.findAll(criterias);
            
            return users;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    public async delete(req, criterias)
    {
		try {
            this.logger.silly('Deleting user');
            
            this.alterQuery(req, criterias);
            
            console.log(criterias);
            
            const user = await this.userModel.findOne(criterias);
            
            if( user )
            {
            	console.log("Deleting user : " + user.id);
            	await this.assignZones(user.id, []);
				await this.userModel.destroy({ where: { id: user.id }} );
            }
            else
            {
				console.log("User not found.");
            }
            
            return user;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
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
    
    public async findById(id: string): Promise<{ userRecords: IUser[] }> {
        try {
            const userRecords: IUser[] = await this.userModel.findAll({ where: { id } });
            if (!userRecords) {
                throw new Error('User cannot be created');
            }

            /*this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord }); */

            return { userRecords };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findByEmail(email: string): Promise<{ userRecords: IUser[] }> {
        try {
            const userRecords: IUser[] = await this.userModel.findAll({ where: { email } });
            if (!userRecords) {
                throw new Error('User cannot be created');
            }

            /*this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord }); */

            return { userRecords };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    
    public async create(userInput: IUserInputDTO): Promise<{ user: IUser }> {
        try {
            this.logger.silly('Creating user');
            
            const userRecord = await this.userModel.create({
                ...userInput,
            });

            if (!userRecord) {
                throw new Error('User cannot be created');
            }

            return {user: userRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(req, userId: Integer, userInput: IUserInputDTO): Promise<{ user: IUser }> {
        const criterias = {
            where: {
                id: userId,
            },
        };
        
        this.alterQuery(criterias);
        
        const userRecord = await this.userModel.findOne(criterias);

        if (!userRecord) {
            throw new Error('User not found.');
        }

        this.logger.silly('Updating user');
                                 
        await userRecord.update(userInput);

        return { userInput };
    }
    
    public async assignZones(userId, userZones): Promise<> {
        try {
            await this.userZoneModel.destroy({ where: { userId: userId}} );
            
            if( userZones.length > 0 )                  
            {
	            const localZones = userZones.map( item => {
					return {
						userId: userId,
						availabilityZoneId: item.replace("zone_", ""),	 // Needed to pass IDs as a object, not an array
					};
	            })
	            
	            console.log(localZones);
	            
	            await this.userZoneModel.bulkCreate(localZones);
			}
            return;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    
    
    public async assignPois(userId, userPois): Promise<> {
        try {
            await this.userPoiModel.destroy({ where: { userId: userId}} );
            
            if( userPois.length > 0 )                  
            {
            	const localPois = [{ userId: userId, poiId: userPois.replace("poi_", "")}];
	                             
	            await this.userPoiModel.bulkCreate(localPois);
			}
            return;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    
    public async getAllowedZones(req)
    {
    	let allowedZones = [];
    	
		if ( AclService.hasRole(req.session.roles, config.roles.administrator) )
		{
			allowedZones = await this.availabilityZoneModel.findAll();			
		}
		else
		{
			allowedZones = await this.availabilityZoneModel.findAll({where : { id : req.session.zones }});
		}
		
		return allowedZones;
    }
}
