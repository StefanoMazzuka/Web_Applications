"use strict";
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

const DAOTasks = require("./DAOTasks");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tareas"
});

const staticFiles = path.join(__dirname, "public");
app.use(express.static(staticFiles));

app.listen(3000, function (err) {
    if (err) console.log("error");
    else console.log("bien");
});

app.get("/", function (request, response) {
    response.status(200);
    response.write("<p>HOLA</p>");
});

app.get("/tasks", function (request, response) {
    response.status(200);
    let task1 = {
        text: "Test task",
        tags: ["hello", "bye"],
        done: 1
    };
    let task2 = {
        text: "Test task",
        tags: ["hello", "bye"],
        done: 0
    };
    let tasks = [task1, task2];
    response.render("tasks.ejs", {
        taskList: tasks 
     });
     /*
    daoTasks.getAllTasks("usuario@ucm.es", function (err, tasks) {
       if (err) console.log(err);
       else {
            response.render("tasks.ejs", {
               taskList: tasks 
            });
        }
    });
    */
});
/*
app.get("/tasks", function (request, response) {
    response.status(200);
    response.render("prueba.ejs", {
        user: "Stefano"
    });
});
*/

let daoTasks = new DAOTasks(pool);