var Redis = require('./server');
var LetterClass = require('./../../Letter');

var Letter = {
    addLetter:addLetter,
    getLetter:getLetter,
    getLetters: getLetters,
}

module.exports = Letter;

function getLetterCode(){
    return Math.floor(Math.random() * 255) % 2 ? Math.floor(Math.random() * 25) + 97 : Math.floor(Math.random() * 25) + 65;
}

function genLetter(game_id,fn){
    Redis.incr("count_letters:"+game_id,function (err,res) {
        if(err) throw(err);
        Redis.get("count_letters:"+game_id,function (err,letters_count) {
            var lcode = getLetterCode(),
                lid = game_id+""+lcode+""+letters_count,
                lx = Math.floor(Math.random() * ( 100 )) + 1,
                ly = Math.floor(Math.random() * ( 100 )) + 1,
                l = new LetterClass(lid,lcode,lx,ly);
            fn(false,l);
        })
    });
}

/**
 * Set the hash letter:letter_id(game_id+Ascii+Count) and complete the hash letters:game_id (hmset)
 * @param game_id
 * @param letter
 * @param fn
 */
function addLetter(game_id,fn){
    genLetter(game_id, function (err,letter) {
        if(err){
            fn(true,"GenLetter failed");
            return;
        }
        Redis.multi()
            .hmset("letters:"+game_id,letter.id,0)
            .hmset("letter:"+letter.id,letter)
            .exec(function (err) {
                if(err) throw(err);
                fn(false,"Letter added");
            });
    });

}

function getLetters(game_id,fn){
    Redis.hgetall("letters:"+game_id,function (err,letters) {
        if(err) throw(err);
        fn(false,letters);
    });
}

function getLetter(lid,fn){
    Redis.hgetall("letter:"+lid,function (err,letter) {
        if(err) throw(err);
        fn(false,letter);
    });
}