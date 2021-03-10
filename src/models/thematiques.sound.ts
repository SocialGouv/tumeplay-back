import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('thematique_sound', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        thematiqueId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'thematique',
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
