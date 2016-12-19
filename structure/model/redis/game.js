var Redis = require('./server');

var Game = {
    addGame: addGame,
    getGame: getGame,
    delGame: delGame,
    setGame: setGame
}

module.exports = Game;


function isGame(id,fn){
    Redis.sscan("games","0","match",id,"count","999",function(err,replies){
        if(err) throw(err);
        fn(replies[1].length == 1);
    });
}

function addGame(game,fn){
    isGame(game.id,function (r) {
        if(r){
            fn(true,"Game already exists");
            return;
        }
        Redis.multi()
            .sadd("games",game.id)
            .set("count_letters:"+game.id,0)
            .hmset("game:"+game.id,game)
            .exec(function (err) {
                if(err) throw(err);
                fn(false,"Game added");
            });
    });
}

function getGame(id,fn) {
    isGame(id,function (r) {
        if(!r){
            fn(true,"Game doesn't exists");
            return;
        }
        Redis.hgetall("game:"+id,function (err,game) {
            if(err) throw(err);
            fn(false,game);
        });
    });
}

function delGame(id,fn) {
    isGame(id,function (r) {
        if(!r){
            fn(true,"Game doesn't exists");
            return;
        }
        Redis.del("game:"+id,function (err,res) {
            if(err) throw(err);
            fn(false,res);
        });
    });
}

function setGame(id,props,fn) {
    isGame(id,function (r) {
        if(!r){
            fn(true,"Game doesn't exists");
            return;
        }
        Redis.hmset("match:"+id,props,function(err,res){
            if(err) throw(err);
            fn(false,res);
        });
    });
}
