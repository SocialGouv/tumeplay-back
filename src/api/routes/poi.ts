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
        var latChange = 30 / 111.2;
        var lonChange = Math.abs(Math.cos(latitude * (Math.PI / 180)));
        var bounds = {
            latMin: latitude - latChange,
            lonMin: longitude - lonChange,
            latMax: latitude + latChange,
            lonMax: longitude + lonChange,
        };
        return bounds;
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

            console.log('MY POINTS');
            console.log(myPoints);

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
                };
            });

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
