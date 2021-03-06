import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('shipping_address', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        num: DataTypes.STRING,
        street: DataTypes.STRING,
        streetMore: DataTypes.STRING,
        cp: DataTypes.STRING,
        city: DataTypes.STRING,
        concatenation: DataTypes.STRING,
        zipCode: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        userId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'user',
                key: 'id',
            },
        },
    });
};
