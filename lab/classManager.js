'use strict';

var mcl = require('./class');

class classManager{
    constructor(){
        this.classes = [];
    }

    add(cl){
        this.classes[cl.id] = cl;
    }

    update(cl){
        this.classes[cl.id] = cl;
    }

    get(id){
        return this.classes[id];
    }


}
