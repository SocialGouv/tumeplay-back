import { DataTypes } from "sequelize";

export default ( sequelize, type) => {
	const QuestionContent = sequelize.define('question_content', {
		id : {
			type 			: DataTypes.INTEGER,
			primaryKey 		: true,
			autoIncrement	: true
		},
		title		: DataTypes.STRING,
		answerText	: DataTypes.STRING,
		content 	: DataTypes.STRING,
		parentId	: {
			type 	  : DataTypes.INTEGER,
			reference : {
				model	: 'question_content',
				key		: 'id',
			}
		},
		categoryId	: {
			type	  : DataTypes.INTEGER,
			reference : {
				model	: 'question_category',
				key 	: 'id'
			}
		},
		pictureId	: {
			type	  : DataTypes.INTEGER,
			reference : {
				model	: 'picture',
				key 	: 'id'
			}
		},
		published	: DataTypes.BOOLEAN
	});
	
	QuestionContent.hasOne(QuestionContent);

	return QuestionContent;
};