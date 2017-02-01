//jshint esnext:true

const _ = require('lodash'),
      async = require('async'),
      csv = require('csv-parser'),
      fs = require('fs'),
      maps = require('@google/maps'),
      pg = require('pg'),
      turf = require('@turf/turf'),
      util = require('util'),
      yaml = require('js-yaml'),
      kdbush = require('kdbush'),
      SphericalMercator = require('@mapbox/sphericalmercator');

const bbox = [ -124.4096, 32.5343, -114.1308, 42.0095 ]; // California? also Nevada

const interval = 500;

const z = 14;

const config = yaml.safeLoad(fs.readFileSync(`${__dirname}/../../config.yml`, 'utf8'));

const mapClient = maps.createClient({
    key: config.google.key
});

const merc = new SphericalMercator();

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
        location: [location.lat, location.lng],
        radius: location.radius,
        // rankby: 'distance'
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

        // client.query('INSERT INTO places VALUES ');

        if (response.json.results) {
            // console.log(util.inspect(response,{ depth: null }));
            response.json.results.forEach(function (result) {
                console.log(JSON.stringify(result));
            });

            if (response.json.results.length >= 200) {
                console.error('length 200: ',location);
            }
        }

        setTimeout(cb.bind(this, null), interval);
    });
}

function computeGrid(points, bbox, size, units, threshold) {
    // console.log('size:',size);

    //console.time('computeGrid');

    var finalGrid = turf.featureCollection([]);

    let grid = turf.hexGrid(bbox, size, units);

    grid.features.forEach(function (hex) {
        let centroid = turf.centroid(hex);
        let circle = turf.circle(centroid,size/2,32,units);

        // let pointCount = turf.within(points,turf.featureCollection([circle])).features.length;

        let circleBbox = turf.bbox(circle);
        let circlePixels = merc.px(centroid.geometry.coordinates,z);
        let bboxPixels = [merc.px([circleBbox[0],circleBbox[1]],z),merc.px([circleBbox[2],circleBbox[3]],z)];
        let radiusPixels = Math.max((Math.abs(bboxPixels[0][0]-
                                            bboxPixels[1][0])),
                                    (Math.abs(bboxPixels[0][1]-
                                            bboxPixels[1][1])));

        let pointCount = points.within(circlePixels[0],circlePixels[1],radiusPixels).length;

        //console.log('points:',pointCount);

        if (pointCount > threshold && size >= 0.2) {
            let smallerGrid = computeGrid(points, turf.bbox(circle), size/2, units, threshold);

            finalGrid.features = finalGrid.features.concat(smallerGrid.features.filter(function (gridCircle) {
                return typeof turf.intersect(gridCircle,circle) !== 'undefined';
            }).filter(function (gridCircle) {
                var keep = true;
                let area = turf.area(gridCircle);

                finalGrid.features.forEach(function (otherGridCircle) {
                    let intersect = turf.intersect(gridCircle,otherGridCircle);
                    if (typeof intersect !== 'undefined' && (turf.area(intersect)/area) > 0.8) {
                        keep = false;
                    }
                });
                return keep;
            }));
        }
        else {
            finalGrid.features.push(circle);
        }
    });

    //console.timeEnd('computeGrid');

    return finalGrid;
}

// console.log(JSON.stringify(computeGrid(points, bbox, size, units, threshold)));

pool.connect(function(err, client, done) {
    if (err) {
        return console.error(err);
    }

    client.query('SELECT ST_AsGeoJSON(geom) as point FROM publicschools1415 WHERE lstate = $1' +
        ' UNION SELECT ST_AsGeoJSON(geom) as point FROM privateschools1112 WHERE PSTABB = $1', ['CA'], function(err, result) {
        if (err) {
            return console.error(err);
        }

        done();
/*
        let points = turf.featureCollection(result.rows.map(function (row) {
            return turf.feature(JSON.parse(row.point));
        }));*/

        let pointIndex = kdbush(result.rows.map(function (row) {
            // console.log(merc.px(JSON.parse(row.point).coordinates,z));
            return merc.px(JSON.parse(row.point).coordinates,z);
        }));

        let grid = computeGrid(pointIndex, bbox, 25, 'miles', 100);

        console.error(grid.features.length);
/*
        let locations = grid.features.map(function (circle) {
            var centroid = turf.getCoord(turf.centroid(circle));

            return {
                lat: centroid[1],
                lng: centroid[0],
                radius: Math.sqrt(turf.area(circle)/Math.PI)
            };
        });

        // console.log(JSON.stringify(grid));
        async.mapSeries(locations,placeQuery,function () {
            console.error('done');
            //done();
        });*/
    });
});
