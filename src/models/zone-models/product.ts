import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('product_zone', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
