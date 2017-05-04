'use strict';

class Map{

    constructor(){
        this.keys = [];
        this.values = [];
    }

    add(key, value){
        this.keys.push(key);
        this.values.push(value);
    }

    get(key){
        return this.values[this.keys.indexOf(key)];
    }

    exists(key){
        return this.keys.indexOf(key) !== -1;
    }

    contains(value){
        return this.values.indexOf(value) !== -1;
    }

    remove(key){
        var index = this.keys.indexOf(key);
        this.keys.splice(index, 1);
        return this.values.splice(index, 1);
    }

}

module.exports = Map;