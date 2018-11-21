"use strict";
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

const staticFiles = path.join(__dirname, "public");
app.use(express.static(staticFiles));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(3000, function (err) {
    if (err) console.log("error");
    else console.log("bien");
});

app.get("/", function (request, response) {
    response.status(200);
    response.render("list.ejs", {
        list: usuarios
    });
    response.end();
});

let usuarios = ["Uno", "Dos", "Tres"];

app.post("/delete", function (request, response) {
    usuarios.splice(request.body.ident, 1);
    response.render("list.ejs", {
        list: usuarios
    });
    response.end();
});