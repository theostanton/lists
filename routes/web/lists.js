/**
 * Created by theostanton on 26/08/2016.
 */

var router = require('express').Router({mergeParams: true});

var listsTable = require('../../data/lists');

router.route('/').get(function(req,res){

    var userId = req.params.user_id;

    if (!userId) {
        res.status(400).send({error: 'No user_id received'});
        return
    }

    listsTable.getForUser(userId).then(function(usersLists){
        res.render('pages/lists',{lists:usersLists,user:{name:'Theo'}});
    }).catch(function(error){
        res.status(500).send({error:'Couldnt get users lists',exception:error})
    });
});

router.route('/:playlist_id').get(function(req,res){

    console.log('get playlist');

    var userId = req.params.user_id;

    if (!userId) {
        res.status(400).send({error: 'No user_id received'});
        return
    }
    var playlistId = req.params.playlist_id;

    if (!playlistId) {
        res.status(400).send({error: 'No playlist_id received'});
        return
    }

    listsTable.getFromUserAndPlaylistId(userId,playlistId).then(function(usersList){
        res.render('pages/list',{list:usersList,user:{name:'Theo',id:userId}});
    }).catch(function(error){
        console.error(error);
        res.status(500).send({error:'Couldnt get users list',exception:error})
    });
});

var itemRouter = require('./items');
router.use('/:user_id/lists/:list_id/items', itemRouter);

module.exports = router;