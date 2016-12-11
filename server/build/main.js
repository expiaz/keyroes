'use strict';

var _b = require('./b');

var _a = require('./a');

var obj = new _a.A();

console.log(obj.getMethodOfB());

console.log(obj.b.getName());

console.log(obj.getStaticOfB());

console.log(_b.B.getStaticOfB());