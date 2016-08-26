/**
 * Created by theostanton on 25/08/2016.
 */


var router = require('express').Router({mergeParams: true});
var itemsTable = require('../../data/items');
var userTable = require('../../data/users');
var spotify = require('../spotify');

router.route('/').get(function (req, res) {

    console.log('get items');

    var userId = req.params.user_id;

    if (!userId) {
        res.status(400).send({error: 'No user_id received'})
    }
    var playlistId = req.params.playlist_id;

    if (!playlistId) {
        res.status(400).send({error: 'No playlist_id received'})
    }

    console.log('go');
    itemsTable.countForPlaylistAndUserId(playlistId, userId).then(function (itemCount) {
        console.log('itemCount', itemCount);
        if (itemCount.count == 0) {
            console.log('itemCount.count==0');

            return userTable.get(userId).then(function (user) {
                return spotify.storeTracksForPlaylistId(user.access_token, user.id, playlistId).then(
                    function (state) {
                        console.log('post storage state=',state)
                        return 'Stored';
                    }
                )
            });
        } else {
            return 'Already stored'
        }
    }).then(function(state){
        console.log('finally: state=' + state);
        return itemsTable.getFromListId(playlistId).then(function (listsItems) {
            console.log('listItems', listsItems);
            // res.render('partials/items', {items: listsItems, user: {name: 'Theo'}});
            return res.send(listsItems);
        }).catch(function (error) {
            console.log('Error getting items for playlist',error);
            res.status(500).send({error: 'Couldnt get lists items', exception: error})
        });
    })


});
//
// router.route('/:list_id').get(function (req, res) {
//
//     var listId = res.params.list_id;
//
//     if (!list_id) {
//         res.status(400).send({error: 'No list_id received'})
//     }
//
//     db.execute(`SELECT * FROM list_table WHERE list_id = '${listId}'`,
//         function (result) {
//
//             if (result.rows.length == 0) {
//                 console.log('No lists for listId=' + listId);
//                 res.send({message: 'No lists yet'})
//             }
//
//             console.log(`Got ${result.rows} for listId=${listId}`);
//
//             res.send({lists: result.rows})
//
//         },
//         function (error) {
//             res.status(403).send({error: 'Error fetching list', exception: error});
//         })
// });

module.exports = router;
