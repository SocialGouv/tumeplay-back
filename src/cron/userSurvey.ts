import { Container } from 'typedi';
import OrderService from '../services/order';
import MailerService from '../services/mail';


async function userSurveys() {
	const orderServiceInstance = Container.get(OrderService);
    const mailServiceInstance = Container.get(MailerService);
    
    const orders = await orderServiceInstance.findSurveyAbleOrders();
    
    orders.forEach( async function(item) {
    	const variables = {
			firstName: item.profile.surname,
			email: item.profile.email,
			hostname: 'https://tumeplay-api.fabrique.social.gouv.fr',//req.protocol + '://' + req.get('host'), // I'm a bit nervous using this one.
    	}
    	
    	await mailServiceInstance.send(variables.email, '=?utf-8?Q?On_a_besoin_de_ton_avis_=F0=9F=99=82?=', 'user_survey', variables);
    		
		console.log(variables);
    });
    
    return;    
}

export default userSurveys;
