var app = require('./api/api');

var server = app.listen(3000,function () {
    console.log("[EXPRESS] listenning on port 3000")
});

module.exports = server;