var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nuzzle'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

connection.query('SELECT * FROM player', function(err, rows, fields) {
    if(err)
        return 1;
    //console.log(rows);
    //console.log(fields);
    rows.forEach(function(e,i,array){
        console.log("row "+i+" : ");
        console.log(e.username);
    });
});

connection.end();