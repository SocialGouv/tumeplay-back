import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import postgreLoader from './postgresql';
import Logger from './logger';
//We have to import at least all the events once so they can be triggered
import './events';

export default async ({ expressApp }) => {
    const models = await postgreLoader();

    Logger.info('✌️ DB loaded and connected!');

    const { agenda } = await dependencyInjectorLoader({
        models: [
            {
                name: 'userModel',
                model: models.userModel,
            },
            {
                name: 'contentModel',
                model: models.contentModel,
            },
            {
                name: 'questionModel',
                model: models.questionModel,
            },
            {
                name: 'questionCategoryModel',
                model: models.questionCategoryModel,
            },
            {
                name: 'thematiqueModel',
                model: models.thematiqueModel,
            },
            {
                name: 'pictureModel',
                model: models.pictureModel,
            },
            {
                name: 'questionAnswerModel',
                model: models.questionAnswerModel,
            },
            {
                name: 'profileModel',
                model: models.profileModel,
            },
            {
                name: 'shippingAddressModel',
                model: models.shippingAddressModel,
            },
            {
                name: 'productModel',
                model: models.productModel,
            },
            {
                name: 'shippingModeModel',
                model: models.shippingModeModel,
            },
            {
                name: 'orderModel',
                model: models.orderModel,
            },
            {
                name: 'productOrderModel',
                model: models.productOrderModel,
            },
            {
                name: 'boxModel',
                model: models.boxModel,
            },
            {
                name: 'boxProductModel',
                model: models.boxProductModel,
            },
            {
                name: 'poiModel',
                model: models.poiModel,
            },
        ],
    });
    Logger.info('✌️ Dependency Injector loaded');

    await expressLoader({ app: expressApp });

    Logger.info('✌️ Express loaded');
};
