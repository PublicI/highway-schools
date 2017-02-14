//jshint esnext:true

var async = require('async'),
    SphericalMercator = require('@mapbox/sphericalmercator'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    server = require('../routes/roads');

const tileDir = `${__dirname}/../data/tiles`;

function tilePath(tile) {
    return `${tile.layer}/${tile.z}/${tile.x}/${tile.y}.mvt`;
}

function readTile(tileDir,tile,cb) {
    const path = `${tileDir}/${tilePath(tile)}`;

    fs.readFile(path,'utf8',cb);
}

function writeTile(json, tile, cb){
    const path = `${tileDir}/${tilePath(tile)}`;

    mkdirp(path.split('/').slice(0,-1).join('/'),() => {
        fs.writeFile(path,json,cb);
    });
}

function getTile(tile, cb) {
    fs.exists(tileDir + '/' + tilePath(tile),function (exists) {

        if (!exists) {
            console.log('making ' + tilePath(tile));

            server.handle({
                method: 'get',
                url: `/tiles/${tilePath(tile)}`
            },{
                finish: null,
                on(type, fn) {
                    if (type == 'finish') {
                        this.finish = fn;
                    }
                },
                setHeader() {

                },
                end(buffer, encoding) {
                    if (buffer.byteLength > 0) {
                        writeTile(buffer,tile,cb);
                    }
                    else {
                        cb(null);
                    }

                    this.finish();
                }
            },err => {
                if (err) throw err;
                cb(null);
            });
        }
        else {
            console.log('skipping ' + tilePath(tile));

            cb(null);
        }
    });
}

function genTiles(tiles,cb) {
    async.mapSeries(tiles,getTile,cb);
}

function genGrid(layer,bbox,z) {
    const merc = new SphericalMercator({
        size: 256
    });

    let grid = [];

    const xy = merc.xyz(bbox, z);
    for (let curX = (xy.minX-1); curX <= (xy.maxX+1); curX++) {
        for (let curY = (xy.minY-1); curY <= (xy.maxY+1); curY++) {
            grid.push({
                layer: layer,
                x: curX,
                y: curY,
                z: z
            });
        }
    }

    return grid;
}

function checkGrid(tile,cb) {
    fs.exists(`${tileDir}/${tilePath(tile)}`,cb);
}

function genZoom(layer,bbox,z,cb) {
    const minGridZ = 9;
    let largerGridZ = z-5;

    if (largerGridZ < minGridZ) {
        largerGridZ = minGridZ;
    }

    async.waterfall([(cb) => {
                cb(null,genGrid(layer,bbox,largerGridZ));
            },(grid,cb) => {
                async.filterSeries(grid,checkGrid,cb);
            },(grid,cb) => {
                async.mapSeries(grid,(tile,cb) => {
                    genTiles(genGrid(filteredGrid,merc.bbox(tile.x,tile.y,tile.z),z),cb);
                },cb);
            }],cb);
}

function init(layer='blocks', bbox=[-170.1562,18.1459,-64.5117,72.1818], z=[11,11], cb=null) {
    var zs = [];

    for (let curZ = z[0]; curZ <= z[1]; curZ++) {
        zs.push(curZ);
    }

    async.mapSeries(zs,genZoom.bind(null,layer,bbox),function () {
        if (cb) {
            cb();
        }
    });
}

if (require.main === module) {
    init();
}

exports.makeTiles = init;
