import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        shortDescription: DataTypes.STRING,
        defaultQty: DataTypes.DECIMAL,
        active: DataTypes.BOOLEAN,
        deleted: {
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
    });
};
