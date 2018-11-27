"use strict";
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const app = express();
const DAOTasks = require("./DAOTasks");
const DAOUsers = require("./DAOUsers");
const bodyParser = require("body-parser");
const staticFiles = path.join(__dirname, "public");
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

let daoTasks = new DAOTasks(pool);
let daoUsers = new DAOUsers(pool);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function middlewareExistsCurrentUser(request, response, next) {
    if (request.session.currentUser !== undefined) {
        response.locals.userEmail = request.session.currentUser;
        next();
    }
    else response.redirect("/login"); // Saltar al siguiente middleware
}

app.use(middlewareSession);
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
    response.redirect("/login");
});

app.get("/login", function (request, response) {
    response.status(200);
    response.render("login", {
        errorMsg: null
    });
});

app.get("/logout", function (request, response) {
    response.status(200);
    request.session.destroy();
    response.render("login", {
        errorMsg: null
    });
});

app.get("/tasks", middlewareExistsCurrentUser, function (request, response) {
    response.status(200);
    daoTasks.getAllTasks(request.session.currentUser, function (err, tasks) {
        if (err) console.log(err);
        else {
            response.render("tasks", {
                taskList: tasks
            });
        }
    });
});

app.get("/userImg", middlewareExistsCurrentUser, function (request, response) {
    response.status(200);
    daoUsers.getUserImageName(request.session.currentUser, function(err, userImg) {
        if (err) console.log(err);
        else {
            if (userImg === "") response.sendFile(path.join(__dirname, "public", "img", "noProfile.png"));
            else response.sendFile(path.join(__dirname, "profile_imgs", userImg));
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
            if (!isCorrect) {
                response.render("login", {
                    errorMsg: "Usuario o contraseña erroneos"
                });
            } else {
                request.session.currentUser = request.body.email;
                response.redirect("/tasks");
            }
        }
    });
});

app.post("/addTask", middlewareExistsCurrentUser, function (request, response) {
    response.status(200);
    let task = createTask(request.body.task);
    if (task.text !== "") {
        daoTasks.insertTask(request.session.currentUser, task, function (err, result) {
            if (err) console.log(err);
            else response.redirect("/tasks");
        });
    }
});

app.get("/finish/:taskId", middlewareExistsCurrentUser, function (request, response) {
    response.status(200);
    daoTasks.markTaskDone(request.params.taskId, function (err, tasks) {
        if (err) console.log(err);
        else response.redirect("/tasks");
    });
});

app.get("/deleteCompleted", middlewareExistsCurrentUser, function (request, response) {
    daoTasks.deleteCompleted(request.session.currentUser, function (err, result) {
        if (err) console.log(err);
        else response.redirect("/tasks");
    });
});