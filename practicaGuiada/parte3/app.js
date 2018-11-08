"use strict";

const mysql = require("mysql");
const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tareas"
});

let daoUsers = new DAOUsers(pool);
let daoTasks = new DAOTasks(pool);

daoUsers.isUserCorrect("usuario@ucm.es", "mipass", cb_isUserCorrect);

function cb_isUserCorrect(err, result) {
    if (err) console.log(err.message);
    else if (result) {
        console.log("Usuario y contraseña correctos");
        daoUsers.getUserImageName("usuario@ucm.es", cb_getUserImageName);
    }
    else console.log("Usuario y/o contraseña incorrectos");
}

function cb_getUserImageName(err, result) {
    if (err) console.log(err.message);
    else console.log(result);
}