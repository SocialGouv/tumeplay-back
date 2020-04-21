import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('content', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: DataTypes.STRING,
        text: DataTypes.STRING(1000),
        link: DataTypes.STRING(1000),
        published: DataTypes.INTEGER,
        pictureId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'picture',
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
    });
};
