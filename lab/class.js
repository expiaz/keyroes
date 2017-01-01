'use strict';

class Lab{
    constructor(id){
        this.id = id;
        this.score = 0;
        this.points = 0;
    }
    upPoints(){
        return ++this.points;
    }
    getScore(){
        return this.score;
    }
}

module.exports = Lab;