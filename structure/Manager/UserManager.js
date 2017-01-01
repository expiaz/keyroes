'use strict';

var UserClass = require('./../class/User');
var state = require('./../utils/constants').User.State;
var io = require('../Io');
var connected = io.sockets.connected;

class UserManager{
    constructor(){
        this.users = [];
        this.usernames = [];

    }

    add(user){
        if(!this.users[user.sid]){
            this.users[user.sid] = user;
            this.usernames.push(user.username);
        }
        else this.update(user);
    }

    update(user){
        if(this.users[user.id]) this.users[user.id] = user;
    }

    get(id){
        if(this.users[id]) return this.users[id];
        else return -1;
    }

    remove(id){
        if(this.users[id]){
            var u = this.users[id];
            delete this.users[id];
            this.usernames.splice(this.usernames.indexOf(u.username),1);
            return u;
        }
        else return -1;
    }

    checkUsername(username){
        return this.usernames.indexOf(username) == -1;
    }

    register(user){
        console.log(user);
        console.log(this.usernames);
        console.log(this.users);
        if(this.users[user.sid]) return connected[user.sid].emit('k-already-connected');
        if(!this.checkUsername(user.username)) return connected[user.sid].emit('k-name-taken');
        var u = new UserClass(user.sid,user.username);
        this.add(u);
        console.log("af");
        console.log(this.usernames);
        console.log(this.users);
        return u;
    }

    disconnect(sid){
        if(!this.users[sid]) return;
        this.users[sid].disconnect();
    }

}

module.exports = new UserManager();