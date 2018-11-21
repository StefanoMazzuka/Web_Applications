const config = require("./config");
const DAOTasks = require("./DAOTasks");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoTasks = new DAOTasks(pool);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/tasks", function (request, response) {
    response.status(200);
    daoTasks.getAllTasks("usuario@ucm.es", function (err, tasks) {
       if (err) console.log(err);
       else {
           //console.log(tasks[0]);
            response.render("tasks.ejs", {
               taskList: tasks 
               //La variable taskList que hay dentro de la plantilla tomará el valor del array
               //tasks
            });
        }
    });
});

app.post("/addTask",function (request,response){
    console.log(request.body.addTask);
    let task = {
        text : request.body.addTask.replace(/\@\w+/g,''),
        done : 0,
        tags : []
    };
	
	task.text = task.text.replace(/\s/g, ' '); //remove spaces
    task.text = task.text.trim(); //remove whitespace from both sides of a string
    task.tags = request.body.addTask.match(/\@\w+/g); //get tags with @
    for(var i = 0; i < task.tags.length; i++) {
        //remove @
        task.tags[i]= task.tags[i].substr(1);
    }
    
    daoTasks.insertTask("usuario@ucm.es", task, function (err, result){
        if (err) console.log(err);
        else {
            response.redirect("/tasks");
        }
    });
});

// Arrancar el servidor
app.listen(config.port, function(err) {
   if (err) {
    console.log("ERROR al iniciar el servidor");
}
else {
    console.log(`Servidor arrancado en el puerto ${config.port}`);
}
});
