import { DataTypes } from "sequelize";

export default (sequelize, type) => {
	const QuestionAnswerModel = sequelize.define('question_answer', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: DataTypes.STRING,
		questionContentId	: {
			type	  : DataTypes.INTEGER,
			reference : {
				model	: 'question_content',
				key 	: 'id'
			}
		},
		isCorrect: DataTypes.BOOLEAN,
		published: DataTypes.BOOLEAN
	});

	return QuestionAnswerModel;
};