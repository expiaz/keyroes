'use strict';

var MatchFactory = require('./../factory/MatchFactory');

class Queue{

    constructor(length){
        this.length = length;
        this.queue = [];
    }

    add(player){
        this.queue.push(player);
        this.trigger();
    }

    remove(player){
        this.queue.splice(this.queue.indexOf(player), 1);
    }

    trigger(){
        if(this.queue.length >= this.length){
            MatchFactory.create(this.queue);
            this.queue = [];
        }
    }

}

module.exports = Queue;