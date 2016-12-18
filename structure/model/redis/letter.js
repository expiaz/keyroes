var Redis = require('./server');

var Letter = {
    addLetter:addLetter,
    getLetter:getLetter,
    setLetter:setLetter,
    delLetter:delLetter
}

module.exports = Letter;


/**
 * Set the hash letter:letter_id(game_id+Ascii+Count) and complete the hash letters:game_id (hmset)
 * @param game_id
 * @param letter
 * @param fn
 */
function addLetter(game_id,letter,fn){
    Redis.incr("count_letters:"+game_id,function (err,res) {
        if(err) throw(err);
        Redis.get("count_letters:"+game_id,function (err,letters_count) {
            if(err) throw(err);
            var lid = game_id+""+letter.code+""+letters_count;
            Redis.hmset("letters:"+game_id,lid,0,function (err,res) {
                if(err) throw(err);
                Redis.hmset("letter:"+lid,letter,function (err,res) {
                    if(err) throw(err);
                    fn(false,"Letter added");
                });
            });
        });
    });
}

function getLetter(lid,fn){
    Redis.get
}