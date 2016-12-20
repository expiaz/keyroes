var LetterModelRedis = require('./../model/redis/letter');
var GameModelRedis = require('./../model/redis/game');

var Letter = {
    Model:{
        Redis: LetterModelRedis
    },
    fetchLetterHistory: fetchLetterHistory,
    addLetterToHistory:addLetterToHistory
}

module.exports = Letter;

function addLetterToHistory(game_id,letter_id,user_id,fn){
    LetterModelRedis.saddLetters(game_id,letter_id,user_id,function (err,res) {
        if(err) return fn(true,res);
        fn(false,res);
    })
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
                var p = {
                    user:letters[letter_id],
                    letter:letter
                };
                ret_letter.push(p);
                if(ret_letter.length == array_letters.length) return fn(false,ret_letter);
            })
        });
    });
}