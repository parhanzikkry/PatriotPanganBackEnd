var sequelize = require(__dirname + '/../dbconnection');
var	Admins = sequelize.import(__dirname + '/Admins.model');

module.exports = function(sequelize, DataType) {
	return sequelize.define('artikel', {
                judul: DataType.STRING,
                fk_pembuatid: {
                    type: DataType.INTEGER,
                    references: {
                        model: Admins,
                        key: 'id'
                    }
                },
                tanggalpublish: DataType.DATE,
                sumberarktikel: DataType.STRING,
                isi: DataType.STRING,
                pathfoto: DataType.STRING
	});
}