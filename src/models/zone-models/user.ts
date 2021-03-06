import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('user_zone', {
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
    });
};
