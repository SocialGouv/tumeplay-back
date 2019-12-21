import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { IProduct, IProductInputDTO } from '../../interfaces/IProduct';
import { IBox, IBoxInputDTO } from '../../interfaces/IBox';
import { IBoxProduct, IBoxProductInputDTO } from '../../interfaces/IBoxProduct';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/boxs', route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const logger: any = Container.get('logger');
    try {
      var _return = [];
      
      const ProductModel: any = Container.get('productModel')
      const BoxProductModel: any = Container.get('boxProductModel');
      const BoxModel: any = Container.get('boxModel');
      
      const boxs = await BoxModel.findAll(
		{
          where: {
            deleted: false,
            active: true
          },
          include: ['picture'],          
        }  
      );
      
      const products = await ProductModel.findAll(
		{
          where: {
            deleted: false,
            active: true
          },
          include: ['picture'],          
        }  
      );
      
      
      
      for(var i = 0; i < boxs.length; i++)
      {
      	  const box = boxs[i];
		  
		  var localBox = {
			  key: box.id,
			  id: box.id,
			  title: box.title,
			  description: box.description,
			  price: 500,
			  products: [],
			  picture: box.picture.destination + '/'+ box.picture.filename,
		  }
		  
		  const localProducts = await BoxProductModel.findAll(
		  {
			where: {
            	boxId: box.id
          	},  
          	include: ['product'],
		  }
		  );
		  
		  for( var z = 0; z < localProducts.length; z++ )
		  {
		  	  localBox.products.push( {
				 title:localProducts[z].product.title,
				 shortTitle:localProducts[z].product.shortDescription,
				 qty: localProducts[z].qty, 
		  	  });
  
		  }
		  
		  _return.push(localBox);
		  
		  
      }
      
      return res.json({ boxs : _return, products: products} ).status(200);
    }
    catch (e) {
      logger.error('🔥 error: %o', e);

      return next(e);
    }
  });               
};