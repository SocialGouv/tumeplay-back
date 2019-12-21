import {  DataTypes } from "sequelize";

export default (sequelize, type) => {
	return sequelize.define('user', {
		id : {
			type 		  : DataTypes.INTEGER,
			primaryKey 	  : true,
			autoIncrement : true
		},
		name 	 : DataTypes.STRING,
		email	 : DataTypes.STRING,
		roles	 : DataTypes.STRING,
		salt	 : DataTypes.STRING, 
		password : {
			type	  : DataTypes.STRING,
			allowNull : false
		}
		
	})
};