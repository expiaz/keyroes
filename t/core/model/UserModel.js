'use strict';

var sql = require('../shared/sql');
var errorHandler = require('../shared/ErrorHandler');

class UserModel{

    constructor(){
        this.sql = sql;
        this.table = 'user';
    }

    init(){

    }

    queryData(sql, bindings){
        if(bindings === void 0 || typeof bindings !== "object")
            bindings = {};
        return this.sql.promiseQuery(sql, bindings)
            .then(function (values) {
                //return the field informations
                if(values[0].length) return values[0][0];
                throw new Error('UserModel::queryData No data found ' + sql);
            });
    }

    queryAlter(sql, bindings){
        if(bindings === void 0 || typeof bindings !== "object")
            bindings = {};
        return this.sql.promiseQuery(sql, bindings)
            .then(function (values) {
                //return the altering informations
                return values[0];
            });
    }

    auth(login, password){
        let sql =`SELECT id FROM ${this.table} WHERE login = :login AND password = :password;`;
        return this.queryData(sql, {login: login, password: password})
            .then(function (values) {
                return values.id;
            })
            .catch(function (error) {
                errorHandler.error('UserModel::auth', arguments, error);
                return 0;
            });
    }

    add(userInformations){
        let sql = `INSERT INTO ${this.table} (id, username, password, ip, login, token) VALUES (:id, :username, :password, :ip, :login, :token);`;
        return this.queryAlter(sql, {id: null, username: userInformations.username, password: userInformations.password, ip: null, login: userInformations.login, token: null})
            .then(function (values) {
                return values.insertId;
            })
            .catch(function (error) {
                errorHandler.error('UserModel::add', userInformations, error);
                throw new Error('UserModel::add \n' + error);
            });
    }

    get(user){
        let sql = `SELECT * FROM ${this.table} WHERE id = :id;`;
        return this.queryData(sql, {id: user.getId()});
    }

    exists(user){

        return this.get(user)
            .then(function (values) {
                return values.id === user.getId();
            })
            .catch(function (error) {
                return false;
            });

    }

}

module.exports = new UserModel();