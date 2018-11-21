"use strict";
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mysqlSession = require("express-mysql-session");
const session = require("express-session");
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false
});
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "contactos"
});

app.use(cookieParser());

app.listen(3000, function (err) {
    if (err) console.log("error");
    else console.log("bien");
});



app.use(middlewareSession);
app.get("/reset.html", function (request, response) {
    response.status(200);
    request.session.contador = 0;
    response.type("text/plain");
    response.end("Has reiniciado el contador");
});

app.get("/increment.html", function (request, response) {
    if (request.session.contador === undefined) {
        response.redirect("/reset.html");
    } else {
        let contador = Number(request.session.contador) + 1;
        request.session.contador++;
        response.status(200);
        response.type("text/plain");
        response.end(`El valor actual del contador es ${contador}`);
    }
});