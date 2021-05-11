import { Container } from 'typedi';

import OrderService from '../services/order';
import MailerService from '../services/mail';
import UserService from '../services/user';
import ColissimoService from '../services/colissimo';

import Config from '../config';
import { Op } from 'sequelize';


async function ordersSummary() {
	const orderServiceInstance = Container.get(OrderService);
    const defaultMailAddress   = 'romain.petiteville@celaneo.com';
    const defaultName 		   = 'Non renseigné';
    const defaultHostname 	   = 'https://tumeplay-api.fabrique.social.gouv.fr';
    
    console.log("Searching orders ...");
    
    const orders 		= await orderServiceInstance.findSummaryOrders();
    
    console.log("Done. Got " + orders.length + " orders to manage.");
    
    const parsedOrders 	= {};
    
    for( const orderIndex in orders )
    {
    	const order = orders[orderIndex];
    	
    	const criterias = {
			where: { 
				roles: { [Op.like]:  '%'+Config.roles.orders_support_metropole+'%' }
			},
			include: [{
		        association: 'poi',
		        where: { id : order.pickup.id }   
		    }]
		};
		
		const supports = await Container.get(UserService).findAll(null, criterias);
		
		const localKey = "poi_" + order.pickup.id;
		const boxKey   = "box_" + order.box.id;
		const contact  = ( supports.length > 0 ? support[0] : '' );
		
		if( typeof parsedOrders[localKey] === "undefined" )
		{
			parsedOrders[localKey] = { boxs : {}, name : ( contact ? contact.name : defaultName ), mail: ( contact ? contact.email : defaultMailAddress ), address : order.pickup, orders : [] };
		}
		
		if( typeof parsedOrders[localKey].boxs[boxKey] === "undefined" )
		{
			parsedOrders[localKey].boxs[boxKey] = { qty : 0, name: order.box.title, id: order.box.id };		
		}
		
		console.log(order.profile);
		
    	parsedOrders[localKey].orders.push({
			id: order.id,
			name: order.profile.surname + " " + order.profile.name,
			box : order.box.title,	
    	});
    	parsedOrders[localKey].boxs[boxKey].qty = parsedOrders[localKey].boxs[boxKey].qty + 1;
    	
    	
    	                                                                                     
    }
    
    const colissimo 	= Container.get(ColissimoService);
	let   labelFiles 	= [];
	for( const orderKey in parsedOrders )
	{
		const parsedOrder = parsedOrders[orderKey];
		const labelFile   = await colissimo.createLabel(
			parsedOrder.address.id + "-" + parsedOrder.name,
			parsedOrder.address.firstName,
			parsedOrder.address.name,
			defaultMailAddress,
			parsedOrder.address 
		);
		
		const labelFilename = parsedOrder.address.id + '-' + parsedOrder.name + ".csv";
		
		labelFiles.push({
			filename: labelFilename,
            path: labelFile,
		});
    	
    	if( parsedOrder.mail )
    	{
    		const variables = { 
    				orders : parsedOrder, 
    				hostname: defaultHostname,
			};
			await Container.get(MailerService).send(parsedOrder.mail, 'Récapitulatif de commandes', 'orders_summary_user', variables);	
    	}
	}
	
    const variables = { 
    		orders : parsedOrders, 
    		hostname: defaultHostname,//req.protocol + '://' + req.get('host'), // I'm a bit nervous using this one. 
    		labelFiles: labelFiles,
	};
    await Container.get(MailerService).send(defaultMailAddress, 'Récapitulatif de commandes', 'orders_summary', variables);
    
    return;    
}

export default ordersSummary;
