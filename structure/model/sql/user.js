var sql = require('./server');


sql.query('SELECT * FROM keyroes.user', function(err, rows, fields) {
    if (err) throw err;
    console.log('[SQL] Test Queries');
    console.log('There is : '+rows.length+ ' users registered');
    console.log('They are :');
    rows.forEach(function(upplet,i){
        console.log("    "+upplet.id+"."+upplet.username);
    });
});