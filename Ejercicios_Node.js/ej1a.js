"use strict";
const fs = require("fs");

fs.readFile("data.txt", {
        encoding: "utf-8"
    },
    function (err, content) {
        if (!err) {
            content = content.replace(/\s+/g,' ');
            fs.writeFile("dataModified.txt", content, {
                encoding: "utf-8"
            }, function (err, content) {
                if (!err) console.log("Archivo modificado correctamente");
            });
        }
    });