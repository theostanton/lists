/**
 * Created by theostanton on 26/08/2016.
 */

var database = require('../database');

exports.get = function(user_id){
    return database.one(`SELECT * FROM user_table WHERE id = '${user_id}'`);
};

exports.getToken = function(user_id){
    return database.one(`SELECT access_token FROM user_table WHERE id = '${user_id}'`);
};

exports.getAll = function(){
    return database.one('SELECT * FROM user_table');
};
