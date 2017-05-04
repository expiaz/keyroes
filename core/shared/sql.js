var mysql = require('mysql');
var Q = require('q');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'keyroes'
});

//enable queries with :placeholders and {placeholder: value} values
connection.config.queryFormat = function (query, values) {
    if (!values) return query;
    return query.replace(/:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};

connection.connect(function(err) {
    if (err) throw('error connecting: ' + err.stack);
    console.log('[SQL] connected');
});

connection.promiseQuery = Q.nbind(connection.query, connection);

module.exports = connection;