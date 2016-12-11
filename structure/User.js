
var User = function(socketid, username){
    this.id = socketid;
    this.username = username;

    this.match = null;
    this.state = 'hall';
    this.opp = null;
    this.pn = null;
    this.points = null;
}

module.exports = User;