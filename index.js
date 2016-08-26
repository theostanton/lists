var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

var db = require('./database');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    var user = {name: 'Theo'};
    response.render('pages/home', {user: user});
});

// app.get('/users/:id',function|(req, res){
//     var user = users.
//
//     res.render('pages/user',{})
// }

app.get('/db', function (request, response) {

    db.execute('SELECT * FROM test_table', function (err, result) {

        console.log({err: err, result: result.rows});
        if (err) {
            console.error(err);
            response.send("Error " + err);
        }
        else {
            response.render('./pages/db', {results: result.rows});
        }
    });
});

app.get('/times', function (request, response) {
    var result = '';
    var times = process.env.TIMES || 5;
    for (i = 0; i < times; i++)
        result += i + ' ';
    response.send(result);
});

var usersRouter = require('./routes/api/users');
app.use('/api/users',usersRouter);

var spotify = require('./routes/spotify');
app.get('/login', spotify.login);
app.get('/spotify_callback', spotify.callback);
app.get('/me', spotify.me);


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});



