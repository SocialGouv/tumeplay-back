import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    const ThematiqueModel = sequelize.define('thematique', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        isSpecial: {
	        type: DataTypes.BOOLEAN,
	        allowNull: false,
	        defaultValue: false,
	    },
        pictureId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'picture',
                key: 'id',
            },
        },
        isDefaultData: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    });
    return ThematiqueModel;
};
