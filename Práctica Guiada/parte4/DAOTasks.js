class DAOTasks {

    constructor(pool) {
        this.pool = pool;
    }

    /**
     * 
     * @param {*Email de usuario del cual queremos todas las tareas} email 
     * @param {*Devuelve err y una lista de las tareas del usuario} callback 
     */
    getAllTasks(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión: ${err.message}`), null);
            else {
                // ... realizar consulta ...
                connection.query("SELECT a.id, a.text, a.done, b.tag FROM task AS a LEFT JOIN tag AS b ON id = taskId WHERE a.user = ?", [email],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error en la consulta a la base de datos'), null);
                        else {
                            let task = {
                                id: rows[0].id,
                                text: rows[0].text,
                                tags: [],
                                done: rows[0].done
                            };
                            task.tags.push(rows[0].tag);
                            let tasks = [];

                            let j = 0;
                            for (let i = 1; i < rows.length; i++) {
                                if (rows[i].id === rows[j].id)
                                    task.tags.push(rows[i].tag);
                                else {
                                    tasks.push(task);
                                    j = i;
                                    task = {};
                                    task.id = rows[i].id;
                                    task.text = rows[i].text;
                                    task.tags = [];
                                    task.tags.push(rows[i].tag);
                                    task.done = rows[i].done;
                                }
                            }
                            tasks.push(task);
                            callback(null, tasks);
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*Email del usuario al que le queremos agregar una tarea} email 
     * @param {*Tarea a agregar} task 
     * @param {*Devuelve err} callback 
     */
    insertTask(email, task, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión: ${err.message}`));
            else {
                // ... realizar consulta ...      
                connection.query("INSERT INTO task(user, text, done) VALUES (?, ?, ?)", [email, task.text, task.done],
                    function (err, result) {
                        connection.release();
                        if (err) callback(new Error('Error en la consulta a la base de datos'));
                        else {
                            let values = [];
                            for (let i = 0; i < task.tags.length; i++) {
                                values[i] = [result.insertId, task.tags[i]];
                            }
                            connection.query("INSERT INTO tag(taskId, tag) VALUES ?", [values],
                                function (err) {
                                    if (err) callback(new Error('Error al insertar los tags'));
                                    else callback(null);
                                });
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*ID de la tarea a completar} idTask 
     * @param {*Devuelve err} callback 
     */
    markTaskDone(idTask, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión: ${err.message}`));
            else {
                // ... realizar consulta ...      
                connection.query("UPDATE task SET done = 1 WHERE id = ?", [idTask],
                    function (err, result) {
                        connection.release();
                        if (err) callback(new Error('Error en la consulta a la base de datos'));
                        else callback(null);
                    });
            }
        });
    }

    /**
     * 
     * @param {*Email del usuario al que se le borraran las tareas completadas} email 
     * @param {*Devuelve err} callback 
     */
    deleteCompleted(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión: ${err.message}`));
            else {
                // ... realizar consulta ...      
                connection.query("DELETE FROM task WHERE user = ? AND done = 1", [email],
                    function (err, result) {
                        connection.release();
                        if (err) callback(new Error('Error en la consulta a la base de datos'));
                        else callback(null);
                    });
            }
        });
    }
}

module.exports = DAOTasks;