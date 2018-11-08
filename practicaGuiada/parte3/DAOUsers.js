class DAOUsers {

    constructor(pool) {
        this.pool = pool;
    }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión: ${err.message}`), false);
            else {
                // ... realizar consulta ...
                connection.query(
                    "SELECT * FROM user WHERE email = ? AND password = ?", [email, password],
                    function (err, filas) {
                        connection.release();
                        if (err) callback(new Error('Error en la consulta a la base de datos'), false);
                        else {
                            // Acceso a las filas resultado de la consulta
                            let cont = 0;
                            filas.forEach(function (fila) {
                                cont++;
                            });
                            if (cont > 0) callback(null, true);
                            else callback(null, false);
                        }
                    }
                );
            }
        });
    }

    getUserImageName(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if(err) callback(new Error(`Error al obtener la conexión: ${err.message}`), "");
            else{
                connection.query(
                    "SELECT img FROM user WHERE email = ?", [email],
                    function(err, fila) {
                        connection.release();
                        if (err) callback(new Error('Error en la consulta a la base de datos'), "");
                        else callback(null, fila);
                    }
                )
            }
        });
    }
}

module.exports = DAOUsers;