'use strict';

var Letter = require('./../entity/Letter');

class LetterFactory{

    init(){

    }

    create(){
        return new Letter();
    }

    unserialize(serializedLetter){
        return new Letter(serializedLetter);
    }

}

module.exports = new LetterFactory();