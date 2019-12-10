import { DataTypes } from "sequelize";

export default (sequelize, type) => {
	return sequelize.define('order', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: DataTypes.STRING,
		orderDate: DataTypes.DATE,
		sent: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		delivered: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		shippingModeId: {
			type: DataTypes.INTEGER,
			reference: {
				model: 'shipping_mode',
				key: 'id'
			}
		},
		shippingAddressId: {
			type: DataTypes.INTEGER,
			reference: {
				model: 'shipping_address',
				key: 'id'
			}
		},
		profileId: {
			type: DataTypes.INTEGER,
			reference: {
				model: 'profile',
				key: 'id'
			}
		}
	})
};