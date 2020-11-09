import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('availability_zone', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        enabled: DataTypes.BOOLEAN,
        enableSound: DataTypes.BOOLEAN
    });
};
