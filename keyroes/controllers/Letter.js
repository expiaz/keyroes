var LetterModelRedis = require('./../model/redis/letter');

var Letter = {
    Model:{
        Redis: LetterModelRedis
    },
    fetchLetterHistory: fetchLetterHistory,
    addLetterToHistory:addLetterToHistory,
    fetchLetterTypeHistory:fetchLetterTypeHistory,
    addLetterToTypeHistory:addLetterToTypeHistory
}

module.exports = Letter;

function addLetterToHistory(game_id,letter_id,user_id,fn){
    LetterModelRedis.lpushLetters(game_id,letter_id,user_id,function (err,res) {
        if(err) return fn(true,res);
        fn(false,res);
    });
}

function fetchLetterHistory(game_id,fn){
    LetterModelRedis.lrangeLetters(game_id,function (err,letters) {
        if(err) return fn(true,letters);
        var ret = [];
        letters.forEach(function (l) {
            var indexs = l.split("::");
            LetterModelRedis.getLetter(indexs[1],function (err,letter) {
                if(err) return fn(true,letter);
                ret.push({
                    user:indexs[0],
                    letter:letter.char
                });
                if(letters.length == ret.length) return fn(false,ret);
            });
        });
    });
}

function addLetterToTypeHistory(game_id,user_id,letter_keycode,goodanswer,fn){
    LetterModelRedis.lpushLettersTypeHistory(game_id,user_id,letter_keycode,goodanswer,function (err,res) {
        if(err) return fn(true,res);
        fn(false,res);
    });
}

function fetchLetterTypeHistory(game_id,fn){
    LetterModelRedis.lrangeLettersTypeHistory(game_id,function (err,letters) {
        if(err) return fn(true,letters);
        var ret = [];
        letters.forEach(function (l) {
            var indexs = l.split("::");
            ret.push({
                user:indexs[0],
                letter:indexs[1],
                answer:parseInt(indexs[2]) ? true : false
            });
            if(letters.length == ret.length) return fn(false,ret);
        });
    });
}