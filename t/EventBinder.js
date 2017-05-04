var UserModel = require('./core/model/UserModel');
var User = require('./core/entity/User');
var ErroHandler = require('./core/shared/ErrorHandler');

/*
UserModel.exists(new User(4, '1.2', 'fzenfoR', 'jean'))
    .then(function (rep) {
        console.log(rep);
    });
*/



UserModel.add({
    username: 'jjh',
    password: 'abc',
    login: 'faeoifh42'
})
    .then(function (state) {
        console.log(state);
    })
    .catch(function(e){
        console.log(e);
        ErroHandler.printStack();
    });

