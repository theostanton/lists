/**
 * Created by theostanton on 26/08/2016.
 */

var router = require('express').Router({mergeParams: true});


var listRouter = require('./lists');
router.use('/:user_id/lists', listRouter);

module.exports = router;