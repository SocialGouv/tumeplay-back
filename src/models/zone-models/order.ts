import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('order_zone', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
