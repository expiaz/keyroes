'use strict';
var fs = require('fs');

class T {

    constructor(){
        this.a = 1;
    }

    reponse(str){
        console.log(str);
    }

    fsing(){
        var self = this;
        fs.readFile('a.txt',function (err,content) {
            if(err) self.reponse('nan');
            else self.reponse('oui');
        })
    }

}

var j = new T();
j.fsing();