
var User = function(socketid, username){
    this.id = socketid;
    this.username = username;

    this.match = "";
    this.state = 'hall';
    this.opp = "";
    this.pn = "";
    this.points = "";
}

module.exports = User;