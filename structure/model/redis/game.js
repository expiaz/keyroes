var Redis = require('./server');
var letterRedis = require('./letter');

var Game = {
    addGame: addGame,
    getGame: getGame,
    delGame: delGame,
    setGame: setGame
}

module.exports = Game;


function isGame(id,fn){
    Redis.sscan("games","0","match",id,"count","999",function(err,replies){
        if(err) throw new Error(err);
        fn(replies[1].length == 1);
    });
}

function addGame(game,fn){
    isGame(game.id,function (r) {
        if(r) return fn(true,"[Model:game:addGame] Game already exists");
        Redis.multi()
            .sadd("games",game.id)
            .set("count_letters:"+game.id,0)
            .hmset("game:"+game.id,game)
            .exec(function (err) {
                if(err) throw new Error(err);
                fn(false);
            });
    });
}

function getGame(id,props,fn) {
    isGame(id,function (r) {
        if(!r) return fn(true,"[Model:game:getGame] Game doesn't exists");
        if(props.length){
            if(props.length == 1){
                Redis.hget("game:"+id,props[0],function (err,res) {
                    if(err) throw new Error(err);
                    fn(false,res);
                });
            }
            else{
                var ret = [];
                props.forEach(function (prop) {
                    Redis.hget("game:"+id,prop,function (err,res) {
                        if(err) throw new Error(err);
                        ret.push(res);
                        if(ret.length == props.length) fn(false,ret);
                    })
                })
            }
        }
        else{
            Redis.hgetall("game:"+id,function (err,game) {
                if(err) throw new Error(err);
                fn(false,game);
            });
        }
    });
}

function delGame(id,fn) {
    isGame(id,function (r) {
        if(!r) return fn(true,"delGame Game doesn't exists");
        letterRedis.lrangeLetters(id,function (err,letters) {
            if(err) fn(true,letters);
            letterRedis.delLetters(id,function (err,res) {
                if(err) fn(true,res);
                letterRedis.delLettersTypeHistory(id,function (err,res) {
                    if(err) fn(true,res);
                    getGame(id,[],function (err,game) {
                        if(err) fn(true,res);
                        letterRedis.delLetter(game.letter,function (err,res) {
                            if(err) fn(true,res);
                            Redis.srem("games",id,function (err,res) {
                                if(err) throw new Error(err);
                                Redis.del("game:"+id,function (err,res) {
                                    if(err) throw new Error(err);
                                    if(letters.length){
                                        var stop = 0;
                                        letters.forEach(function (lid) {
                                            letterRedis.delLetter(lid.split("::")[1],function (err,res) {
                                                if(++stop == letters.length) fn(false);
                                            });
                                        });
                                    }
                                    else fn(false);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function setGame(id,props,fn) {
    isGame(id,function (r) {
        if(!r) return fn(true,"setGame Game doesn't exists");
        Redis.hmset("game:"+id,props,function(err,res){
            if(err) throw new Error(err);
            fn(false);
        });
    });
}
