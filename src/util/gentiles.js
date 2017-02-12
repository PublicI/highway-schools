var async = require('async'),
    SphericalMercator = require('@mapbox/sphericalmercator'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    server = require('../routes/roads');

function tilePath(tile) {
    return tile.layer + '/' + tile.z + '/' + tile.x + '/' + tile.y + '.mvt';
}

function readTile(tileDir,tile,cb) {
    var path = tileDir + '/' + tilePath(tile);

    fs.readFile(path,'utf8',cb);
}

function writeTile(tileDir, json, tile, cb){
    var path = tileDir + '/' + tilePath(tile);

    mkdirp(path.split('/').slice(0,-1).join('/'),function () {
        fs.writeFile(path,json,cb);
    });
    
}

function getTile(tile, cb) {
    // fs.exists(tile.dir + '/' + tilePath(tile),function (exists) {

        // if (!exists) {
            // console.log('making ' + tilePath(tile));

            server.handle({
                method: 'get',
                url: '/tiles/' + tilePath(tile)
            },{
                finish: null,
                on: function (type,fn) {
                    if (type == 'finish') {
                        this.finish = fn;
                    }
                },
                setHeader: function () {

                },
                end: function (buffer,encoding) {
                    if (buffer.byteLength > 0) {
                        writeTile(tile.dir,buffer,tile,cb);
                    }
                    else {
                        cb(null);
                    }

                    this.finish();
                }
            },function (err) {
                if (err) throw err;
                cb(null);
            });
/*
        }
        else {
            console.log('skipping ' + tilePath(tile));

            cb(null);
        }
    });
*/
}

function init(layer,bbox,z,cb) {

    var tileDir = __dirname + '/../data/tiles';
    layer = layer || 'blocks';
    bbox = bbox || [-170.1562,18.1459,-64.5117,72.1818];
    z = z || [11,11];

    var merc = new SphericalMercator({
        size: 256
    });

    var q = async.queue(getTile,3);
    var queued = 0;
    var processed = 0;

    for (var curZ = z[0]; curZ <= z[1]; curZ++) {
        var xy = merc.xyz(bbox, curZ);
        for (var curX = (xy.minX-1); curX <= xy.maxX; curX++) {
            for (var curY = (xy.minY-1); curY <= xy.maxY; curY++) {
                queued++;

                q.push({
                    dir: tileDir,
                    layer: layer,
                    z: curZ,
                    x: curX,
                    y: curY
                });

            }
        }
    }

    q.drain = function (err) {
        if (typeof cb !== 'undefined' && cb) {
            if (err) {
                cb(err);
                return;
            }

            cb(null);
        }
        else {
            console.log('done');
        }
    };
}

if (require.main === module) {
    init();
}

exports.makeTiles = init;
