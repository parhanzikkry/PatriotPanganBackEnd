var sequelize = require(__dirname + '/../dbconnection');
var Token = require(__dirname + '/Token.controller');
var Summaries = sequelize.import(__dirname + '/../model/Summaries.model');
var Desa = sequelize.import(__dirname + '/../model/rgn_subdistrict.model');
var Kecamatan = sequelize.import(__dirname + '/../model/rgn_district.model');
var moment = require('moment');

Desa.belongsTo(Kecamatan, {foreignKey: 'district_id'});
Summaries.belongsTo(Kecamatan, {foreignKey: 'fk_kecamatanid'});

const Op = sequelize.Op;

class Summarie {
	constructor() {
        this.info;
    } 

    //tanpa request
	AddSummaries(data) { //data dari laporan
		this.info = Token.DecodeToken(req.headers.token);
		console.log('masuk sini', data, this.info)
		Desa
			.findOne({
				where: {
					id: this.info.token.fk_desaid
				}
			})
			.then((desa) => {
				console.log('jancuk', desa);
				Summaries
					.update({
						q1: sequelize.literal('q1 + ' + data.q1),
						q2: sequelize.literal('q2 + ' + data.q2),
						q3: sequelize.literal('q3 + ' + data.q3),
						q4: sequelize.literal('q4 + ' + data.q4),
						q5: sequelize.literal('q5 + ' + data.q5),
						q6: sequelize.literal('q6 + ' + data.q6),
						q7: sequelize.literal('q7 + ' + data.q7)
					},{
						where: {
							[Op.and]: [
								{bulan : data.bulan},
								{tahun : data.tahun},
								{fk_kecamatanid : desa.fk_kecamatanid}
							]
						}
					})
					.then((summary) =>{
						
					})
					.catch((err) =>{
		
					});
			})
			.catch((err) => {

			})
    }

    GetJumlahTarafKec(req, res) {
    	Kecamatan
    		.count()
    		.then((jumlah) =>{
    			Summaries
    				.count({
						group: 'kondisi',
						attributes: ['kondisi']
    				},{
                        where: {
                            [Op.and]: [
                                {bulan : req.body.bulan},
                                {tahun : req.body.tahun}
                            ]
                        }
                    })
    				.then((jumSummary) => {
    					res.json({
								status: true,
    							message : "Berhasil mendapatkan jumlah Kecamatan berdasarkan Taraf",
								data : {
									jumlahTaraf : jumSummary,
									jumlahKecamatan : jumlah 
								}    						
    						})
    				})
    				.catch((err)=>{
    					res.json({
								status: false,
    							message: "Jumlah summary tidak didapatkan",
    							info: err
    						})
    				})
    		})
    		.catch((err) => {
    			res.json({
						status: false,
    					message: "Internal Server Error",
    					info: err
    				})
    		})
    }

    GetSummaries(req, res){
    	Summaries
            .sum({
                where: {
                    [Op.and]: [
                        {bulan : req.params.bulan},
                        {tahun : req.params.tahun}
                    ]
				},
				attributes: [[sequelize.fn('COUNT', sequelize.col('q1')), 'q1']],
				include: [{
					model: Kecamatan
				}]
            })
            .then((summary) => {
                res.json({
						status: true,
                        message: "Berhasil mendapatkan summary pada bulan tertentu",
                        data: summary
                    })
            })
            .catch((err) => {
                res.json({
						status: false,
                        message: "Internal Server Error",
                        info: err
                    })
            });
    }

    GetTotalKecRawanPangan(req, res){
        Summaries.
            count({
                where : {
                    kondisi : {
                        [Op.not] : 0
                    },
                    bulan: moment().month(),
                    tahun: moment().year()
                }
            })
            .then((jumlahKecRawanPangan) => {
                res.json({
                    status: true,
                    message: "Berhasil jumlah kecamatan rawan pangan",
                    data: jumlahKecRawanPangan
                })
            })
            .catch((err) => {
                res.json({
                    status : false,
                    message: "Internal Server Error"
                })
            })
    }
}

module.exports = new Summarie;