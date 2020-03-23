import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('product_stock', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        stockDate: DataTypes.DATE,
        stock: DataTypes.INTEGER,
        productId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'product',
                key: 'id',
            },
        },
        
    });
};
