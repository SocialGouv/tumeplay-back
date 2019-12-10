var Sequelize = require('sequelize');
import UserModel from '../models/user';
import ContentModel from '../models/content';
import QuestionContentModel from '../models/question.content';
import QuestionCategoryModel from '../models/question.category';
import ThematiqueModel from '../models/thematiques';
import PictureModel from '../models/picture';
import ProfileModel from '../models/profile';
import QuestionAnswerModel from '../models/question.answer';
import ShippingAddressModel from '../models/ordering-models/shipping.address';
import ProductModel from '../models/product';
import ShippingModeModel from '../models/ordering-models/shipping.mode';
import OrderModel from '../models/ordering-models/order';
import ProductOrderModel from '../models/ordering-models/product.order';

import config from '../config';

export default async () => {

	const sequelize = new Sequelize(
		config.databaseName,
		config.databaseLogin,
		config.databasePassword,
		{
			host: config.databaseHost,
			dialect: 'postgres'
		}
	);

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

	// Setup of relationships
	Content.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });

	questionCategory.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });
	questionCategory.belongsTo(Thematique, { foreignKey: 'themeId', as: 'itsTheme' });

	QuestionContent.belongsTo(questionCategory, { foreignKey: 'categoryId', as: 'itsQuestionCategory' });
	QuestionContent.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });

	Thematique.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });

	Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

	User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });

	ShippingAddress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

	Product.belongsTo(Picture, { foreignKey: 'pictureId', as: 'picture' });

	Order.belongsTo(ShippingMode, { foreignKey: 'shippingModeId', as: 'shippingMode' });
	Order.belongsTo(ShippingAddress, { foreignKey: 'shippingAddressId', as: 'shippingAddress' });
	Order.belongsTo(Profile, { foreignKey: 'profileId', as: 'profile' });
	Order.belongsToMany(Product, {
		through: ProductOrder,
		as: 'products',
		foreignKey: 'orderId'
	});

	ProductOrder.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
	ProductOrder.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
	
	// -----------------------------

	sequelize.sync().then(() => {
	});

	module.exports = User;
	module.exports = Profile;
	module.exports = ShippingAddress
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

	return {
		userModel: User,
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
		productOrderModel: ProductOrder
	};
}