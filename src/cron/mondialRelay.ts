import md5 from 'md5';
import { Container } from 'typedi';
import PoiService from '../services/poi';                            
var soap = require('soap');


const websiteId = 'BDTEST13';
const websiteKey = 'PrivateK';

const targetUrl = 'http://api.mondialrelay.com/Web_Services.asmx?WSDL';
var myParams = {
  Enseigne : websiteId,
  Pays : 'FR',
  Ville: '',
  CP : '75010',
  Latitude : '',
  Longitude: '',
  Taille : '',
  Poids: '',
  Action: '',
  DelaiEnvoi: '0',
  RayonRecherche: '20'
};

var myKey = '';
for( const prop in myParams)
{
	myKey += myParams[prop];
}

myKey += websiteKey;

const hash = md5(myKey);
                   
myParams.Security = hash.toUpperCase(); 

function buildHoraires(horaires)
{
	horaires = horaires.string;
	var _return = {
		am: horaires[0] + '-' + horaires[1],
		pm: null
	}
	if( horaires[2] != '0000' && horaires[3] != '0000' )
	{
		_return.pm = horaires[2] + '-' + horaires[3];
	}
	
	return _return;
}

async function handleSoapResponse(localResults)
{
	const poiServiceInstance = Container.get(PoiService);
	console.log(localResults.PointsRelais.PointRelais_Details);
	  
	localResults.PointsRelais.PointRelais_Details.map(function(pointRelais) {
		  handleSoapItem(poiServiceInstance, pointRelais);
		  
		  
	  });
}

async function handleSoapItem(poiServiceInstance, pointRelais)
{
	console.log('Handling POI.');
	  console.log(pointRelais);
	  try
	  {
			const { poi } = await poiServiceInstance.findByExternalNumber( pointRelais.Num );  
			
			if( !poi )
			{
				throw Error('POI Not found. Creating one.');
			}
	  }
	  catch(e)
	  {
		  console.log("ERROR : " + e);
		  // POI cannot be found. Creating one.
		  const horaires = {
			'lundi' : buildHoraires(pointRelais.Horaires_Lundi),
			'mardi' : buildHoraires(pointRelais.Horaires_Mardi),
			'mercredi' : buildHoraires(pointRelais.Horaires_Mercredi),
			'jeudi' : buildHoraires(pointRelais.Horaires_Jeudi),
			'vendredi' :buildHoraires(pointRelais.Horaires_Vendredi),
			'samedi' : buildHoraires(pointRelais.Horaires_Samedi),
			'dimanche' :  buildHoraires(pointRelais.Horaires_Dimanche)
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
			            
		poiServiceInstance.create(poiItem);
		
		
	  }
}

soap.createClient(targetUrl, function( err, client) {
	client.WSI3_PointRelais_Recherche(myParams, function(err, result) {
		  if( result && typeof result.WSI3_PointRelais_RechercheResult !== "undefined" )
		  {
		  	  const localResults = result.WSI3_PointRelais_RechercheResult;
			  if( localResults.STAT == 0 )
			  {
			  	handleSoapResponse(localResults);	  			  	  
			  }
		  }       
      });
});                   
                   