/**
 * Created by theostanton on 25/08/2016.
 */


var pgp = require('pg-promise')();

var database = pgp('postgres://aewkpyifpnbmaz:NevfUaKfMT3BMYNCqjcDyyEqtk@ec2-54-221-225-242.compute-1.amazonaws.com:5432/d8holphnou70jb?ssl=true');
// var database = pgp(process.env.DATABASE_URL);
//
// exports.upsert = function () {
//     query('SELECT ${columns^} FROM ${table~}', {
//         columns: columns.map(pgp.as.name).join(),
//         table: 'Table Name'
//     });
// };
//
// exports.getOne = function (table_name, condition) {
//     return database.one('SELECT * FROM ${table~} WHERE ${condition}', {
//         table: table_name,
//         condition: condition
//     });
// };
//
// exports.one = function(query){
//     return database.one(query);
// };
//
// exports.insert = function (table_name, dict) {
//     var columns = Object.keys(dict);
//     var values = [];
//     columns.forEach(function (key) {
//         values.push(dict[key]);
//     });
//     columns = ` ${','.split(columns)} `;
//     values = ` ${','.split(values)} `;
//
//     console.log('columns', columns);
//     console.log('values', values);
//
//     // var formatted = formatting.format('INSERT INTO ${table~}( ${columns~} ) VALUES( ${values~} )', {
//     //     table: table_name,
//     //     columns: columns,
//     //     values: values
//     // });
//     //
//     // console.log('formatted',formatted);
//
//     return database.one('INSERT INTO ${table~}( ${columns} ) VALUES( ${values} )', {
//         table: table_name,
//         columns: columns,
//         values: ` '${"','".split(values)}' `
//     });
// };

// exports.executeSingle = function (query, callback) {
//     pg.connect(process.env.DATABASE_URL, function (err, client, done) {
//         client.query(query, function(err, result) {
//             done();
//             callback(err, result);
//         });
//     })
// };
//
// exports.execute = function (query, success,failed) {
//     pg.connect(process.env.DATABASE_URL, function (err, client, done) {
//         client.query(query, function(err, result) {
//             done();
//             if(err){
//                 failed(err);
//             } else {
//                 success(result);
//             }
//         });
//     })
// };

module.exports = database;