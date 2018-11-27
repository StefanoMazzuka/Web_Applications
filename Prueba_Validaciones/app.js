"use strict";
const path = require("path");
const express = require("express");
const app = express();
const staticFiles = path.join(__dirname, "public");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(express.static(staticFiles));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator());

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
            response.render("index", {
                errores: result.array()
            });
        }
    });
});



/*
app.get("/login", function (request, response) {
    response.status(200);
    response.render("login.ejs", {
        errorMsg: null
    });
});

app.get("/tasks", function (request, response) {
    response.status(200);
    daoTasks.getAllTasks("usuario@ucm.es", function (err, tasks) {
        if (err) console.log(err);
        else {
            console.log(tasks[0].tags);
            response.render("tasks.ejs", {
                taskList: tasks
            });
        }
    });
});

function createTask(text) {
    let task = {};
    task.text = text.replace(/\@\w+/g, '');
    task.text = task.text.trim();
    if (text != "") {
        task.tags = text.match(/\@\w+/g);
        if (task.tags != null) {
            for (let i = 0; i < task.tags.length; i++) {
                task.tags[i] = task.tags[i].substring(1);
            }
        } else task.tags = [];
        task.done = 0;
    }
    return task;
}

app.post("/login", function (request, response) {
    response.status(200);
    daoUsers.isUserCorrect(request.body.email, request.body.password, function (err, isCorrect) {
        if (err) console.log(err);
        else {
            if (isCorrect === "false") {
                response.render("login.ejs", {
                    errorMsg: "Usuario o contraseña erroneos"
                });
            }
            else response.redirect("/tasks");
        }
    });
});

app.post("/addTask", function (request, response) {
    response.status(200);
    let task = createTask(request.body.task);
    if (task.text !== "") {
        daoTasks.insertTask("usuario@ucm.es", task, function (err, result) {
            if (err) console.log(err);
            else response.redirect("/tasks");
        });
    }
});

app.get("/finish/:taskId", function (request, response) {
    response.status(200);
    daoTasks.markTaskDone(request.params.taskId, function (err, tasks) {
        if (err) console.log(err);
        else response.redirect("/tasks");
    });
});

app.get("/deleteCompleted", function (request, response) {
    daoTasks.deleteCompleted("usuario@ucm.es", function (err, result) {
        if (err) console.log(err);
        else response.redirect("/tasks");
    });
});
*/