"use strict";
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(cookieParser());

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
    response.render("firstNumber.ejs");
    response.end();
});

app.post("/firstNumber", function (request, response) {
    console.log(request.body.firstNumber);
    response.cookie("fn", request.body.firstNumber, {
        maxAge: 300000
    });
    console.log(request.cookies.fn);
    response.render("secondNumber.ejs");
    response.end();
});

app.post("/secondNumber", function (request, response) {
    response.cookie("sn", request.body.secondNumber, {
        maxAge: 300000
    });
    response.render("result.ejs", {
        firstNumber: Number(request.cookies.fn),
        secondNumber: Number(request.cookies.sn)
    });
    response.clearCookie(fn);
    response.clearCookie(sn);
    response.end();
});