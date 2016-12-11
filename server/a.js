import {B} from './b';

export class A {
    constructor(){
        this.b = new B('foo');
        this.a = 'A';
    }

    getStaticOfB(){
        return B.getLetter();
    }

    getMethodOfB(){
        return this.b.getName();
    }
}