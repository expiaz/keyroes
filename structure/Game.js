
var Game = function(id,p1,p2){
    this.id = id;
    this.p1 = p1;
    this.p2 = p2;
    this.p1_score = 0;
    this.p2_score = 0;
    this.letter = 0;
}

module.exports = Game;