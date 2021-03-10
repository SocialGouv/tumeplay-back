import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('user_orders_stock', {
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
                model: 'user_order',
                key: 'id',
            },
        },
        productId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'product',
                key: 'id',
            },
        },        
        amount: DataTypes.INTEGER,
    });
};
