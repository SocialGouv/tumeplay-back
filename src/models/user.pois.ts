import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('user_poi', {
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
        poiId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'poi',
                key: 'id',
            },
        },                       
    });
};
