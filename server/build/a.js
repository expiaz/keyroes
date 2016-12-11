'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.A = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _b = require('./b');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var A = exports.A = function () {
    function A() {
        _classCallCheck(this, A);

        this.b = new _b.B('foo');
        this.a = 'A';
    }

    _createClass(A, [{
        key: 'getStaticOfB',
        value: function getStaticOfB() {
            return _b.B.getLetter();
        }
    }, {
        key: 'getMethodOfB',
        value: function getMethodOfB() {
            return this.b.getName();
        }
    }]);

    return A;
}();