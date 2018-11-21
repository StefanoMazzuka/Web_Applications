"use strict";
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.listen(3000, function (err) {
    if (err) console.log("error");
    else console.log("bien");
});

app.get("/reset.html", function (request, response) {
    response.status(200);
    response.cookie("contador", 0, {
        maxAge: 86400000
    });
    console.log(request.cookies.contador)
    response.type("text/plain");
    response.end("Has reiniciado el contador");
});
app.get("/increment.html", function (request, response) {
    if (request.cookies.contador === undefined) {
        response.redirect("/reset.html");
    } else {
        let contador = Number(request.cookies.contador) + 1;
        response.cookie("contador", contador);
        response.status(200);
        response.type("text/plain");
        response.end(`El valor actual del contador es ${contador}`);
    }
});