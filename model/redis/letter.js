var Redis = require('./server');
var LetterClass = require('./../../class/Letter');

var Letter = {
    genLetter: genLetter,
    addLetter:addLetter,
    delLetter:delLetter,
    getLetter:getLetter,
    lpushLetters: lpushLetters,
    lrangeLetters: lrangeLetters,
    delLetters:delLetters,
    lpushLettersTypeHistory: lpushLettersTypeHistory,
    lrangeLettersTypeHistory: lrangeLettersTypeHistory,
    delLettersTypeHistory:delLettersTypeHistory
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

function getLetter(lid,fn){
    Redis.hgetall("letter:"+lid,function (err,letter) {
        if(err) throw new Error(err);
        fn(false,letter);
    });
}

function delLetter(id,fn){
    Redis.del("letter:"+id,function (err,res) {
        if(err) throw new Error(err);
        fn(false);
    });
}

function lpushLetters(game_id,letter_id,user_id,fn){
    Redis.lpush("letters:"+game_id,user_id+"::"+letter_id,function (err,res) {
        if(err) throw new Error(err);
        fn(false);
    });
}

function lrangeLetters(game_id,fn){
    Redis.lrange("letters:"+game_id,0,-1,function (err,letters) {
        if(err) throw new Error(err);
        fn(false,letters);
    });
}

function delLetters(game_id,fn){
    Redis.del("count_letters:"+game_id,function (err,res) {
        if(err) throw new Error(err);
        Redis.del("letters:"+game_id,function (err,res) {
            if(err) throw new Error(err);
            fn(false);
        });
    });
}

function lpushLettersTypeHistory(game_id,user_id,letter_keycode,GoodAnswer,fn){
    Redis.lpush("typeHistory:"+game_id,user_id+"::"+letter_keycode+"::"+GoodAnswer,function (err,res) {
        if(err) throw new Error(err);
        fn(false);
    });
}

function lrangeLettersTypeHistory(game_id,fn){
    Redis.lrange("typeHistory:"+game_id,0,-1,function (err,history) {
        if(err) throw new Error(err);
        fn(false,history);
    });
}

function delLettersTypeHistory(game_id,fn){
    Redis.del("typeHistory:"+game_id,function (err,res) {
        if(err) throw new Error(err);
        fn(false);
    });
}

