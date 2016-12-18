var Redis = require('./server');

var Game = {
    addGame: addGame,
    getGame: getGame,
    delGame: delGame,
    setGame: setGame
}

module.exports = Game;


function addGame(game,fn){
    Redis.set("count_letters:"+game.id,0,function (err,rep) {
        if(err) throw(err);
        Redis.hmset("game:"+game.id,game,function(err,rep){
            if(err) throw(err);
            fn(false,rep);
        });
    });
}

function getGame() {

}

function delGame() {

}

function setGame() {

}

function isGame(id){

}
