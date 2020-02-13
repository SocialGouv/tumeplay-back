import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { IPoi } from '../../interfaces/IPoi';
import { Op } from 'sequelize';
import MondialRelayService from '../../services/mondial.relay';

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
    
    
    function formatTimetableRow(row) {
        let _return = null;
        if (row != null) {
            let splitted = row.split('-');

            _return =
                splitted[0].substr(0, 2) +
                'h' +
                splitted[0].substr(2) +
                ' - ' +
                splitted[1].substr(0, 2) +
                'h' +
                splitted[1].substr(2);
        }
        return _return;
    }
    
    app.use('/poi', route);

    route.get('/pickup/:latitude/:longitude', async (req: Request, res: Response, next: NextFunction) => {
        const logger: any = Container.get('logger');
        try {
            const mondialRelay: any = Container.get(MondialRelayService);

            const myPoints = await mondialRelay.fetchRemotePoints(req.params.latitude, req.params.longitude);

            const poiService: any = Container.get('poiModel');
            const bounds = computeRoughCoordinates(req.params.latitude, req.params.longitude);
            
            const points: [] = await poiService.findAll({
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
            });

            let parsedPoints = points.map(point => {
            	
                const localTimetable = ( typeof point.horaires == "string") ? JSON.parse(point.horaires) : point.horaires;
                const parsedTimetable = {};

                Object.keys(localTimetable).forEach(function(key) {
                    parsedTimetable[key] = {
                        am: formatTimetableRow(localTimetable[key]['am']),
                        pm: formatTimetableRow(localTimetable[key]['pm']),
                    };
                });

                return {
                    key: point.id,
                    id: point.id,
                    name: point.name,
                    description: point.description,
                    zipCode: point.zipCode,
                    street: point.street,
                    city: point.city,
                    coordinates: {
                        latitude: point.latitude,
                        longitude: point.longitude,
                    },
                    horaires: parsedTimetable,
                    distance: computeDistance(req.params.latitude, req.params.longitude,point.latitude,point.longitude)
                };
            });

            parsedPoints.sort((a, b) => a.distance - b.distance);

            return res.json(parsedPoints).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);

            return next(e);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger: any = Container.get('logger');
        try {
            const documentId = req.params.id;
            const ThematiqueModel: any = Container.get('thematiqueModel');

            const thematique: IThematique = await ThematiqueModel.findOne({
                where: {
                    id: documentId,
                },
                include: ['picture'],
            });
            return res.json({ thematique }).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    });


};
