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
    LetterModelRedis.saddLetters(game_id,letter_id,user_id,function (err,res) {
        if(err) return fn(true,res);
        fn(false,res);
    });
}

function fetchLetterHistory(game_id,fn){
    LetterModelRedis.hgetallLetters(game_id,function (err,letters) {
        if(err) return fn(true,letters);
        var array_letters = [],
            ret_letter = [];

        for(var letter_id in letters){
            array_letters.push(letter_id);
        }
        array_letters.forEach(function (lid) {
            LetterModelRedis.getLetter(lid,function (err,letter) {
                if(err) return fn(true,letter);
                var p = {
                    user:letters[lid],
                    letter:letter
                };
                ret_letter.push(p);
                if(ret_letter.length == array_letters.length) return fn(false,ret_letter.reverse());
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
        console.log(letters);
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