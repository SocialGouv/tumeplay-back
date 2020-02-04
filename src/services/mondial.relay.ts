import md5 from 'md5';
import { Service, Inject } 			from 'typedi';
import { EventDispatcher, EventDispatcherInterface } 	from '../decorators/eventDispatcher';
import { Container } from 'typedi';
import PoiService from './poi';
import Config from '../config'; 
var soap = require('soap');
                           

@Service()
export default class MondialRelayService 
{
	constructor(
		@Inject('logger') 		 		 private logger,
		@EventDispatcher() 		 		 private eventDispatcher: EventDispatcherInterface,
	) 
	{

	}
	
    private buildParams(latitude, longitude)
	{
		let params = {
			Enseigne : Config.mondialRelay.websiteId,
			Pays : 'FR',
			Ville: '',
			CP : '',
			Latitude : latitude.substr(0, 10),
			Longitude: longitude.substr(0, 9),
			Taille : '',
			Poids: '',
			Action: '',
			DelaiEnvoi: '0',
			RayonRecherche: '40'
		};
		
		let securityKey = '';
		for( const prop in params)
		{
			securityKey += params[prop];
		}
		
		securityKey += Config.mondialRelay.websiteKey;
		
		const hash = md5(securityKey);
		                   
		params.Security = hash.toUpperCase(); 
		
		return params;
	}
	
	private parseTimetable(timetables)
	{
		const timetable = timetables.string;

		var _return = {
			am: null,
			pm: null
		}
		if( 
			timetable[0] != '' && timetable[1] != '' && 
			timetable[0] != '0000' && timetable[1] != '0000' )
		{
			_return.am = timetable[0] + '-' + timetable[1];
		}
		
		
		if( 
			timetable[2] != '' && timetable[3] != '' && 
			timetable[2] != '0000' && timetable[3] != '0000' )
		{
			_return.pm = timetable[2] + '-' + timetable[3];
		}
		
		return _return;
	}
	
	private async handleSoapResponse(localResults)
	{
		const returnResults = [];
		const poiServiceInstance = Container.get(PoiService);
		const mondialRelayInstance: any = Container.get(MondialRelayService);
		
		for( let i = 0; i < localResults.PointsRelais.PointRelais_Details.length; i++ )
		{
			const pointRelais = localResults.PointsRelais.PointRelais_Details[i]; 
			const localPoint = await mondialRelayInstance.handleSoapItem(mondialRelayInstance, poiServiceInstance, pointRelais);
			
			returnResults.push(localPoint);

		}
		
		console.log("Returning results.");
		
		return returnResults;
	}

    private async handleSoapItem(mondialRelayInstance, poiServiceInstance, pointRelais)
	{
		try
		{
			const { poi } = await poiServiceInstance.findByExternalNumber( pointRelais.Num );  
			
			if( !poi )
			{
				throw Error('POI Not found. Creating one.');
			}

			return poi;
		}
		catch(e)
		{
		
		  console.log("ERROR : " + e);
		  // POI cannot be found. Creating one.
		  const horaires = {
			'lundi' : mondialRelayInstance.parseTimetable(pointRelais.Horaires_Lundi),
			'mardi' : mondialRelayInstance.parseTimetable(pointRelais.Horaires_Mardi),
			'mercredi' : mondialRelayInstance.parseTimetable(pointRelais.Horaires_Mercredi),
			'jeudi' : mondialRelayInstance.parseTimetable(pointRelais.Horaires_Jeudi),
			'vendredi' : mondialRelayInstance.parseTimetable(pointRelais.Horaires_Vendredi),
			'samedi' : mondialRelayInstance.parseTimetable(pointRelais.Horaires_Samedi),
			'dimanche' :  mondialRelayInstance.parseTimetable(pointRelais.Horaires_Dimanche)
		  };
		  const poiItem: IPoiInputDTO = {
			name		: pointRelais.LgAdr1,
			description	: pointRelais.Information,
			type		: "pickup",
			zipCode		: pointRelais.CP,
			street		: pointRelais.LgAdr3,
			city		: pointRelais.Ville,
			latitude	: parseFloat(pointRelais.Latitude.replace(/,/, '.')),
			longitude	: parseFloat(pointRelais.Longitude.replace(/,/, '.')),
			externalNumber: pointRelais.Num,
			active		: true,
			horaires 	: JSON.stringify(horaires),
		  }
			            
		  await poiServiceInstance.create(poiItem);
		  
		  return poiItem;
		}
	}

	async fetchRemotePoints(latitude, longitude)
	{
		const params = this.buildParams(latitude, longitude);
		const targetUrl = 'http://api.mondialrelay.com/Web_Services.asmx?WSDL';

		const soapClient = await soap.createClientAsync(targetUrl);
		
		const targetRes  = await soapClient.WSI3_PointRelais_RechercheAsync(params);
		let finalRes = false;
		
		if( targetRes && typeof targetRes[0].WSI3_PointRelais_RechercheResult !== "undefined" )
		{
			const localResults = targetRes[0].WSI3_PointRelais_RechercheResult;
			
			if( localResults.STAT == 0 )
			{
				const mondialRelay: any = Container.get(MondialRelayService);
			
				finalRes = await mondialRelay.handleSoapResponse(localResults);	  			  	  
			}
		}
		return finalRes;
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