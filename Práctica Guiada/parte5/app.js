"use strict";
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const app = express();
const DAOTasks = require("./DAOTasks");
const bodyParser = require("body-parser");
const staticFiles = path.join(__dirname, "public");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tareas"
});

let daoTasks = new DAOTasks(pool);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(express.static(staticFiles));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(3000, function (err) {
    if (err) console.log(err);
    else console.log("Escuchando puerto 3000");
});

app.get("/", function (request, response) {
    response.status(200);
    response.redirect("/tasks");
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
        } 
        else task.tags = [];
        task.done = 0;
    }
    return task;
}

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