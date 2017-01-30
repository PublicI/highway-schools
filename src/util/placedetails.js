//jshint esnext:true

const _ = require('lodash'),
      async = require('async'),
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

function placeQuery(place, cb) {
    mapClient.place({
        placeid: place.place.place_id
    }, (err, response) => {
        if (err) {
            console.error(err);
            cb(err);
            return;
        }
        if (response.json.status !== 'OK') {
            console.error(response.json.status);
            setTimeout(cb.bind(this, null), interval); // response.json.status
            return;
        }

        if (response.json.result) {
            console.log(JSON.stringify(response.json.result));
        }

        setTimeout(cb.bind(this, null), interval);
    });
}


pool.connect(function(err, client, done) {
    if (err) {
        return console.error(err);
    }

    client.query('SELECT * FROM places ORDER BY place->\'place_id\' LIMIT 40000 OFFSET 13509', [], function(err, result) {
        if (err) {
            return console.error(err);
        }

        done();

        async.mapSeries(result.rows,placeQuery,function () {
            console.error('done');
        });
    });
});
