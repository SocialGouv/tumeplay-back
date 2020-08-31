import { DataTypes } from 'sequelize';

export default (sequelize, type) => {
    return sequelize.define('box_zone', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        boxId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'box',
                key: 'id',
            },
        },
    });
};
