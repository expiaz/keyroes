
var User = function(socketid, username){
    this.id = socketid;
    this.username = username;
    this.match = 0;
    this.game = 0;
    this.state = 'HALL';
    this.answertomatch = -1;
}

module.exports = User;