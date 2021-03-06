import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('content_sound', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        contentId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'content',
                key: 'id',
            },
        },
        soundId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'sound',
                key: 'id',
            },
        },
    });
};
