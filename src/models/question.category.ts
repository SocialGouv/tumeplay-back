import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";

export default ( sequelize, type) => {
	const QuestionCategoryModel =  sequelize.define('question_category', {
		id : {
			type 			: DataTypes.INTEGER,
			primaryKey 		: true,
			autoIncrement	: true
		},
		isDefaultData:	{
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		title				: 	DataTypes.STRING,
		published			: 	{
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		deleted				: 	{
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},		
	});

	return QuestionCategoryModel;
};