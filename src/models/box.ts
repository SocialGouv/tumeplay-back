import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('box', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        shortDescription: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        active: DataTypes.BOOLEAN,
        available: {
	        type: DataTypes.BOOLEAN,
	        allowNull: false,
	        defaultValue: true,
	    },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        pictureId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'picture',
                key: 'id',
            },
        },
    });
};
