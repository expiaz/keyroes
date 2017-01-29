var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'keyroes'
});

connection.connect(function(err) {
    if (err) throw('error connecting: ' + err.stack);
    console.log('[SQL] connected');
});

module.exports = connection;