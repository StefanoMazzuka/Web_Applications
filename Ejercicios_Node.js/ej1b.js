"use strict";
const ejnode = require("./ejnode.js");

ejnode.freplace("data.txt",/[0-9]+/g, '{numero}', function (err) {
    if (err) console.log(err);
});