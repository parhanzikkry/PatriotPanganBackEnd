var mongoose = require('mongoose');

var KelurahansSchema = mongoose.Schema({
    id_kel:String,
    id_kec:String,
    nama:String,
  id_jenis:String,
});

module.exports = mongoose.model("Kelurahans", KelurahansSchema);