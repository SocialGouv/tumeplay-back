import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('product_order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        qty: DataTypes.INTEGER,
        productId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'product',
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
    });
};
