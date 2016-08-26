/**
 * Created by theostanton on 25/08/2016.
 */


var db = require('../../database');
var router = require('express').Router({mergeParams: true});

router.route('/').get(function (res, req) {

    var userId = res.params.user_id;

    if (!userId) {
        res.status(400).send({error: 'No user_id received'})
    }

    db.execute(`SELECT * FROM list_table WHERE user_id = '${userId}'`,
        function (result) {

            if (result.rows.length == 0) {
                console.log('No lists for userId=' + userId);
                res.send({message: 'No lists yet'})
            }

            console.log(`Got ${result.rows} for ${userId}`);

            res.send({lists: result.rows})

        },
        function (error) {
            res.status(403).send({error: 'Error fetching list', exception: error});
        })
});

router.route('/:list_id').get(function (req, res) {

    var listId = res.params.list_id;

    if (!list_id) {
        res.status(400).send({error: 'No list_id received'})
    }

    db.execute(`SELECT * FROM list_table WHERE list_id = '${listId}'`,
        function (result) {

            if (result.rows.length == 0) {
                console.log('No lists for listId=' + listId);
                res.send({message: 'No lists yet'})
            }

            console.log(`Got ${result.rows} for listId=${listId}`);

            res.send({lists: result.rows})

        },
        function (error) {
            res.status(403).send({error: 'Error fetching list', exception: error});
        })
});

module.exports = router;
