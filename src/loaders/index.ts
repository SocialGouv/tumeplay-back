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
                name: 'userZoneModel',
                model: models.userZoneModel,
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
            {
                name: 'productStockModel',
                model: models.productStockModel,
            },
            {
                name: 'contactModel',
                model: models.contactModel,
            },
            {
                name: 'feedbackModel',
                model: models.feedbackModel,
            },
            {
                name: 'questionFeedbackModel',
                model: models.questionFeedbackModel,
            },
            {
                name: 'availabilityZoneModel',
                model: models.availabilityZoneModel,
            },
            {
                name: 'contentZoneModel',
                model: models.contentZoneModel,
            },
            {
                name: 'boxZoneModel',
                model: models.boxZoneModel,
            },
            {
                name: 'productZoneModel',
                model: models.productZoneModel,
            },
            {
                name: 'questionZoneModel',
                model: models.questionZoneModel,
            },
            {
                name: 'orderZoneModel',
                model: models.orderZoneModel,
            },
        ],
    });
    Logger.info('✌️ Dependency Injector loaded');

    await expressLoader({ app: expressApp });

    Logger.info('✌️ Express loaded');
};
