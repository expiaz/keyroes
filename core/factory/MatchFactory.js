'use strict';

var Match = require('./../entity/Match');

class MatchFactory{

    init(){

    }

    create(players){
        return new Match(players);
    }

}

module.exports = new MatchFactory();