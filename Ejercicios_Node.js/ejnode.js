const fs = require("fs");

function freplace(fichero, buscar, sustituir, callback) {
    fs.readFile(fichero, {
            encoding: "utf-8"
        },
        function (err, content) {
            if (!err) {
                content = content.replace(buscar, sustituir);
                fs.writeFile("dataModified.txt", content, {
                    encoding: "utf-8"
                }, function (err, content) {
                    if (!err) console.log("Archivo modificado correctamente");
                });
            }
        });
}

module.exports = {
    freplace : freplace
};