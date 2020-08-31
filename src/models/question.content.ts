import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    const QuestionContent = sequelize.define('question_content', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        isDefaultData: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        title: DataTypes.STRING,
        defaultPicturePathForMob: DataTypes.STRING,
        defaultPicturePath: DataTypes.STRING,
        answerText: DataTypes.STRING(2000), // increased max length of answer to 2k
        content: DataTypes.STRING,
        parentId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'question_content',
                key: 'id',
            },
        },
        themeId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'thematique',
                key: 'id',
            },
        },
        categoryId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'question_category',
                key: 'id',
            },
        },
        pictureId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'picture',
                key: 'id',
            },
        },
        published: DataTypes.BOOLEAN,
        reaction: DataTypes.STRING,

    });

    QuestionContent.hasOne(QuestionContent);

    return QuestionContent;
};
