import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    const SoundModel = sequelize.define('sound', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        originalname: DataTypes.STRING,
        encoding: DataTypes.STRING,
        mimetype: DataTypes.STRING,
        destination: DataTypes.STRING,
        filename: DataTypes.STRING,
        path: DataTypes.STRING,
        size: DataTypes.INTEGER,
    });
    return SoundModel;
};
