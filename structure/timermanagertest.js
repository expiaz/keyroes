var express = require('express');

var app = express();

var server = app.listen(3000,function () {
    console.log("[EXPRESS] listenning on port 3000")
});

var TimerManager = require('./TimerManager');

TimerManager.add(1,1,ontick,onend);
TimerManager.start(1,5);

function ontick(time){
    console.log(time);
}

function onend(){
    console.log("end");
}
