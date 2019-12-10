import { DataTypes } from "sequelize";

export default (sequelize, type) => {
	return sequelize.define('content', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: DataTypes.STRING,
		text: DataTypes.STRING,
		published: DataTypes.BOOLEAN,
		pictureId: {
			type: DataTypes.INTEGER,
			reference: {
				model: 'picture',
				key: 'id'
			}
		}
	})
};