//jshint esnext:true

const _ = require('lodash'),
      maps = require('@google/maps'),
      csv = require('csv-parser'),
      fs = require('fs'),
      async = require('async'),
      yaml = require('js-yaml'),
      util = require('util');

const interval = 500;

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
            cb(err);
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
            console.log('done');
        };
    });
