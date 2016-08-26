/**
 * Created by theostanton on 25/08/2016.
 */

var querystring = require('querystring');
// var cookieParser = require('cookie-parser');
var request = require('request'); // "Request" library
var rp = require('request-promise');

var pgp = require('pg-promise')();
var database = require('../database');
var itemsTable = require('../data/items');

var access_token = 'BQATsv31pJTfI5OCR7vOYD-XmXwF4uDMwTCXiaLWWimFz2VFp0xiAzyk-U3hzcDeYvaF1mXJ5gHK7fqJ5i6Qnjd4szyh3o6Kaz8LyCyz2f8BiBBV7wYiMByd5vbg7pyza4xF9L183G7MstCZr6WbYTTMAPh5Rb2ugL4K';

var client_id = '92f1a296e55c470ab95ab7c0e5d123d6';
var client_secret = '1571832b11cd44c7af02af2eefc12dff';
var redirect_uri = 'https://pacific-headland-98039.herokuapp.com/spotify_callback';
// var redirect_uri = 'http://127.0.0.1:5000/spotify_callback';

var stateKey = 'spotify_auth_state';

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

function storeUser(id, access_token, refresh_token) {

    var data = {
        id: id,
        access_token: access_token,
        refresh_token: refresh_token
    };

    var query = 'UPDATE user_table SET access_token=${access_token}, refresh_token=${refresh_token} WHERE id=${id} RETURNING *;\
    INSERT INTO user_table(id,access_token,refresh_token) SELECT ${id}, ${access_token}, ${refresh_token} WHERE NOT EXISTS (SELECT 1 FROM user_table WHERE id=${id}) RETURNING *; ';

    return database.one(query, data);
}

function storePlaylists(user_id, playlists) {
    console.log('storePlaylists count=' + playlists.length);


    var ids = playlists.map(function (item) {
        return `${user_id}-${item.id}`
    });
    console.log(ids);

    var idsQuery = `SELECT id FROM list_table WHERE id IN ('${ids.join("','")}')`;
    console.log('idsQuery', idsQuery);

    var $scope = {};

    return database.any(idsQuery)
        .then(function (storedIds) {

            storedIds = storedIds.map(function (item) {
                return item.id;
            });

            console.log('storedIds', storedIds);

            var insertColumns = new pgp.helpers.ColumnSet(['id', 'playlist_id', 'name', 'user_id', 'public', 'uri', 'url', 'image_url'], {table: 'list_table'});
            var updateColumns = new pgp.helpers.ColumnSet(['?id', 'playlist_id', 'name', 'user_id', 'public', 'uri', 'url', 'image_url'], {table: 'list_table'});

            var valuesToUpdate = [];
            var valuesToInsert = [];
            playlists.forEach(function (playlist) {
                var value = {
                    id: `${user_id}-${playlist.id}`,
                    playlist_id: playlist.id,
                    user_id: user_id,
                    name: playlist.name,
                    image_url: playlist.images[0].url,
                    public: playlist.public,
                    uri: playlist.uri,
                    url: playlist.href
                };

                if (storedIds.indexOf(playlist.id) >= 0) {
                    valuesToUpdate.push(value);
                } else {
                    valuesToInsert.push(value);
                }
            });


            if (valuesToUpdate.length > 0) {
                $scope.updateQuery = pgp.helpers.update(valuesToUpdate, updateColumns) + ' WHERE v.id = t.id ';
            } else {
                $scope.updateQuery = false;
            }

            if (valuesToInsert.length == 0) {
                return true;
            }

            var insertQuery = pgp.helpers.insert(valuesToInsert, insertColumns);
            return database.none(insertQuery);
        })
        .then(function (insertResult) {
            console.log('insertResult', insertResult);
            if ($scope.updateQuery) {
                return database.none($scope.updateQuery);
            } else {
                return true;
            }

        });

}

exports.login = function (req, res) {
    console.log('spotify.login');

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
};


exports.storeTracksForPlaylistId = function (accessToken, userId, playlistId) {
    var opts = {
        url: `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        json: true
    };

    return rp.get(opts).then(function (tracks) {
        // console.log(tracks);
        return itemsTable.storeTracks(userId, playlistId, tracks.items)
            .then(function (result) {
                console.log('result', result);
            });
    }).catch(function (error) {
        console.error('Error fetching tracks',error);
        throw error;
    })
};


exports.callback = function (req, res) {

    console.log('spotify.callback');

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    // var state = req.query.state || null;
    // var storedState = req.cookies ? req.cookies[stateKey] : null;
    // if (false && state === null || state !== storedState) {
    //     res.redirect('/#' +
    //         querystring.stringify({
    //             error: 'state_mismatch'
    //         }));
    // }
    // res.clearCookie(stateKey);

    var opts = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    var $user_id;
    var $token;

    rp.post(opts)
        .then(function (tokenResult) {

            console.log('tokenResult', tokenResult);
            var opts = {
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': `Bearer ${tokenResult.access_token}`
                },
                json: true
            };
            return rp.get(opts)
                .then(function (meResult) {
                    console.log('meResult', meResult);
                    $token = tokenResult.access_token;
                    process.env.ACCESS_TOKEN = tokenResult.access_token;
                    $user_id = meResult.id;
                    return storeUser(meResult.id, tokenResult.access_token, tokenResult.refresh_token)
                })
                .catch(function (meError) {
                    console.error('meError', meError);
                    res.status(400).send({error: 'Error getting /me'})
                });
        })
        .catch(function (tokenError) {
            console.error('tokenError', tokenError);
            res.status(400).send({error: 'Error getting /token'})
        })
        .then(function (storeResult) {
            console.log('storeResult', storeResult);
            var opts = {
                url: 'https://api.spotify.com/v1/me/playlists',
                headers: {
                    'Authorization': `Bearer ${storeResult.access_token}`
                },
                json: true
            };
            return rp.get(opts);
        })
        .catch(function (storeError) {
            console.error('storeError', storeError);
            res.status(400).send({error: 'Error storing user'})
        })
        .then(function (playlistsResult) {
            console.log('playlistsResult', 'Too much to print');
            return storePlaylists($user_id, playlistsResult.items)
        })
        .catch(function (playlistsError) {
            console.error('playlistsError', playlistsError);
            console.error('message', playlistsError.message);
            console.error('stack', playlistsError.stack);
        })
        .then(function (finalResult) {
            var url = `web/${$user_id}/lists`
            console.log('finalResult', finalResult);
            console.log('Redirection to ' + url);
            res.redirect(url);
        })

};

exports.me = function (req, res) {

    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
        json: true
    };
    request.get(options, function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
            console.log(body);
        }
        res.send(body)
    })

};







