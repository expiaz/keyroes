var redis = require('redis');
var client = redis.createClient();
var Q = require('q');

client.on('connect', function() {
    console.log('[REDIS] connected');
});

function getKey(key){
    return Q.ninvoke(client, "get", key);
}

getKey("user:1")
    .then(function (value) {
        console.log(value);
        })
    .catch(function (err) {
        console.log(err);
        })