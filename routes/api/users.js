/**
 * Created by theostanton on 25/08/2016.
 */
var router = require('express').Router({mergeParams: true});
var userTable = require('../../data/users');

router.route('/').get(function (req, res) {
    console.log('users.findAll');

    userTable.getAll()
        .then(
            function (result) {
                console.log({users: result});
                res.send({results: result})
            })
        .catch(
            function (error) {
                console.error({err: error});
                res.status(403).send({error: error});
            });
});

router.route('/:user_id').get(function (req, res) {

    var userId = req.params.user_id;

    console.log('users.findById userId=' + userId);


    if (!userId) {
        res.send('No userId given');
    }

    userTable.get(userId)
        .then(
            function (result) {
                console.log(`result= ${result}`);
                if (result) {
                    console.log(result);
                    res.send(result)
                } else {
                    res.status(403).send({error: 'No users for userId=' + userId});
                }
            })
        .catch(
            function (error) {
                console.error({err: error});
                res.status(403).send({error: error});
            });
});

var listRouter = require('./lists');
router.use('/:user_id/lists', listRouter);

module.exports = router;