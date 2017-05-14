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
    }

    /**
     * A player in queue changed socket
     * @param player
     */
    reconcile(player){

    }

    remove(player){
        if(this.currentQueue === null)
            return;
        this.currentQueue.remove(player);
    }

    getActualState(player){
        return this.currentQueue.getActualState(player);
    }



}

module.exports = new QueueManager();