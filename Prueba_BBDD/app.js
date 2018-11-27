"use strict";

const mysql = require("mysql");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "contactos"
});
/*
pool.getConnection(function (err, connection) {
    if (err) {
        console.log(`Error al obtener la conexión: ${err.message}`);
    } else {
        // ... realizar consulta ...
        connection.query(
            "SELECT Nombre, Apellidos FROM Contactos",
            function (err, filas) {
                conexion.release();
                if (err) {
                    console.log('Error en la consulta a la base de datos');
                } else {
                    // Acceso a las filas resultado de la consulta
                    filas.forEach(function (fila) {
                        console.log(`${fila.Nombre} ${fila.Apellidos}`);
                    });
                }
            }
        );
    }
});

pool.getConnection(function (err, connection) {
    if (err) {
        console.log(`Error al obtener la conexión: ${err.message}`);
    } else {
        const sql = "INSERT INTO Contactos(Nombre, Apellidos) " +
            "VALUES ('Diana', 'Díaz')";
        connection.query(sql, function (err, resultado) {
            connection.release();
            if (err) {
                console.log("Error de inserción: " + err);
            } else {
                // Imprime el identificador de la nueva fila
                console.log(resultado.insertId);
                // Imprime el número de filas insertadas
                console.log(resultado.affectedRows);
            }
        });
    }
});
*/

// Suponemos que la variable `id` contiene el identificador
// introducido por el usuario

let id = 1;
pool.getConnection(function (err, connection) {
    if (err) {
        console.log(`Error al obtener la conexión: ${err.message}`);
    } else {
        const sql = `SELECT Nombre, Apellidos FROM contactos WHERE Id=${id}`;
        connection.query(sql, function (err, filas) {
            connection.release();
            if (err) {
                console.log("Error en la consulta");
            } else {
                console.log(filas);
            }
        });
    }
});