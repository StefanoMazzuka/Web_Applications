"use strict";
const path = require("path");
const express = require("express");
const app = express();
const staticFiles = path.join(__dirname, "public");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

const mysql = require("mysql");
const config = require("./config");
const pool = mysql.createPool(config.mysqlConfig);
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

function flashMiddleware(request, response, next) {
    response.setFlash = function (msg) {
        request.session.flashMsg = msg;
    };
    response.locals.getAndClearFlash = function () {
        let msg = request.session.flashMsg;
        delete request.session.flashMsg;
        return msg;
    };
    next();
};

app.use(express.static(staticFiles));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator());
app.use(flashMiddleware);

app.listen(3000, function (err) {
    if (err) console.log(err);
    else console.log("Escuchando puerto 3000");
});

app.get("/", function (request, response) {
    response.status(200);
    response.render("index", {
        errores: []
    });
});

app.post("/procesar_formulario", function (request, response) {
    request.checkBody("login",
        "Nombre de usuario vacío").notEmpty();
    request.checkBody("login",
        "Nombre de usuario no válido").matches(/^[A-Z0-9]+$/i);
    request.checkBody("pass",
        "La contraseña no es válida").isLength({
        min: 6,
        max: 10
    });
    request.checkBody("email",
        "Dirección de correo no válida").isEmail();
    request.checkBody("fechaNacimiento",
        "Fecha de nacimiento no válida").isBefore();
    request.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            response.redirect("correcto.html");
        } else {
            response.setFlash(result.array());
        }
    });
});