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
            fn(true,"addGame Game already exists");
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

function getGame(id,props,fn) {
    console.log("getGame "+id)
    isGame(id,function (r) {
        if(!r){
            fn(true,"getGame Game doesn't exists");
            return;
        }
        if(props.length){
            if(props.length == 1){
                Redis.hget("game:"+id,props[0],function (err,res) {
                    if(err) throw new Error(res);
                    fn(false,res);
                });
            }
            else{
                var ret = [];
                props.forEach(function (prop) {
                    Redis.hget("game:"+id,prop,function (err,res) {
                        if(err) throw new Error(res);
                        ret.push(res);
                        if(ret.length == props.length) fn(false,ret);
                    })
                })
            }
        }
        else{
            Redis.hgetall("game:"+id,function (err,game) {
                if(err) throw(err);
                fn(false,game);
            });
        }
    });
}

function delGame(id,fn) {
    isGame(id,function (r) {
        if(!r){
            fn(true,"delGame Game doesn't exists");
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
            fn(true,"setGame Game doesn't exists");
            return;
        }
        Redis.hmset("game:"+id,props,function(err,res){
            if(err) throw(err);
            fn(false,res);
        });
    });
}
