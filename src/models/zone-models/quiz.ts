import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('question_zone', {
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
    });
};
