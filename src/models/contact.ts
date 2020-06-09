import { DataTypes } from 'sequelize';


export default (sequelize, type) => {
    return sequelize.define('contact', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        surname: DataTypes.STRING,
        name: DataTypes.STRING, 
        email: DataTypes.STRING,
        zipCode: DataTypes.STRING
    });
};
