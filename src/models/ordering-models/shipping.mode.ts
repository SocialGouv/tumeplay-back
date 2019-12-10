import { DataTypes } from "sequelize";

export default (sequelize, type) => {
	return sequelize.define('shipping_mode', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: DataTypes.STRING
	})
};