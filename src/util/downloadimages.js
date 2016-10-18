var csv = require('csv-parser'),
    fs = require('fs'),
    request = require('request'),
    async = require('async'),
    yaml = require('js-yaml');

var interval = 2000;

function getImage (school,cb) {
    var url = 'https://maps.googleapis.com/maps/api/staticmap?center=' + school.latitude +
                ',' + school.longitude + '&zoom=16&size=400x400&scale=2&maptype=hybrid&key=' + config.google.key;

    console.log('downloaded ' + school.ncessch + ' at ' + school.latitude + ', ' + school.longitude);

    var r = request(url);
    r.on('response', function (resp) {
        if (resp.statusCode == 200) {
            r.on('error', function(err) {
                console.log(err);

                setTimeout(cb,interval);
            })
            .on('end',function () {
                console.log('downloaded');

                setTimeout(cb,interval);
            })
            .pipe(fs.createWriteStream(__dirname + '/../img/schools/' + school.ncessch + '.png'));
        }
        else {
            console.log('not found');
            setTimeout(cb,interval);
        }
    });
}

var config = yaml.safeLoad(fs.readFileSync(__dirname + '/../../config.yml', 'utf8'));

var q = async.queue(getImage,1);

fs.createReadStream(__dirname + '/../data/hightrafficschools.csv')
    .pipe(csv())
    .on('data', function(school) {
        q.push(school);
    })
    .on('end',function () {
        q.drain = function () {
            console.log('done');
        };
    });
