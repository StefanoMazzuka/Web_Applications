"use strict";

const http = require("http");
const mysql = require("mysql");
const url = require("url");
const fs = require("fs");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "mensajeria_instantanea"
});

function insertUser(user, email, tel, callback) {
    pool.getConnection(function (err, conexion) {
        if (err) {
            callback(err);
        } else {
            conexion.query(
                "INSERT INTO usuarios(nombre, correo, telefono) VALUES (?, ?, ?)", [user, email, tel],
                function (err) {
                    conexion.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
        }
    });
}

const servidor = http.createServer(function (request, response) {

    let method = request.method;
    console.log(method);

    let requestUrl = request.url;
    console.log(requestUrl);

    let objetoUrl = url.parse(requestUrl, true);
    let pathname = objetoUrl.pathname;
    console.log(pathname);

    let query = objetoUrl.query;
    console.log(query);

    if (method === "GET" && pathname === "/index.html") {
        fs.readFile("." + pathname,
            function (err, content) {
                if (err) {
                    response.statusCode = 500;
                    response.setHeader("Content-Type", "text/html");
                    response.write("ERROR INTERNO");
                    response.end();
                } else {
                    response.statusCode = 200;
                    response.setHeader("Content-Type", "text/html");
                    response.write(content);
                    response.end();
                }
            });
    }
    else if (method === "GET" && pathname === "/index.css") {
        fs.readFile("." + pathname,
            function (err, content) {
                if (err) {
                    response.statusCode = 500;
                    response.setHeader("Content-Type", "text/css");
                    response.write("ERROR INTERNO");
                    response.end();
                } else {
                    response.statusCode = 200;
                    response.setHeader("Content-Type", "text/css");
                    response.write(content);
                    response.end();
                }
            });
    }
    else if (method === "GET" && pathname === "/nuevo_usuario") {
        insertUser(query.nombre, query.correo, query.telefono, function (err) {
            if (err) {
                response.statusCode = 500; // Internal Server Error
                console.error(err);
            } else {
                response.statusCode = 200;
            }
        });
        response.end();
    }
    else response.statusCode = 404;
});

// Inicio del servidor
servidor.listen(3000, function (err) {
    if (err) {
        console.log(`Error al abrir el puerto 3000: ${err}`);
    } else {
        console.log("Servidor escuchando en el puerto 3000.");
    }
});