
/*
ALTER TABLE "user_orders" ADD "city" character varying(255) NULL;
ALTER TABLE "user_orders" ADD "localBox" character varying(255) NULL;
ALTER TABLE "user_orders" ADD "firstBox" character varying(255) NULL;
ALTER TABLE "user_orders" ADD "lastBox" character varying(255) NULL;
ALTER TABLE "user_orders" ADD "custom" character varying(255) NULL;
*/
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
        city: DataTypes.STRING,
        house: DataTypes.STRING,
        scolarity: DataTypes.STRING,
        localBox: DataTypes.STRING,
        firstBox: DataTypes.STRING,
        lastBox: DataTypes.STRING,
        custom: DataTypes.STRING,
        comment: DataTypes.STRING(1000),
        
    });
};
