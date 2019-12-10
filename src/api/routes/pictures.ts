import { Router, Request, Response, NextFunction } 	from 'express';
import { Container } 					from 'typedi';
import { IPicture } from '../../interfaces/IPicture';
import middlewares from '../middlewares';

var path = require('path');
var mime = require('mime');
var fs = require('fs');

const route = Router();

export default (app: Router) => {
	app.use('/pictures', route);
	  
	route.get('/getPictureFileById/:id', async(req: Request, res: Response,next: NextFunction) => 
	{
		const logger:any = Container.get('logger');
		try
		{	
			const documentId   = req.params.id;
			const pictureModelService:any = Container.get('pictureModel')

			const picture:IPicture = await pictureModelService.findOne({
		        where: {
		           id: documentId
				}});
			
			if (!picture) throw new Error('Picture not found');

			const file = picture.path;
			
			const filename = path.basename(file);
			const mimetype = mime.lookup(file);

			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			res.setHeader('Content-type', mimetype);
			console.log('Streaming file now...');
			var filestream = fs.createReadStream(file);
			console.log('Piping file to response now...');
			filestream.on('error',(e)=>{
				logger.error('🔥 error in piping: %o', e);
				return next(e);
			}).pipe(res);

		}
		catch(e)
		{
			logger.error('🔥 error: %o', e);
			return next(e);
		}
	});
};