//jshint esnext:true

const fs = require('fs'),
    express = require('express'),
    Tilesplash = require('tilesplash'),
    yaml = require('js-yaml');

const config = yaml.safeLoad(fs.readFileSync(`${__dirname}/../../config.yml`, 'utf8'));

const router = express.Router();

const ts = new Tilesplash({
    user: config.db.user,
    database: config.db.name,
    password: config.db.pass,
    host: config.db.host,
    port: config.db.port
});

const buffer = 152.4;

ts.layer('roads', (tile, render) => {
    render({
        hightraffic: 'SELECT ST_AsGeoJSON(ST_Union(ST_Intersection(ST_Buffer(geom,' + buffer + ')::geometry,!bbox_4326!))) AS the_geom_geojson ' +
            'FROM roadswithtraffic14 ' +
            'WHERE ST_Intersects(geom, ST_Expand(!bbox_4326!,0.0011)) ' +
            'AND aadt >= 30000',
        truckroute: 'SELECT CASE WHEN ST_IsEmpty(ST_Difference(truckroute.geom,hightraffic.geom)) THEN null ELSE ST_AsGeoJSON(COALESCE(ST_Difference(truckroute.geom,hightraffic.geom),truckroute.geom)) END AS the_geom_geojson ' +
            'FROM (SELECT ST_Union(ST_Intersection(ST_Buffer(geom,' + buffer + ')::geometry,!bbox_4326!)) AS geom ' +
            'FROM roadswithtraffic14 ' +
            'WHERE ST_Intersects(geom, ST_Expand(!bbox_4326!,0.0011)) ' +
            'AND aadt >= 30000) as hightraffic, ' +
            '(SELECT ST_Union(ST_Intersection(ST_Buffer(geom,' + buffer + ')::geometry,!bbox_4326!)) AS geom ' +
            'FROM roadswithtraffic14 ' +
            'WHERE ST_Intersects(geom, ST_Expand(!bbox_4326!,0.0011)) ' +
            'AND aadt >= 10000 AND aadt_combi+aadt_singl >= 500 AND aadt < 30000) as truckroute'
    });
});

express.static.mime.define({ 'application/json': ['topojson'] });

router.use('/tiles', ts.server);

module.exports = router;
