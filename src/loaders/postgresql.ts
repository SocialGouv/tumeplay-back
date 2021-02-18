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

import UserStockModel from '../models/user.stocks'
import UserOrderModel from '../models/user.orders';
import UserPoiModel from '../models/user.pois';
import UserOrderStockModel from '../models/user.orders.stocks';

import BoxModel from '../models/box';
import BoxProductModel from '../models/box.products';

import PoiModel from '../models/poi';

import SoundModel from '../models/sound';
import QuestionSoundModel from '../models/question.sound';
import ContentSoundModel from '../models/content.sound';
import ThematiqueSoundModel from '../models/thematiques.sound';

import config from '../config';
import { Container } from 'typedi';
import SyncDefaultData from '../services/synchronizer/sync-default-data';

export default async () => {
    const sequelize = new Sequelize(config.databaseName, config.databaseLogin, config.databasePassword, {
        host: config.databaseHost,
        dialect: 'postgres',
        logging: false,
		dialectOptions: {
			ssl: true
		}
    });

    const Contact = ContactModel(sequelize, Sequelize);
    const User = UserModel(sequelize, Sequelize);
    const Profile = ProfileModel(sequelize, Sequelize);
    const ShippingAddress = ShippingAddressModel(sequelize, Sequelize);
    const Content = ContentModel(sequelize, Sequelize);
    const QuestionContent = QuestionContentModel(sequelize, Sequelize);
    const QuestionCategory = QuestionCategoryModel(sequelize, Sequelize);
    const Thematique = ThematiqueModel(sequelize, Sequelize);
    const Picture = PictureModel(sequelize, Sequelize);
    const Sound = SoundModel(sequelize, Sequelize);
    
    const QuestionSound = QuestionSoundModel(sequelize, Sequelize);
    const ContentSound = ContentSoundModel(sequelize, Sequelize);
    const ThematiqueSound = ThematiqueSoundModel(sequelize, Sequelize);
    
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

    const UserStock = UserStockModel(sequelize, Sequelize);
    const UserOrder = UserOrderModel(sequelize, Sequelize);
    const UserOrderStock = UserOrderStockModel(sequelize, Sequelize);
    const UserPoi = UserPoiModel(sequelize, Sequelize);

    // Setup of relationships
    Content.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });
    Content.belongsTo(Thematique, { foreignKey: 'themeId', as: 'itsTheme' });
    Content.belongsTo(QuestionCategory, { foreignKey: 'categoryId', as: 'itsQuestionCategory' });
    Content.belongsTo(QuestionContent, { foreignKey: 'questionId', as: 'itsQuestionContent' });

    Content.belongsToMany(Sound, {
        through: ContentSound,
        as: 'sounds',
        foreignKey: 'contentId',
    }); 
    
    ContentSound.belongsTo(Content, { foreignKey: 'contentId', as: 'content' });
    ContentSound.belongsTo(Sound, { foreignKey: 'soundId', as: 'sound' });                      
    
    QuestionCategory.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });
    QuestionCategory.belongsTo(Thematique, { foreignKey: 'themeId', as: 'itsTheme' });

    QuestionContent.belongsTo(QuestionCategory, { foreignKey: 'categoryId', as: 'itsQuestionCategory' });
    QuestionContent.belongsTo(Thematique, { foreignKey: 'themeId', as: 'itsTheme' });

    QuestionContent.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });
    
    QuestionContent.belongsToMany(Sound, {
        through: QuestionSound,
        as: 'sounds',
        foreignKey: 'questionId',
    });
    
    QuestionSound.belongsTo(QuestionContent, { foreignKey: 'questionId', as: 'question' });
    QuestionSound.belongsTo(Sound, { foreignKey: 'soundId', as: 'sound' });
    
    Thematique.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });
    Thematique.belongsToMany(Sound, {
        through: ThematiqueSound,
        as: 'sounds',
        foreignKey: 'thematiqueId',
    });
    
    ThematiqueSound.belongsTo(Thematique, { foreignKey: 'thematiqueId', as: 'thematique' });
    ThematiqueSound.belongsTo(Sound, { foreignKey: 'soundId', as: 'sound' });                      
    
    Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });

    ShippingAddress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    Product.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });

    Poi.belongsTo(AvailabilityZone, { foreignKey: 'availabilityZoneId', as: 'availability_zone' });
    
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
    
    UserStock.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    UserStock.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    UserOrder.belongsTo(User, { foreignKey: 'userId', as: 'user'}); 
    UserOrder.belongsTo(Box, { foreignKey: 'boxId', as: 'box'});
    UserOrder.belongsTo(Order, { foreignKey: 'orderId', as: 'order'});
    
    UserOrderStock.belongsTo(User, { foreignKey: 'userId', as: 'user'});
    UserOrderStock.belongsTo(UserOrder, { foreignKey: 'orderId', as: 'order'});
    UserOrderStock.belongsTo(Product, { foreignKey: 'productId', as: 'product'});
    
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
    
        
    UserPoi.belongsTo(Poi, { foreignKey: 'poiId', as: 'poi' });
    UserPoi.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    
    User.belongsToMany(Poi, {
        through: UserPoi,
        as: 'poi',
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
                     
    Sound.belongsTo(AvailabilityZone, { foreignKey: 'availabilityZoneId', as: 'zone' });

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
    module.exports = UserStock;
    module.exports = UserOrder;
    module.exports = UserPoi;
    module.exports = UserOrderStock;
    module.exports = Profile;
    module.exports = ShippingAddress;
    module.exports = Content;
    module.exports = QuestionContent;
    module.exports = QuestionCategory;
    module.exports = Thematique;
    module.exports = ThematiqueSound;
    module.exports = Picture;
    module.exports = Sound;
    module.exports = ContentSound;
    module.exports = QuestionSound;
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
        userStockModel: UserStock,
        userOrderModel: UserOrder,
        userPoiModel: UserPoi,
        userOrderStockModel: UserOrderStock,
        profileModel: Profile,
        shippingAddressModel: ShippingAddress,
        contentModel: Content,
        questionModel: QuestionContent,
        questionCategoryModel: QuestionCategory,
        thematiqueModel: Thematique,
        thematiqueSoundModel: ThematiqueSound,
        pictureModel: Picture,
        soundModel: Sound,
        contentSoundModel: ContentSound,
        questionSoundModel: QuestionSound,
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
