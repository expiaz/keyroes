
var Letter = function(id,code,x,y){
    this.id = id;
    this.code = code;
    this.char = String.fromCharCode(code);
    this.x = x;
    this.y = y;
}

module.exports = Letter;