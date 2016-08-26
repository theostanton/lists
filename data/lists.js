/**
 * Created by theostanton on 26/08/2016.
 */
/**
 * Created by theostanton on 26/08/2016.
 */

var database = require('../database');

exports.getFromListId = function(list_id){
    return database.one(`SELECT * FROM list_table WHERE id = '${list_id}'`);
};

exports.getFromUserAndPlaylistId = function(user_id,playlist_id){
    return database.one(`SELECT * FROM list_table WHERE user_id = '${user_id}' AND playlist_id = '${playlist_id}'; `);
};

exports.getForUser = function (user_id) {
    return database.any(`SELECT * FROM list_table WHERE user_id = '${user_id}';`);
};



/*
TESTS

this.getForUser('theostanton').then(function (result) {
   console.log('result',result);
}).catch(function(error){
    console.log('error',error);
});

*/