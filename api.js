'use strict';

class Person{
    constructor(name,weight,height){
        this.name = name;
        this.weight = weight;
        this.height = height;
    }

    Private(){
        console.log(a);
    }

    Public(){
        console.log("public");
    }

    CallPrivate(){
        this.Private();
    }

}

console.log(new Person('j',2,2).Private())