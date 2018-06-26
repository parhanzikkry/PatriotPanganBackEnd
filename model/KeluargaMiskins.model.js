var sequelize = require(__dirname + '/../dbconnection');
var Patriots = sequelize.import(__dirname + '/Patriots.model');
var Subdistrict = sequelize.import(__dirname + '/rgn_subdistrict.model');

module.exports = function(sequelize, DataType) {
	return sequelize.define('keluargamiskin', {
        namakeluarga: DataType.STRING,
        fk_desaid: {
                type: DataType.INTEGER,
                references: {
                        model: Subdistrict,
                        key: 'id'
                }
        },
        alamat: DataType.STRING,
        pathfoto: DataType.STRING,
        fk_patriotid: {
                type: DataType.INTEGER,
                references: {
                        model: Patriots,
                        key: 'id'
                }
        },
        mingguterakhirmelaporkan: {
                type: DataType,
                allowNull: true
        },
        status: DataType.STRING
	});
}