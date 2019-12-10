import { DataTypes } from "sequelize";

export default ( sequelize, type) => {
	const ThematiqueModel = sequelize.define('thematique', {
		id : {
			type 			: DataTypes.INTEGER,
			primaryKey 		: true,
			autoIncrement	: true
		},
		title		: 	DataTypes.STRING,
		active		: 	DataTypes.BOOLEAN,
		pictureId	: {
			type	  : DataTypes.INTEGER,
			reference : {
				model	: 'picture',
				key 	: 'id'
			}
		}
	});
	return ThematiqueModel;
};