'use strict';
var io = require('./io');
var connected = io.sockets.connected;

class Dispatcher{
    constructor(){

    }

    messageSentHandler(sid,msg){
        connected[sid].emit('message',msg);
    }
}

module.exports = new Dispatcher();