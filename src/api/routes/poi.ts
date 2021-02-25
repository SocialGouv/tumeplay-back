import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { IPoi } from '../../interfaces/IPoi';
import { Op } from 'sequelize';

import PoiService from '../../services/poi';
import MondialRelayService from '../../services/mondial.relay';
import AddressValidatorService from '../../services/addressValidator';

const route = Router();

export default (app: Router) => {
	
    // Compute a rough square of 30km around a geopoint
    // Based on the fact that 1 degree is *roughly* 111.2km
    function computeRoughCoordinates(latitude, longitude) {
        var latChange = parseFloat(30 / 111.2);
        var lonChange = parseFloat(Math.abs(Math.cos(latitude * (Math.PI / 180))));
        var bounds = {
            latMin: parseFloat(latitude) - latChange,
            lonMin: parseFloat(longitude) - lonChange,
            latMax: parseFloat(latitude) + latChange,
            lonMax: parseFloat(longitude) + lonChange,
        };
        return bounds;
    }
    
    
    function formatTimetableRow(row) {
        let _return = null;
        if (row != null) {
            let splitted = row.split('-');

            if( typeof splitted[0] !== 'undefined' && splitted[0] != '' )
            {
            	if( Number.isNaN(splitted[0]) )
            	{
					_return = splitted[0];
            	}
            	else
            	{
					_return = splitted[0].substr(0, 2) + 'h' +splitted[0].substr(2);	
            	}
				
            }
            
            if( typeof splitted[1] !== 'undefined' && splitted[1] != '' )
            {
            	if( Number.isNaN(splitted[1]) )
            	{
					_return = _return + "-" + splitted[1];
            	}
            	else
            	{
				
					_return = _return + "-" + splitted[1].substr(0, 2) + 'h' +splitted[1].substr(2);
				}
            }
        }
        return _return;
    }
    
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
    
    function computeDistance(fromLatitude, fromLongitude, toLatitude, toLongitude)
    {
	    const fromLat = parseFloat(fromLatitude);
	    const toLat   = parseFloat(toLatitude);
	    const fromLon = parseFloat(fromLongitude);
	    const toLon   = parseFloat(toLongitude);
	    const R = 6371; // km
		const dLat = toRad(toLat-fromLat);
		const dLon = toRad(toLon-fromLon);
		const lat1 = toRad(fromLat);
		const lat2 = toRad(toLat);
		
		const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		const d = R * c;
		
		return d;
    }
    

    app.use('/poi', route);

    route.get('/pickup/:latitude/:longitude', async (req: Request, res: Response, next: NextFunction) => {
        const logger: any = Container.get('logger');
        try {
            const mondialRelay: any = Container.get(MondialRelayService);
			const addressValidator = Container.get(AddressValidatorService);
            const myPoints 	= await mondialRelay.fetchRemotePoints(req.params.latitude, req.params.longitude);
            const bounds 	= computeRoughCoordinates(req.params.latitude, req.params.longitude);
            
            const criterias = {
                where: {
                    active: true,
                    type: 'pickup',
                    latitude: {
                        [Op.gte]: bounds.latMin,
                        [Op.lte]: bounds.latMax,
                    },
                    longitude: {
                        [Op.gte]: bounds.lonMin,
                        [Op.lte]: bounds.lonMax,
                    },
                },
                include: [],
            };
            
            if( req.query.zone )
            {
                criterias.include.push({
                    association: 'availability_zone',
                    where: { name : req.query.zone.charAt(0).toUpperCase() + req.query.zone.slice(1) }   
                });
            }
            
            
            const points: [] = await Container.get(PoiService).findAllFiltered(req, criterias);

            if( !points || points.length == 0 )
            {
				return res.json({}).status(200);
            }
            
			let parsedPoints = points.filter(item => {
				return addressValidator.isZipCodeAllowed(item.zipCode) ? item : false;
			})
			
			
			
            parsedPoints = parsedPoints.map(point => {
            	
                const localTimetable = ( typeof point.horaires == "string") ? JSON.parse(point.horaires) : point.horaires;
                const parsedTimetable = {};

                if( localTimetable )
                {
	                Object.keys(localTimetable).forEach(function(key) {
	                	if( 
	                		( localTimetable[key]['am'] == '' && localTimetable[key]['pm'] == '' ) ||  
	                	    ( !localTimetable[key]['am'] && !localTimetable[key]['pm'] )
	                	)
	                	{
							return;
	                	}
	                    parsedTimetable[key] = {
	                        am: formatTimetableRow(localTimetable[key]['am']),
	                        pm: formatTimetableRow(localTimetable[key]['pm']),
	                    };
	                });
				}
                return {
                    key: point.id,
                    id: point.id,
                    name: point.name,
                    description: point.description,
                    zipCode: point.zipCode,
                    street: point.street,
                    city: point.city,
                    phoneNumber: point.phoneNumber ? point.phoneNumber : '',
                    coordinates: {
                        latitude: point.latitude,
                        longitude: point.longitude,
                    },
                    horaires: parsedTimetable,
                    distance: computeDistance(req.params.latitude, req.params.longitude,point.latitude,point.longitude)

                };
            });
            
            parsedPoints = parsedPoints.sort((a, b) => a.distance - b.distance).slice(0, 20);


            return res.json(parsedPoints).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);

            return next(e);
        }
    });
};
