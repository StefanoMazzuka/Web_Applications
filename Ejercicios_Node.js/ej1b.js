"use strict";
const ejnode = require("./ejnode.js");

function callBackDefault(err) {
    if (err) console.log("Error en freplace");
    else console.log("Éxito");
}

ejnode.freplace("data.txt",/[0-9]+/g, '{numero}', function (err) {
    if (err) console.log(err);
});