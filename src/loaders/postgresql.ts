var Sequelize = require('sequelize');
import UserModel from '../models/user';
import ContentModel from '../models/content';
import ContactModel from '../models/contact';
import QuestionContentModel from '../models/question.content';
import QuestionCategoryModel from '../models/question.category';
import ThematiqueModel from '../models/thematiques';
import PictureModel from '../models/picture';
import ProfileModel from '../models/profile';
import QuestionAnswerModel from '../models/question.answer';
import ShippingAddressModel from '../models/ordering-models/shipping.address';
import ProductModel from '../models/product';
import ProductStockModel from '../models/product.stock';
import ShippingModeModel from '../models/ordering-models/shipping.mode';
import OrderModel from '../models/ordering-models/order';
import ProductOrderModel from '../models/ordering-models/product.order';
import FeedbackModel from '../models/feedback';
import QuestionFeedbackModel from '../models/question.feedback';

import AvailabilityZoneModel from '../models/availability.zone';
import ContentZoneModel from '../models/zone-models/content';
import BoxZoneModel from '../models/zone-models/box';
import OrderZoneModel from '../models/zone-models/order';
import ProductZoneModel from '../models/zone-models/product';
import UserZoneModel from '../models/zone-models/user';
import QuestionZoneModel from '../models/zone-models/quiz';


import BoxModel from '../models/box';
import BoxProductModel from '../models/box.products';

import PoiModel from '../models/poi';

import config from '../config';
import { Container } from 'typedi';
import SyncDefaultData from '../services/synchronizer/sync-default-data';

