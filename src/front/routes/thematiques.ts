import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
// SERVICES
import ThematiqueService from '../../services/thematique';
import PictureService from '../../services/picture';
import UserService from '../../services/user';
import SoundService from '../../services/sound';
import AvailabilityZoneService from '../../services/availability.zone';
// ----
import { celebrate, Joi } from 'celebrate';
import { IThematiqueInputDTO, IThematique } from '../../interfaces/IThematique';
import { IPictureInputDTO, IPicture } from '../../interfaces/IPicture';



var multer = require('multer');

var themeMulterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "themePicture") {
        cb(null, 'uploads/pictures/theme');
      } 
      else// if ( file.fieldname.includes('thematicSound') )
      {
          cb(null, 'uploads/sounds/theme')
      }  
  	},
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

var uploadTheme = multer({ storage: themeMulterStorage });

const route = Router();

export default (app: Router) => {
	const aclSection = 'thematics';
	
    app.use('/thematiques', route);
    
    route.get('/', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'view'),  
    	async (req: Request, res: Response) => {
        try {
            const thematiqueService: any = Container.get('thematiqueModel');

            const thematiques: IThematique[] = await thematiqueService.findAll({ include: ['picture'] });
            console.info('Got thematiques and pictures');

            return res.render('page-thematiques', { thematiques });
        } catch (e) {
            throw e;
        }
        //res.end();
    });

    route.get('/add', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),
    	async (req: Request, res: Response) => {
        try {
        	const zones     = await Container.get(UserService).getAllowedZones(req);
            const hasSound  = await Container.get(AvailabilityZoneService).hasSoundEnabled(zones);
            
            return res.render('page-thematique-edit', {
				allZones: zones,
                hasSound: hasSound,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
    	'/add', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),
    	uploadTheme.any(), 
    	async (req: any, res: Response) => 
    	{
	        const logger = Container.get<any>('logger');
	        logger.debug('Calling Front Create endpoint with body: %o', req.body);
	        

	        try {
	            let thematiqueItem: IThematiqueInputDTO = {
	                title: req.body.title,
	                active: req.body.active,
	                isSpecial: req.body.isSpecial,
	                pictureId: null,
	            };
	            
	            const pictureId = await handlePicture(req, req.files);
            
	            if( pictureId )
	            {
					thematiqueItem.pictureId = pictureId;
	            }
	            

	            const contentServiceInstance = Container.get(ThematiqueService);
	            await contentServiceInstance.create(thematiqueItem);

	            req.session.flash = {msg: "La thématique a bien été créée.", status: true};
	            
	            return res.redirect('/thematiques');
	        } catch (e) {
	            throw e;
	        }
    	}
    );

    route.get(
    	'/edit/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),
    	async (req: Request, res: Response) => {
        try {
            const documentId = req.params.id;
            const zones      = await Container.get(UserService).getAllowedZones(req);
            const hasSound   = await Container.get(AvailabilityZoneService).hasSoundEnabled(zones);
            
            const thematique: IThematique = await Container.get('thematiqueModel').findOne({
                where: {
                    id: documentId,
                },
                include: ['picture','sounds'],
            });
            return res.render('page-thematique-edit', {
                thematique,
                allZones: zones,
                hasSound: hasSound,
            });
        } catch (e) {
            throw e;
        }
    });

    route.post(
    	'/edit/:id', 
    	middlewares.isAuth, 
    	middlewares.isAllowed(aclSection, 'global', 'edit'),
    	uploadTheme.any(),
    	async (req: any, res: Response) => {
        try {
            const documentId = +req.params.id;
            
            let thematiqueItem: IThematiqueInputDTO = {
                title: 		req.body.title,
                active: 	req.body.active,
                isSpecial: 	req.body.isSpecial,
                pictureId: 	undefined,
            };
            
            const pictureId = await handlePicture(req, req.files);
            
            if( pictureId )
            {
				thematiqueItem.pictureId = pictureId;
            }
            
            await Container.get(ThematiqueService).update(documentId, thematiqueItem as IThematiqueInputDTO);

            await handleSounds(req, documentId, req.files);
            
            req.session.flash = {msg: "La thématique a bien été mise à jour.", status: true};
            
            return res.redirect('/thematiques');
        } catch (e) {
            throw e;
        }
    });
    
    const handleSounds = async(req, documentId, bodyFiles) => {
		if( typeof bodyFiles != 'undefined' && bodyFiles.length > 0 )
		{
			for( let i = 0; i < bodyFiles.length; i++ )
			{
				const currentFile = bodyFiles[i];
				if( currentFile.fieldname.includes('thematicSound') )	
				{
					const targetZone = currentFile.fieldname.replace('thematicSound[zone_', '').replace(']', '');
					
					currentFile.availabilityZoneId = parseInt(targetZone);
					
					const {sound} = await Container.get(SoundService).create(currentFile);
					
					if( sound )
					{
						await Container.get(SoundService).handleThematicSound(documentId, sound.id);
					}
				}
			}
		}
    }
    
    const handlePicture = async(req, bodyFiles) => {
    	let thematicPicture = null;
		let _returnId 		= false;
		if( bodyFiles && bodyFiles.length > 0 )
		{
	        for( let i = 0; i < bodyFiles.length; i++ )
			{
				const currentFile = bodyFiles[i];
				if( currentFile.fieldname == 'themePicture')	
				{
					thematicPicture = currentFile;
				}                         
			}
		}  
	    
	    if( thematicPicture )
	    {
            const { picture } = await Container.get(PictureService).create(thematicPicture as IPictureInputDTO);
            _returnId = picture.id;
	    }
		
		return _returnId;
    }
};
