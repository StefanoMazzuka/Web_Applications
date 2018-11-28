class DAOUsers {

    constructor(pool) {
        this.pool = pool;
    }

    /**
     * 
     * @param {*Email del usuario que queremos comprobar} email 
     * @param {*Contraseña del usuario que queremos comprobar} password 
     * @param {*Devuelve err y si el usuario existe o no} callback 
     */
    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión: ${err.message}`), false);
            else {
                // ... realizar consulta ...
                connection.query(
                    "SELECT * FROM user WHERE email = ? AND password = ?", [email, password],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error en la consulta a la base de datos'), false);
                        else {
                            // Acceso a las filas resultado de la consulta
                            if (rows.length != 0) callback(null, true);
                            else callback(null, false);
                        }
                    }
                );
            }
        });
    }

    /**
     * 
     * @param {*Email del usuario del cual queremos consultar su imagen de avatar} email 
     * @param {*Devuelve err y el texto con la dirección de su imagende avatar} callback 
     */
    getUserImageName(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if(err) callback(new Error(`Error al obtener la conexión: ${err.message}`), "");
            else{
                connection.query(
                    "SELECT img FROM user WHERE email = ?", [email],
                    function(err, row) {
                        connection.release();
                        if (err) callback(new Error('Error en la consulta a la base de datos'), "");
                        else callback(null, row[0].img);
                    }
                )
            }
        });
    }
}

module.exports = DAOUsers;