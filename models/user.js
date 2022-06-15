var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//conexion con la base de datos
mongoose.connect("mongodb://localhost/fotos");

var posibles_valores = ["M", "F"];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Coloca un email valido"];
var password_validation = {
			validator:function(p){
				return this.password_confirmation == p;
			},
			message: "Las contraseñas no son iguales"
		};

var user_schema = new Schema({
	name: String,
	last_name: String,
	username: {type:String, required:true, maxlength:[50, "Username muy grande"]},
	password: {
		type:String,
		minlength:[8,"El password es muy corto"],
		validate: password_validation
	},
	age: {type:Number, min: [6,"La edad no puede ser menos que 5"], max: [100, "La edad no debe superar los 100"]},
	email:{type: String,required:"El Correo es Obligatorio",match:email_match},
	date_of_birth: Date,
	sex: {type:String, enum:{values: posibles_valores, message: "Opción no válida"} }
	});

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c = password;
});
// en la base de datos se se guarda con users
var User = mongoose.model("User", user_schema); // es el constructor que genera los modelos

/*Tipos de datos que podemos guardar en mongodb
	*String
	*Number
	*Date
	*Buffer
	*Boolean
	*Mixed
	*Objectid
	*Array
*/

module.exports.User = User;