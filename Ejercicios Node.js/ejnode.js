const fs = require("fs");

function freplace(fichero, buscar, sustituir, callback) {
    fs.readFile(fichero, {
            encoding: "utf-8"
        },
        function (err, content) {
            if (err) callback(new Error("Error de lectura"));
            else {
                content = content.replace(buscar, sustituir);
                fs.writeFile("dataModified.txt", content, {
                    encoding: "utf-8"
                }, function (err) {
                    if (err) callback(new Error("Error de escritura"));
                    else callback(null);
                });
            }
        });
}

module.exports = {
    freplace: freplace
};