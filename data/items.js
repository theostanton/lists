/**
 * Created by theostanton on 26/08/2016.
 */
/**
 * Created by theostanton on 26/08/2016.
 */

var pgp = require('pg-promise')();
var database = require('../database');

exports.getFromListId = function(playlist_id){
    return database.any(`SELECT * FROM item_table WHERE playlist_id = '${playlist_id}'`);
};

exports.countForPlaylistAndUserId = function (playlistId,userId) {
    console.log('countForPlaylistId playlistId=' + playlistId);
    return database.one(`SELECT COUNT(*) FROM item_table WHERE playlist_id = '${playlistId}' AND user_id = '${userId}'`);
};


exports.storeTracks = function(userId,playlistId,tracks) {
    console.log('storeTracks tracks=',tracks);
    var columns = new pgp.helpers.ColumnSet([ 'user_id', 'playlist_id','track_id'], {table: 'item_table'});
    var values = tracks.map(function(track){
        return {
            user_id:userId,
            playlist_id:playlistId,
            track_id : track.track.id
        }
    });
    var query = pgp.helpers.insert(values,columns);
    return database.none(query);
};