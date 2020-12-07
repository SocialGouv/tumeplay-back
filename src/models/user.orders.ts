import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('user_order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'user',
                key: 'id',
            },
        },
        orderId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'order',
                key: 'id',
            },
        },
        boxId: {
			type: DataTypes.INTEGER,
            reference: {
                model: 'box',
                key: 'id',
            },
            allowNull: true,   
        },
        age: DataTypes.STRING,
        sexe: DataTypes.STRING,
        scolarity: DataTypes.STRING,
        house: DataTypes.STRING,
        comment: DataTypes.STRING(1000),
        
    });
};
