var Redis = require('./server');
var LetterClass = require('./../../Letter');

var Letter = {
    genLetter: genLetter,
    addLetter:addLetter,
    getLetter:getLetter,
    hgetallLetters: hgetallLetters,
    saddLetters: saddLetters
}

module.exports = Letter;

function getLetterCode(){
    return Math.floor(Math.random() * 255) % 2 ? Math.floor(Math.random() * 25) + 97 : Math.floor(Math.random() * 25) + 65;
}

function genLetter(game_id,fn){
    Redis.incr("count_letters:"+game_id,function (err,res) {
        if(err) throw new Error(err);
        Redis.get("count_letters:"+game_id,function (err,letters_count) {
            if(err) throw new Error(err);
            var lcode = getLetterCode(),
                lid = game_id+""+lcode+""+letters_count,
                lx = Math.floor(Math.random() * ( 100 )) + 1,
                ly = Math.floor(Math.random() * ( 100 )) + 1,
                l = new LetterClass(lid,lcode,lx,ly);
            fn(false,l);
        });
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
        Redis.hmset("letter:"+letter.id,letter,function (err,res) {
            if(err) throw new Error(err);
            fn(false,letter.id);
        });
    });
}

function saddLetters(game_id,letter_id,user_id,fn){
    Redis.hmset("letters:"+game_id,letter_id,user_id,function (err,res) {
        if(err) throw new Error(err);
        fn(false);
    })
}

function hgetallLetters(game_id,fn){
    Redis.hgetall("letters:"+game_id,function (err,letters) {
        if(err) throw new Error(err);
        fn(false,letters);
    });
}

function getLetter(lid,fn){
    Redis.hgetall("letter:"+lid,function (err,letter) {
        if(err) throw new Error(err);
        fn(false,letter);
    });
}