var redis = require('redis');
var client = redis.createClient();

client.on('error', function(err) {
    console.log(err);
});

client.on('connect', function() {
    console.log('[REDIS] connected');
});

client.flushall(function(err,rep){
    if(err) throw(err);
    console.log('[REDIS:FLUSHALL] '+rep);
});

module.exports = client;