import {DataTypes} from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('question_feedback', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        questionContentId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'question_content',
                key: 'id',
            },
        },
        feedbackId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'feedback',
                key: 'id',
            },
        },
        isLiked: DataTypes.BOOLEAN,
        isDisliked: DataTypes.BOOLEAN,
        comment: DataTypes.STRING,
    });
};
