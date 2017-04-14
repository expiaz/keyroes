'use strict';

var GameFactory = require('./../factory/GameFactory');
var LetterFactory = require('./../factory/LetterFactory');
var MatchFactory = require('./../factory/MatchFactory');

var ChatManager = require('./../manager/ChatManager');
var QueueManager = require('./../manager/QueueManager');

var GameRepository = require('./../repository/GameRepository');
var UserRepository = require('./../repository/UserRepository');

GameFactory.init();
MatchFactory.init();
LetterFactory.init();
ChatManager.init();
QueueManager.init();

var Map = require('./Map');

class Singleton{

    constructor(){
        this.initialized = false;
        this.instances = new Map();
    }

    init(){
        GameFactory.init();
        MatchFactory.init();
        LetterFactory.init();
        ChatManager.init();
        QueueManager.init();
        this.instances.add('GameFactory', GameFactory);
        this.instances.add('MatchFactory', MatchFactory);
        this.instances.add('LetterFactory', LetterFactory);
        this.instances.add('ChatManager', ChatManager);
        this.instances.add('QueueManager', QueueManager);
        this.initialized = true;
    }

    get(key){
        if(this.initialized === false)
            return;
        return this.instances.get(key);
    }

}

module.exports = new Singleton();