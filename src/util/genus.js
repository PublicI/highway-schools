var gentiles = require('./gentiles.js'),
    async = require('async');

var config = {
    minZoom: 9,
    maxZoom: 16,
    parts: [{
        name: 'Lower 48',
        bbox: [
            [49.681410, -66.272972],
            [25.561655, -125.291523]
        ]
    }, {
        name: 'Alaska',
        bbox: [
            [70.873268, -128.675313],
            [50.930309, -173.279804]
        ]
    }, {
        name: 'Hawaii',
        bbox: [
            [22.876813, -153.812032],
            [18.603956, -160.623555]
        ]
    }]
};

function makePart(part, cb) {
    console.log('');
    console.log('=== ' + part.name + ' ===');

    gentiles.makeTiles('roads', [part.bbox[0][1], part.bbox[0][0],
                                 part.bbox[1][1], part.bbox[1][0]], [config.minZoom, config.maxZoom], cb);
}

async.mapSeries(config.parts,makePart,function () {
    console.log('done');
});
