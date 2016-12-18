var Redis = require('./server');


var Match = {
    addMatch: addMatch,
    getMatch: getMatch,
    delMatch: delMatch,
    setMatch: setMatch
};

module.exports = Match;

function addMatch(match,fn){
    Redis.hmset("match:"+match.id,match,function(err,rep){
        if(err) throw(err);
        fn(false,rep);
    });
}

function getMatch(id,fn){
    Redis.hgetall("match:"+id, function (err, match){
        if(err) throw(err);
        //console.log(" redis get the match ");
        //console.log(match)
        fn(false,match);
    });
}

function delMatch(id,fn){
    Redis.del("match:"+id,function(err,res){
        if(err) throw(err);
        fn(res?false:true);
    });
}

function setMatch(id,props,fn){
    Redis.hmset("match:"+id,props,function(err,res){
        if(err) throw(err);
        fn(false,res);
    });
}