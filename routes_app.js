var express = require("express");
var Imagen = require("./models/imagenes");
var router = express.Router();//administra las rutas
var fs = require("fs");
var redis = require('redis');

var client = redis.createClient();

var image_finder_middleware = require("./middlewares/find_image");


router.get("/", function(solicitud, respuesta){
	Imagen.find({})
		.populate("creator")
		.exec(function(error, imagenes){
			if (error)
				console.log(error);
			respuesta.render("app/home", {imagenes: imagenes});
		})
	
});

/* REST */

//muestra formulario para agregar
router.get("/imagenes/new", function(solicitud,respuesta){
	respuesta.render("app/imagenes/new");

});

router.all("/imagenes/:id*", image_finder_middleware);

// muestra formulario para editar
router.get("/imagenes/:id/edit", function(solicitud,respuesta){
	respuesta.render("app/imagenes/edit");
});


router.route("/imagenes/:id")
	//mostrar o tomar
	.get(function(solicitud, respuesta){
		client.publish("images", respuesta.locals.imagen.toString());
		respuesta.render("app/imagenes/show");		
	})
	//actualizar 
	.put(function(solicitud, respuesta){
		respuesta.locals.imagen.title = solicitud.body.title;
			respuesta.locals.imagen.save(function(error){
				if(!error){
					respuesta.render("app/imagenes/show");
				}else{
					respuesta.render("app/imagenes/"+solicitud.params.id+"/edit");
				}
			});
			respuesta.render("app/imagenes/show");
		
	})
	//eliminar foto
	.delete(function(solicitud,respuesta){

		Imagen.findOneAndRemove({_id: solicitud.params.id}, function(error){
				if (!error) {
					respuesta.redirect("/app/imagenes");
				}else{
					console.log(error);
					respuesta.redirect("/app/imagenes"+solicitud.params.id);
				}
		});
	});

router.route("/imagenes")
	//mostrar o tomar
	.get(function(solicitud, respuesta){
		Imagen.find({creator: respuesta.locals.user._id},function(error, imagenes){
			if (error){respuesta.render("/app");return;}
			respuesta.render("app/imagenes/index", {imagenes:imagenes});
		});
	})
	//crear una nueva imagen 
	.post(function(solicitud, respuesta){
		//console.log(solicitud.body.archivo);
		var extension = solicitud.body.archivo.name.split(".").pop();
		var data = {
			title: solicitud.body.title,// identificados por name
			creator: respuesta.locals.user._id,
			extension: extension	
		}

		var imagen = new Imagen(data); // es un objeto de traido de imagenes.js 

		imagen.save(function(error){
			if(!error){
				var imgJSON = {
					"id": imagen._id,
					"title": imagen.title,
					"extension": imagen.extension
				};

				client.publish("images",JSON.stringify(imgJSON));
				fs.rename(solicitud.body.archivo.path, "public/imagenes/"+imagen._id+"."+extension)
				respuesta.redirect("/app/imagenes/"+imagen._id)
			}
			else{
				console.log(imagen);
				respuesta.render(error);
			}
		});
		
	})
	



module.exports = router;