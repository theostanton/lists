/**
 * Created by theostanton on 25/08/2016.
 */

var db = require('./database');


var data = {
    name: 'A name',
    user_id: 'The user ID',
    playlist_id: 'The playlist ID',
};

db.one('INSERT INTO list_table(name, user_id, playlist_id) values(${name}, ${user_id}, ${playlist_id}) returning *;', data)
    .then(function (result) {
        console.log('result', result);
    }).catch(function (error) {
    console.error('error', error);
});


console.log('doneee');


/*

 // console.log(db);

 var query1 = `INSERT INTO list_table(name,user_id,playlist_id) values('The name','the_user_id','the_playlist_id') RETURNING id;`;
 var query4 = `INSERT INTO list_table(name,user_id,playlist_id) values('The forth name','the_user_id','the_playlist_id') RETURNING id;`;

 function succcessPromise(variable) {
 return new Promise(function (resolve, reject) {
 if (true) {
 resolve('cause its true variable = ' + variable);
 } else {
 reject('impossible variable = ' + variable);
 }
 });
 }


 function failurePromise(variable) {
 return new Promise(function (resolve, reject) {
 if (false) {
 resolve('impossible variable=' + variable);
 } else {
 reject('cause its false variable=' + variable);
 }
 });
 }
 successPromise.then(
 function (result) {
 console.log('succcessPromise result', result);
 failurePromise.then(
 function (result) {
 console.log('failurePromise result', result);
 },
 function (error) {
 console.log('failurePromise error', error);
 }
 );
 },
 function (error) {

 console.log('succcessPromise error', error);
 }
 );
 */

/*

 succcessPromise('*one*').then(function (result) {
 console.log('successPromise.then result =', result);
 return succcessPromise('*two*');
 }).then(function (result) {
 console.log('successPromise.then result =', result);
 return succcessPromise('*three*');
 }).then(function (result) {
 console.log('successPromise.then result =', result);
 return failurePromise('*four*');
 }).catch(function (error) {
 console.error('mid catch error = ' + error);
 return 'Catch return';
 }).then(function (result) {
 console.log('failurePromise.then result =', result);
 return succcessPromise('*five*');
 }).then(function (result) {
 console.log('succcessPromise.then result =', result);
 return failurePromise('*six*');
 }).catch(function (error) {
 console.error('end catch error = ' + error);
 });
 */


/*
 db.any(query1)
 .then(function (data) {
 console.log("query1 success", data);
 var query2 = `INSERT INTO list_table(name,user_id,playlist_id) values('The second name','the_user_id','the_playlist_id') RETURNING id;`;
 db.any(query2).then(
 function (data) {
 console.log("query2 success", data);
 }, function
 (error) {
 console.log("query2 error:", error);
 })
 },
 function (error) {
 console.log("query1 error:", error);
 })
 .then(function (result) {
 console.log('result', result);
 var query3 = `INSERT INTO list_table(name,user_id,playlist_id) values('The third name','the_user_id','the_playlist_id') RETURNING id;`;
 return db.any(query3).then(
 function (data) {
 console.log("query3 success", data);
 return 'A result';
 }, function (error) {
 console.log("query3 error:", error);
 return 'An error result';
 })
 })
 .then()
 .then(
 function (data) {
 console.log("area5 ", data);
 });

 */