var express = require('express');

var app = express();

var server = app.listen(3000,function () {
    console.log("[EXPRESS] listenning on port 3000")
});

var TimerManager = require('./TimerManager');

TimerManager.add({
    id:1,
    tick:1,
    time:5,
    ontick:ontick,
    onend:onend
});

function ontick(time){
    console.log(time);
}

function onend(){
    console.log("end");
}
