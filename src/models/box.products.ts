import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('box_products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        qty: DataTypes.DECIMAL,
        boxId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'box',
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
    });
};