export default async () => {
    const sequelize = new Sequelize(config.databaseName, config.databaseLogin, config.databasePassword, {
        host: config.databaseHost,
        dialect: 'postgres',
        logging: false,
    });

    const Contact = ContactModel(sequelize, Sequelize);
    const User = UserModel(sequelize, Sequelize);
    const Profile = ProfileModel(sequelize, Sequelize);
    const ShippingAddress = ShippingAddressModel(sequelize, Sequelize);
    const Content = ContentModel(sequelize, Sequelize);
    const QuestionContent = QuestionContentModel(sequelize, Sequelize);
    const questionCategory = QuestionCategoryModel(sequelize, Sequelize);
    const Thematique = ThematiqueModel(sequelize, Sequelize);
    const Picture = PictureModel(sequelize, Sequelize);
    const QuestionAnswer = QuestionAnswerModel(sequelize, Sequelize);
    const Product = ProductModel(sequelize, Sequelize);
    const ShippingMode = ShippingModeModel(sequelize, Sequelize);
    const Order = OrderModel(sequelize, Sequelize);
    const ProductOrder = ProductOrderModel(sequelize, Sequelize);
    const ProductStock = ProductStockModel(sequelize, Sequelize);
    
    const AvailabilityZone = AvailabilityZoneModel(sequelize, Sequelize);
    const ContentZone = ContentZoneModel(sequelize, Sequelize);
    const BoxZone = BoxZoneModel(sequelize, Sequelize);
    const OrderZone = OrderZoneModel(sequelize, Sequelize);
    const ProductZone = ProductZoneModel(sequelize, Sequelize);
    const UserZone = UserZoneModel(sequelize, Sequelize);
    const QuestionZone = QuestionZoneModel(sequelize, Sequelize);

    const Box = BoxModel(sequelize, Sequelize);
    const BoxProducts = BoxProductModel(sequelize, Sequelize);

    const Poi = PoiModel(sequelize, Sequelize);
    const Feedback = FeedbackModel(sequelize, Sequelize);
    const QuestionFeedback = QuestionFeedbackModel(sequelize, Sequelize);


    // Setup of relationships
    Content.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });
    Content.belongsTo(Thematique, { foreignKey: 'themeId', as: 'itsTheme' });
    Content.belongsTo(questionCategory, { foreignKey: 'categoryId', as: 'itsQuestionCategory' });
    Content.belongsTo(QuestionContent, { foreignKey: 'questionId', as: 'itsQuestionContent' });

    questionCategory.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });
    questionCategory.belongsTo(Thematique, { foreignKey: 'themeId', as: 'itsTheme' });

    QuestionContent.belongsTo(questionCategory, { foreignKey: 'categoryId', as: 'itsQuestionCategory' });
    QuestionContent.belongsTo(Thematique, { foreignKey: 'themeId', as: 'itsTheme' });

    QuestionContent.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });

    Thematique.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });

    Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });

    ShippingAddress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    Product.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });

    Order.belongsTo(Box, { foreignKey: 'boxId', as: 'box' });
    Order.belongsTo(ShippingMode, { foreignKey: 'shippingModeId', as: 'shippingMode' });
    Order.belongsTo(ShippingAddress, { foreignKey: 'shippingAddressId', as: 'shippingAddress' });
    Order.belongsTo(Profile, { foreignKey: 'profileId', as: 'profile' });
    Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Order.belongsTo(Poi, { foreignKey: 'pickupId', as: 'pickup' });

    Order.belongsToMany(Product, {
        through: ProductOrder,
        as: 'products',
        foreignKey: 'orderId',
    });

    ProductOrder.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    ProductOrder.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

    Box.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });
    BoxProducts.belongsTo(Box, { foreignKey: 'boxId', as: 'box' });
    BoxProducts.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    // -----------------------------

    ProductStock.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    QuestionFeedback.belongsTo(QuestionContent, { foreignKey: 'questionContentId', as: 'question' });
    QuestionFeedback.belongsTo(Feedback, { foreignKey: 'feedbackId', as: 'feedback' });

    Content.belongsToMany(AvailabilityZone, {
        through: ContentZone,
        as: 'availability_zone',
        foreignKey: 'contentId',
    });
    ContentZone.belongsTo(Content, { foreignKey: 'contentId', as: 'content' });
    ContentZone.belongsTo(AvailabilityZone, { foreignKey: 'availabilityZoneId', as: 'zone' });

    Box.belongsToMany(AvailabilityZone, {
        through: BoxZone,
        as: 'availability_zone',
        foreignKey: 'boxId',
    });
    BoxZone.belongsTo(Box, { foreignKey: 'boxId', as: 'box' });
    BoxZone.belongsTo(AvailabilityZone, { foreignKey: 'availabilityZoneId', as: 'zone' });

    Order.belongsToMany(AvailabilityZone, {
        through: OrderZone,
        as: 'availability_zone',
        foreignKey: 'orderId',
    });
    OrderZone.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
    OrderZone.belongsTo(AvailabilityZone, { foreignKey: 'availabilityZoneId', as: 'zone' });

    Product.belongsToMany(AvailabilityZone, {
        through: ProductZone,
        as: 'availability_zone',
        foreignKey: 'productId',
    });
    ProductZone.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    ProductZone.belongsTo(AvailabilityZone, { foreignKey: 'availabilityZoneId', as: 'zone' });

    User.belongsToMany(AvailabilityZone, {
        through: UserZone,
        as: 'availability_zone',
        foreignKey: 'userId',
    });

    UserZone.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    UserZone.belongsTo(AvailabilityZone, { foreignKey: 'availabilityZoneId', as: 'zone' });

    QuestionContent.belongsToMany(AvailabilityZone, {
        through: QuestionZone,
        as: 'availability_zone',
        foreignKey: 'questionContentId',
    });

    QuestionZone.belongsTo(QuestionContent, { foreignKey: 'questionContentId', as: 'questionContent' });
    QuestionZone.belongsTo(AvailabilityZone, { foreignKey: 'availabilityZoneId', as: 'zone' });

    const dbForce = {};
    if (config.databaseForce && config.databaseForce === 1) {
        dbForce.force = true;
    }

    sequelize.sync(dbForce).then(async () => {
        let syncDefaultData = Container.get(SyncDefaultData);
        await syncDefaultData.createInitAdmin();
    });
                                 
    module.exports = User;
    module.exports = UserZone;
    module.exports = Profile;
    module.exports = ShippingAddress;
    module.exports = Content;
    module.exports = QuestionContent;
    module.exports = questionCategory;
    module.exports = Thematique;
    module.exports = Picture;
    module.exports = QuestionAnswer;
    module.exports = Product;
    module.exports = ShippingMode;
    module.exports = Order;
    module.exports = ProductOrder;
    module.exports = Box;
    module.exports = BoxProducts;
    module.exports = Poi;
    module.exports = ProductStock;
    module.exports = Contact;
    module.exports = Feedback;
    module.exports = QuestionFeedback;
    module.exports = AvailabilityZone;
    module.exports = ContentZone;
    module.exports = BoxZone;
    module.exports = OrderZone;
    module.exports = ProductZone;
    module.exports = QuestionZone;


    return {
        userModel: User,
        userZoneModel: UserZone,
        profileModel: Profile,
        shippingAddressModel: ShippingAddress,
        contentModel: Content,
        questionModel: QuestionContent,
        questionCategoryModel: questionCategory,
        thematiqueModel: Thematique,
        pictureModel: Picture,
        questionAnswerModel: QuestionAnswer,
        productModel: Product,
        shippingModeModel: ShippingMode,
        orderModel: Order,
        productOrderModel: ProductOrder,
        productStockModel: ProductStock,
        boxModel: Box,
        boxProductModel: BoxProducts,
        poiModel: Poi,
        contactModel: Contact,
        feedbackModel: Feedback,
        questionFeedbackModel: QuestionFeedback,
        availabilityZoneModel: AvailabilityZone,
        contentZoneModel: ContentZone,
        boxZoneModel: BoxZone,
        orderZoneModel: OrderZone,
        productZoneModel: ProductZone,
        questionZoneModel: QuestionZone,
    };
};
