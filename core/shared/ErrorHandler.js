'use strict';


class ErrorHandler{

    constructor(){
        this.stack = [];
    }

    error(){
        var args = Array.prototype.slice.call(arguments);
        this.stack.push(args);
        if(process.env.NODE_ENV === 'DEV')
            console.error(args.join("\n"));
    }

    printStack(){
        console.error('ErrorHandler::printStack');
        for(let e of this.stack){
            if(Array.isArray(e)){
                console.error(e[0]);
                for(let i = 1; i < e.length; i++)
                    console.error('    ' + e[i]);
            }
            else
                console.error(e);
        }
    }

}

module.exports = new ErrorHandler();