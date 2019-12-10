import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import postgreLoader from './postgresql';
import Logger from './logger';
import { IUserInputDTO } from '../interfaces/IUser';
import AuthService from '../services/auth';
import UserService from '../services/user';
import { Container } from 'typedi';
//We have to import at least all the events once so they can be triggered
import './events';

export default async ({ expressApp }) => {

	const models = await postgreLoader();

	Logger.info('✌️ DB loaded and connected!');
	/*models.contentModel.create({
		content: 'Ceci est un contenu',
		published: true 
	});*/


	const { agenda } = await dependencyInjectorLoader({
		models: [
			{
				name: 'userModel',
				model: models.userModel,
			},
			{
				name: 'contentModel',
				model: models.contentModel
			},
			{
				name: 'questionModel',
				model: models.questionModel
			},
			{
				name: 'questionCategoryModel',
				model: models.questionCategoryModel
			},
			{
				name: 'thematiqueModel',
				model: models.thematiqueModel
			},
			{
				name: 'pictureModel',
				model: models.pictureModel
			},
			{
				name: 'questionAnswerModel',
				model: models.questionAnswerModel
			},
			{
				name: 'profileModel',
				model: models.profileModel
			},
			{
				name: 'shippingAddressModel',
				model: models.shippingAddressModel
			},
			{
				name: 'productModel',
				model: models.productModel
			},
			{
				name: 'shippingModeModel',
				model: models.shippingModeModel
			},
			{
				name: 'orderModel',
				model: models.orderModel
			},
			{
				name: 'productOrderModel',
				model: models.productOrderModel
			}
		],
	});
	Logger.info('✌️ Dependency Injector loaded');

	//   initial User setup
	const initialUser: IUserInputDTO = {
		name: 'myadmin',
		email: 'test@test.com',
		password: 'celaneo'
	};

	try {
		// Checking if user already in the db
		const userServiceInstance = Container.get(UserService);
		const result_findUsers_byEmail = await userServiceInstance.findByEmail(initialUser.email);
		if (result_findUsers_byEmail.userRecords.length !== 0) {
			console.warn('User already exists, length', result_findUsers_byEmail.userRecords.length);
		} else {
			// create only when the user does not already exist: 
			console.info('This is a new user. So now creating...');
			const authServiceInstance = Container.get(AuthService);
			const { user, token } = await authServiceInstance.create(initialUser);
			console.info(`created user: ${JSON.stringify(user)}`);

		}
	}
	catch (e) {
		console.error(e);
	}
	await expressLoader({ app: expressApp });

	Logger.info('✌️ Express loaded');
};