import { DataTypes } from 'sequelize';


export default (sequelize, type) => {
    return sequelize.define('feedback', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: DataTypes.STRING,

    });
};
