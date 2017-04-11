'use strict';

class Io{

    constructor(){
        this.instance = null;
    }

    getInstance(){
        return this.instance;
    }

    setInstance(instance){
        this.instance = instance;
    }

}

module.exports = new Io();