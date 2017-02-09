//jshint esnext:true

const express = require('express'),
    Tilesplash = require('tilesplash');

const config = yaml.safeLoad(fs.readFileSync(`${__dirname}/../../config.yml`, 'utf8'));

const router = express.Router();

const ts = new Tilesplash({
    user: config.db.user,
    database: config.db.name,
    password: config.db.pass,
    host: config.db.host,
    port: config.db.port
});

ts.layer('roads', (tile, render) => {
    render('SELECT gid, ' +
            'ST_AsGeoJSON(ST_Intersection(geom,!bbox_4326!)) AS the_geom_geojson ' +
            'FROM roadswithtraffic14 ' +
            'WHERE ST_Intersects(geom, !bbox_4326!) ' +
            'AND aadt > 30000'); // .replace('!area_threshold!',30)
});

express.static.mime.define({'application/json': ['topojson']});

router.use('/tiles',ts.server);

module.exports = router;