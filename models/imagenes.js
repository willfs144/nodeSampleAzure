var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var img_schem = new Schema({
	title:{type:String, require: true},
	creator:{type: Schema.Types.ObjectId, ref: "User"},
	extension:{type:String, required:true}
});

var Imagen = mongoose.model("Imagen", img_schem);

module.exports = Imagen; 