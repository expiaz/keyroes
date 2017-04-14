'use strict';

class Helper{

    isValidLetter(code){
        return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    }

}

module.exports = new Helper();