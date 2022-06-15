var Imagen = require('../models/imagenes');

module.exports = function(image, solicitud, respuesta){

	//True = tiene permisos
	//false = si no tiene permisos

	if(solicitud.method === "GET" && solicitud.path.indexOf("edit") < 0){
		// Ver la imagen
		return true;
	}

	if (typeof image.creator == "undefined") {return false;}

	if (image.creator._id.toString() == respuesta.locals.user._id) {
		// Esta imagen yo la subi
		return true;
	}


}