'use strict';

var MatchFactory = require('./../factory/MatchFactory');
var constants = require('./../shared/constants');

class Queue{

    constructor(length){
        this.length = length;
        this.queue = [];
        this.triggered = false;
    }

    add(player){
        console.log('Queue::add ', this.queue.length);
        if(this.queue.indexOf(player) !== -1)
            return player.getSocket().emit(constants.queue.ENTER_QUEUE_ACK);
        console.log('Queue::added');
        this.queue.push(player);
        player.getSocket().emit(constants.queue.ENTER_QUEUE_ACK);
        this.trigger();
    }

    remove(player){
        console.log('Queue::remove ', this.queue.length);
        if(this.queue.indexOf(player) !== -1){
            console.log('Queue::removed');
            this.queue.splice(this.queue.indexOf(player), 1);
            player.getSocket().emit(constants.queue.LEAVE_QUEUE_ACK);
        }
    }

    trigger(){
        if(this.queue.length >= this.length){
            console.log('triggered');
            this.triggered = true;
            MatchFactory.create(this.queue);
            this.queue = [];
        }
    }

}

module.exports = Queue;