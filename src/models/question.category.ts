import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";

export default ( sequelize, type) => {
	const QuestionCategoryModel =  sequelize.define('question_category', {
		id : {
			type 			: DataTypes.INTEGER,
			primaryKey 		: true,
			autoIncrement	: true
		},
		title		: DataTypes.STRING,
		published	: DataTypes.BOOLEAN,
		deleted		: DataTypes.BOOLEAN,
		pictureId	: {
			type	  : DataTypes.INTEGER,
			reference : {
				model	: 'picture',
				key 	: 'id'
			}
		},
		themeId	: {
			type	  : DataTypes.INTEGER,
			reference : {
				model	: 'thematique',
				key 	: 'id'
			}
		}
	});

	// QuestionCategoryModel.associate = function(models) {
	// 	console.info('NOW Associating question category with pic');
	// 	QuestionCategoryModel.belongsTo(models.picture, {foreignKey: 'pictureId', as: 'pictures'});
	// };

	return QuestionCategoryModel;
};