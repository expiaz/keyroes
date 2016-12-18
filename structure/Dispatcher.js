var User = require('./User');
var Match = require('./Match');
var Game = require('./Game');




var Controllers = {
    User: require('./controllers/User'),
    Game: require('./controllers/Game'),
    Queue: require('./controllers/Queue'),
    Match: require('./controllers/Match')
};


var Dispatcher = {
    Register: Register,
    createMatch: createMatch,

    addQueue: Controllers.Queue.Model.Redis.addQueue,
    triggerQueue: Controllers.Queue.triggerQueue,
    getMatch: Controllers.Match.Model.Redis.getMatch,
    getUser: Controllers.User.Model.Redis.getUser,
    setMatch: Controllers.Match.Model.Redis.setMatch,
    setUser: Controllers.User.Model.Redis.setUser,
    delMatch: Controllers.Match.Model.Redis.delMatch,
    setUsers: Controllers.User.setUsers
}

module.exports = Dispatcher;



/*
function addQueue(id,fn){
    Controllers.Queue.Model.Redis.addQueue(id,function(err,msg){
        if(err) fn(true,msg);
        else{
            fn(false,"added to queue");
        }
    });
}

function triggerQueue(fn){
    Controllers.Queue.triggerQueue(function(err,msg,ack,players){
        if(err) fn(true,msg);
        else fn(false,msg,ack,players);
    });
}

function getMatch(id,fn){
    Controllers.Match.Model.Redis.getMatch(id,function (err,fetch_match) {
        if(err) fn(true,fetch_match);
        else fn(false,fetch_match);
    });
}

function getUser(id,fn){
    Controllers.User.Model.Redis.getUser(id,function (err,rep) {
        if(err) fn(true,rep);
        else fn(false,rep);
    });
}

function setMatch(id,prop,value,fn){
    Controllers.Match.Model.Redis.setMatch(id,prop,value,function (err,rep) {
        if(err) fn(true,rep);
        else fn(false,rep);
    });
}

function setUser(id,props,fn){
    Controllers.User.Model.Redis.setUser(id,props,function (err,rep) {
        if(err) fn(true,rep);
        else fn(false,rep);
    });
}

function delMatch(id,fn) {
    Controllers.Match.Model.Redis.delMatch(id,function (err,rep) {
        if(err) fn(true,rep);
        else fn(false,rep);
    });
}

function setUsers(ids,props,fn){
    Controllers.User.setUsers(ids,props,function (err,res) {
        if(err) fn(true,res);
        else fn(false,res);
    });
}
*/


function Register(id,username,fn){
    var user = new User(id,username);
    Controllers.User.Model.Redis.addUser(user,function(e,r){
        if(e) fn(e,r);
        else fn(e,user);
    });
}

function createMatch(ids,fn){

    Controllers.User.getUsers(ids, function(err,users){
        if(err){
            fn(true,"Pb retieving the users (createMatch)");
            return;
        }
        var ack = false;
        users.forEach(function (user) {
            if(user.match != false){
                ack = true;
                return;
            }
        });
        if(ack){
            fn(false,"User already in a match");
            return;
        }
        var match = new Match(ids[0]+""+ids[1],ids[0],ids[1]);
        Controllers.Match.Model.Redis.addMatch(match,function(err,rep){
            if(err){
                fn(true,"Error adding the match");
                return;
            }
            Controllers.User.setUsers(ids,{match:match.id},function(err,rep){
                if(err){
                    fn(true,rep);
                    return;
                }
                fn(false,match.id);
            });
        });
    })

}