import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('user_boxs_resupply_products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userBoxsResupplyId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'user_boxs_resupply',
                key: 'id',
            }, 
        },
        productId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'product',
                key: 'id',
            },
            allowNull: true,
        }, 
        boxId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'box',
                key: 'id',
            },
            allowNull: true,   
        },
        quantity: DataTypes.INTEGER,
    });
};
