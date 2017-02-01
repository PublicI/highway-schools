//jshint esnext:true

const _ = require('lodash'),
      maps = require('@google/maps'),
      csv = require('csv-parser'),
      fs = require('fs'),
      pg = require('pg'),
      async = require('async'),
      yaml = require('js-yaml'),
      util = require('util');

const interval = 200;

const config = yaml.safeLoad(fs.readFileSync(`${__dirname}/../../config.yml`, 'utf8'));

const client = maps.createClient({
    key: config.google.key
});

function geocode(school,cb) {
    const address = [school.lstree,school.lcity,school.lstate,school.lzip].join(', ').trim();

    client.geocode({
        address: address,
        components: {
            country: 'US'
        },
    }, (err, response) => {
        if (err) {
            console.error(err);
            cb(null);
            return;
        }

        if (response.json.results) {
            response.json.results.forEach(function (result) {
                result.ncessch = school.ncessch;

                console.log(JSON.stringify(result));
            });
        }

        setTimeout(cb.bind(this,null),interval);
    });
}

const q = async.queue(geocode,1);

let count = 0;

const pool = new pg.Pool({
    user: config.db.user,
    database: config.db.name,
    password: config.db.pass,
    host: config.db.host,
    port: config.db.port
});

pool.connect(function(err, client, done) {
    if (err) {
        return console.error(err);
    }

    client.query('SELECT ncessch,lstree,lcity,lstate,lzip FROM publicschools1415 WHERE lstate != $1',['CA'], function(err, result) {
        if (err) {
            return console.error(err);
        }

        done();

        result.rows.forEach(function (row) {
            q.push(row);
        });

        q.drain = () => {
            console.error('done');
        };

    });
});

/*
fs.createReadStream(`${__dirname}/../data/caschools.csv`)
    .pipe(csv())
    .on('data', school => {
        if (count >= 8172) {
            q.push(school);
        }

        count++;
    })
    .on('end',() => {
        q.drain = () => {
            console.error('done');
        };
    });*/
