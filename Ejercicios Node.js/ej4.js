"use strict";

const mysql = require("mysql");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "articulos"
});

pool.getConnection(function (err, connection) {
    if (err) {
        console.log(`Error al obtener la conexión: ${err.message}`);
    } else {
        // ... realizar consulta ...
        connection.query(
            "SELECT Id, Titulo, Fecha FROM articulos LEFT JOIN palabrasclave ON Id = IdArticulo",
            function (err, filas) {
                connection.release();
                if (err) {
                    console.log('Error en la consulta a la base de datos');
                } else {
                    // Acceso a las filas resultado de la consulta
                    filas.forEach(function (fila) {
                        console.log(`${fila.Id} ${fila.Titulo} ${fila.Fecha}`);
                    });
                }
            }
        );
    }
});