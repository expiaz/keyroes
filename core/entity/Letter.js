'use strict';

var constants = require('./../shared/constants');

class Letter{

    constructor(serialized){
        if(serialized === void 0){
            this.code = Math.floor(Math.random() * 255) % 2 ? Math.floor(Math.random() * 25) + 97 : Math.floor(Math.random() * 25) + 65;
            this.color = [Math.floor(Math.random() * 255) + 1, Math.floor(Math.random() * 255) + 1, Math.floor(Math.random() * 255) + 1];
            this.font = constants.letter.FONT[Math.floor(Math.random() * constants.letter.FONT.length)];
            this.x = Math.floor(Math.random() * ( 100 )) + 1;
            this.y = Math.floor(Math.random() * ( 100 )) + 1;
        }
        else{
            let props = serialized.split('::');
            this.code = parseInt(props[0]);
            this.color = props[1].map(function(c){ return parseInt(c) }).split(':');
            this.font = props[2];
            this.x = parseInt(props[3].split(':')[0]);
            this.y = parseInt(props[3].split(':')[1]);
        }
    }

    getCode(){
        return this.code;
    }

    getLetter(){
        return String.fromCharCode(this.code);
    }

    getFont(){
        return this.font;
    }

    getCoord(){
        return {
            x: this.x,
            y: this.y
        };
    }

    getColor(){
        return this.color;
    }

    serialize(){
        return this.code + "::" + this.color.join(':') + "::" + this.font + "::" + this.x + ":" + this.y;
    }

    objectize(){
        return {
            code: this.code,
            color: "rgb(" + this.color.join(',') + ")",
            font: this.font,
            x: this.x,
            y: this.y
        }
    }

}

Letter.isValid = function (code) {
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

module.exports = Letter;