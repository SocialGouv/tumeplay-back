import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('user_boxs_resupply', {
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
        
        name: DataTypes.STRING,
        firstName: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        mailAddress: DataTypes.STRING,
        street: DataTypes.STRING,
        streetMore: DataTypes.STRING,
        country: DataTypes.STRING,
        zipCode: DataTypes.STRING,
        city: DataTypes.STRING,
        
        delivered: DataTypes.BOOLEAN,
        amount: DataTypes.INTEGER,
    });
};
