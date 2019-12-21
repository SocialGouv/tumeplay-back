import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import { IProductInputDTO } from '../../interfaces/IProduct';
import { IPictureInputDTO } from '../../interfaces/IPicture';
import PictureService from '../../services/picture';
import ProductService from '../../services/product';

const route = Router();

var multer = require('multer');

var productMulterStorage = multer.diskStorage(
	{
		destination: 'uploads/pictures/product',
		filename: function (req, file, cb) {
			cb(null, Date.now() + '-' + file.originalname);
		}
	}
);

var uploadProduct = multer({ storage: productMulterStorage });


export default (app: Router) => {
	const products_URL = '/products';

	app.use(products_URL, route);



	route.get('/', middlewares.isAuth, async (req: Request, res: Response) => {
		try {
			const ProductModel: any = Container.get('productModel')

			const products = await ProductModel.findAll(
				{
					where: {
						deleted: false
					},
					include: ['picture']
				}
			);

			return res.render("page-products", {
				username: req['session'].name,
				products
			});
		}
		catch (e) {
			throw e;
		}
	});

	route.get('/add', middlewares.isAuth, async (req: Request, res: Response) => {
		try {
			return res.render("page-product-edit", {
			});
		}
		catch (e) {
			throw e;
		}
	});

	route.get('/edit/:id', middlewares.isAuth, async (req: Request, res: Response) => {
		try {
			const documentId = +req.params.id;
			const productServiceInstance: ProductService = Container.get(ProductService);

			const { product } = await productServiceInstance.findById(documentId, true);

			return res.render("page-product-edit", {
				username: req['session'].name,
				product
			});
		}
		catch (e) {
			throw e;
		}
	});


	route.post('/add', middlewares.isAuth, uploadProduct.single('productPicture'),
		async (req: any, res: Response) => {
			const logger: any = Container.get('logger');
			logger.debug('Calling Front Create endpoint with body: %o', req.body);

			try {
				let productItem: IProductInputDTO = {
					title: req.body.title,
					description: req.body.description,
					shortDescription: req.body.shortDescription,
					price: null,
					active: (req.body.active == 'on'),
					deleted: false,
					pictureId: null
				}

				// Setup picture
				const picObject: IPictureInputDTO = req.file;

				if (picObject) {
					// Processing the file if any file in req.file (PICTURE)
					let pictureServiceInstance = Container.get(PictureService);
					const { picture } = await pictureServiceInstance.create(picObject);
					// Assigning pic id to the thematique item
					productItem.pictureId = picture.id;
				}
				const productServiceInstance = Container.get(ProductService);
				await productServiceInstance.create(productItem);

				return res.redirect(products_URL);

			}
			catch (e) {
				throw e;
			}
		}
	);


	route.post('/edit/:id', middlewares.isAuth, uploadProduct.single('productPicture'),
		async (req: any, res: Response) => {
			const logger: any = Container.get('logger');
			logger.debug('Calling Front Create endpoint with body: %o', req.body);

			try {

				const documentId = req.params.id;

				let productItem: IProductInputDTO = {
					title: req.body.title,
					description: req.body.description,
					shortDescription: req.body.shortDescription,
					price: req.body.price,
					active: (req.body.active == 'on'),   
					deleted: false,
					pictureId: undefined
				}

				// Setup picture
				if (req.file) {
					const picObject: IPictureInputDTO = req.file;
					// Processing the file if any file in req.file (PICTURE)
					let pictureServiceInstance = Container.get(PictureService);
					const { picture } = await pictureServiceInstance.create(picObject);
					// Assigning pic id to the thematique item
					productItem.pictureId = picture.id;
				}

				// Updating
				const productServiceInstance: ProductService = Container.get(ProductService);
				await productServiceInstance.update(documentId, productItem);

				return res.redirect(products_URL);

			}
			catch (e) {
				throw e;
			}
		}
	);

	route.post('/delete/:id', middlewares.isAuth, async (req: any, res: Response) => {
		const logger: any = Container.get('logger');
		logger.debug('Calling Front Create endpoint with body: %o', req.body);

		try {

			const documentId = req.params.id;

			// Updating
			const productServiceInstance: ProductService = Container.get(ProductService);
			await productServiceInstance.update(documentId, { deleted: true });

			return res.redirect(products_URL);

		}
		catch (e) {
			throw e;
		}
	}
	);


};