import {B as Bclass} from './b';
import {A} from './a';

var obj = new A();

console.log(obj.getMethodOfB());

console.log(obj.b.getName());

console.log(obj.getStaticOfB());

console.log(Bclass.getStaticOfB());