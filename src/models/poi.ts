import { DataTypes } from "sequelize";

export default ( sequelize, type) => {
	const PoiModel = sequelize.define('poi', {
		id : {
			type 			: DataTypes.INTEGER,
			primaryKey 		: true,
			autoIncrement	: true
		},
		name 				:	DataTypes.STRING,
		description	 		:	DataTypes.STRING(1000),
		type 				:	DataTypes.STRING,
		zipCode				:   DataTypes.STRING,
		street				:   DataTypes.STRING,
		city 				:   DataTypes.STRING,
		latitude	 		:	DataTypes.FLOAT,
		longitude	 		:	DataTypes.FLOAT,
		horaires 			: 	DataTypes.STRING(1000),   
		externalNumber 		: 	DataTypes.STRING,    
		active				: 	DataTypes.BOOLEAN,
	});
	return PoiModel;
	
};