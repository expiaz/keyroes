'use strict';

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
        return -1;
    }

    remove(id){
        if(!this.users[id]) return -1;
        var u = this.users[id];
        delete this.users[id];
        this.usernames.splice(this.usernames.indexOf(u.username),1);
        return u;
    }

    checkUsername(username){
        return this.usernames.indexOf(username) == -1;
    }

    exists(sid) {
        return this.users[sid] !== undefined;
    }

}

module.exports = new UserManager();