import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('profile', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        surname: DataTypes.STRING, // nom
        name: DataTypes.STRING, // prenom
        email: DataTypes.STRING,
        userId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'user',
                key: 'id',
            },
        },
    });
};
