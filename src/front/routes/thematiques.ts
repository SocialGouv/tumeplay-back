import { Container } 				 from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import middlewares 					 from '../middlewares';
// SERVICES
import ThematiqueService from '../../services/thematique';
import PictureService from '../../services/picture';
// ----
import { celebrate, Joi } from 'celebrate';
import { IThematiqueInputDTO, IThematique } from '../../interfaces/IThematique';
import { IPictureInputDTO, IPicture } from '../../interfaces/IPicture';

var multer = require('multer');

var themeMulterStorage = multer.diskStorage(
    {
        destination: 'uploads/themeFiles',
        filename: function ( req, file, cb ) {
			cb( null, Date.now() + '-' + file.originalname);
		}
    }
);
var uploadTheme = multer({ storage: themeMulterStorage });



const route = Router();

export default (app: Router) => {
	app.use('/thematiques', route);
	route.get('/', middlewares.isAuth, async(req: Request, res: Response) =>  
	{
		try
		{
			const thematiqueService:any = Container.get('thematiqueModel');

			const thematiques:IThematique[] = await thematiqueService.findAll({include:['picture']});
			console.info('Got thematiques and pictures');

			return res.render("page-thematiques", {  thematiques  });
		}
		catch(e)
		{
			throw e;
		}
		//res.end();
	});

	route.get('/add', middlewares.isAuth, async(req: Request, res: Response) =>  
	{
		try
		{
			return res.render("page-thematique-edit", {
		    });
		}
		catch(e)
		{
			throw e;
		}
	});

	route.post('/add',middlewares.isAuth, uploadTheme.single('themePicture'), async(req:any, res: Response)=> {
		const logger = Container.get<any>('logger');
		logger.debug('Calling Front Create endpoint with body: %o', req.body);
		console.log('Got photo in req.file: ', req.file);

		try
		{
			let thematiqueItem:IThematiqueInputDTO = {
				title: req.body.title,
				active:req.body.active,
				pictureId: null
			};
			const picObject = req.file;

			if (picObject){
				// Processing the file if any file in req.file (PICTURE)
				const pictureServiceInstance = Container.get(PictureService);
				const { picture } = await pictureServiceInstance.create(picObject as IPictureInputDTO);
				// Assigning pic id to the thematique item
				thematiqueItem.pictureId = picture.id;
			}

			const contentServiceInstance	=	Container.get(ThematiqueService);
			await contentServiceInstance.create(thematiqueItem);

			return res.redirect('/thematiques');
		
		}
		catch(e)
		{
			throw e;
		}
	});


	route.get('/edit/:id', middlewares.isAuth, async(req: Request, res: Response) =>  
	{
		try
		{
			const documentId   = req.params.id;
			const ThematiqueModel:any = Container.get('thematiqueModel')

			const thematique:IThematique 	   = await ThematiqueModel.findOne({
		        where: {
		           id: documentId
				},
				include: ['picture']
			});
			return res.render("page-thematique-edit", {
		        thematique
		    });
		}
		catch(e)
		{
			throw e;
		}
	});
	
	route.post('/edit/:id', middlewares.isAuth, uploadTheme.single('themePicture'),
		async(req: any, res: Response) =>  
		{
			try
			{
				const documentId   = +req.params.id;

				let thematiqueItem:IThematiqueInputDTO = {
					title: req.body.title,
					active: req.body.active,
					pictureId: undefined
				};
				const thematiqueServiceInstance 		= Container.get(ThematiqueService);
				
				// Checking if a file has also been uploaded
				if (req.file){
					const picObject = req.file;

					if (picObject){
						// Processing the file if any file in req.file (PICTURE)
						const pictureServiceInstance = Container.get(PictureService);
						const { picture } = await pictureServiceInstance.create(picObject as IPictureInputDTO);
						// Assigning pic id to the thematique item
						thematiqueItem.pictureId = picture.id;
					}
				}
				
				await thematiqueServiceInstance.update(documentId, thematiqueItem as IThematiqueInputDTO);

				return res.redirect('/thematiques');
			
			}
			catch(e)
			{
				throw e;
			}
		}
	);
};