import md5 from 'md5';
import { Container } from 'typedi';
import ProductModel from '../models/product';
import ProductStockModel from '../models/product.stock';

async function recordStocks() {
	const productModel = Container.get('productModel');
    const products  = await productModel.findAll();
    const productStockModel = Container.get('productStockModel'); 
    const today 	= new Date();
    
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0, 0);
    
    for( let i = 0; i < products.length; i++ )
    {
		const product = products[i];
		
		if( isNaN(product.stock) )
		{
			continue;
		}
		
		let productStock = await productStockModel.findOne({
			where: {
				productId: product.id,
				stockDate: today,
			},
		});
		
		if( !productStock )
		{
			productStock = {
				stockDate: today,
				productId: product.id,
				stock: product.stock,
			};
			
			await productStockModel.create(productStock);
		}
		else
		{
			await productStock.update({ stock: product.stock });
		}
    }
}

export default recordStocks;
