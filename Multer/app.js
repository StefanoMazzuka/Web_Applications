"use strict"
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const multerFactory = multer({
    dest: path.join(__dirname, "uploads")
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));
const staticFiles = path.join(__dirname, "public");
app.use(express.static(staticFiles));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(3000, function (err) {
    if (err) console.log(err);
    else console.log("Escuchando");
});

app.get("/", function (request, response) {
    response.status(200);
    response.sendFile(path.join(__dirname, "public", "formulario.html"));
});

app.post("/procesar_formulario.html",
    multerFactory.single("foto"),
    function (request, response) {
        let nombreFichero = null;
        if (request.file) {
            nombreFichero = request.file.filename;
        }
        response.render("datosFormulario", {
            nombre: request.body.nombre,
            apellidos: request.body.apellidos,
            fumador: request.body.fumador === "si" ? "Sí" : "No",
            imagen: nombreFichero
        });
    });

app.get("/imagen/:id", function (request, response) {
    let pathImg = path.join(__dirname, "uploads", request.params.id);
    response.sendFile(pathImg);
});