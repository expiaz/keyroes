'use strict';

var Queue = require('./../entity/Queue');

class QueueManager{

    constructor(){
        this.currentQueue = null;
    }

    init(){
        this.currentQueue = new Queue(2);
    }

    add(player){

        if(this.currentQueue === null)
            this.currentQueue = new Queue(2);

        this.currentQueue.add(player);

        if(this.currentQueue.triggered)
            this.currentQueue = null;
    }

    remove(player){
        if(this.currentQueue === null)
            return;
        this.currentQueue.remove(player);
    }



}

module.exports = new QueueManager();