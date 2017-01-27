//jshint esnext:true

const _ = require('lodash'),
    async = require('async'),
    csv = require('csv-parser'),
    fs = require('fs'),
    maps = require('@google/maps'),
    pg = require('pg'),
    util = require('util'),
    yaml = require('js-yaml');

const interval = 500;

const config = yaml.safeLoad(fs.readFileSync(`${__dirname}/../../config.yml`, 'utf8'));

const mapClient = maps.createClient({
    key: config.google.key
});

const pool = new pg.Pool({
    user: config.db.user,
    database: config.db.name,
    password: config.db.pass,
    host: config.db.host,
    port: config.db.port
});

function placeQuery(location, cb) {

    mapClient.placesRadar({ // placesNearby({
        type: 'school',
        location: [location.latcode, location.longcode],
        radius: 50000,
        rankby: 'distance'
    }, (err, response) => {
        if (err) {
            console.error(err);
            cb(err);
            return;
        }
        if (response.json.status !== 'OK') {
            console.error(response.json.status);
            cb(response.json.status);
            return;
        }

        // client.query('INSERT INTO places VALUES ');

        if (response.json.results) {
            console.log(util.inspect(response,{ depth: null }));
            /*
            response.json.results.forEach(function (result) {
                console.log(JSON.stringify(result));
            });*/
        }

        setTimeout(cb.bind(this, null), interval);
    });
}

pool.connect(function(err, client, done) {
    if (err) {
        return console.error(err);
    }

    client.query('SELECT * FROM publicschools1415 ORDER BY random() LIMIT 1', [], function(err, result) {
        if (err) {
            return console.error(err);
        }

        async.mapSeries(result.rows,placeQuery,function () {
            done();
        });
    });
});
