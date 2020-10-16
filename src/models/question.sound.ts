import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('question_sound', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        questionId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'question_content',
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
