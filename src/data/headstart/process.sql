ALTER TABLE publicschools1415 ADD COLUMN geom geography(Point,4326);

UPDATE publicschools1415 SET geom = ST_SetSRID(ST_MakePoint(cast(longcode AS double PRECISION),cast(latcode AS double PRECISION)),4326);

CREATE INDEX ON publicschools1415 USING GIST (geom);

ALTER TABLE roadswithtraffic14 ALTER COLUMN geom TYPE geography(multilinestring,4326) using ST_Force_2D(geom);

SELECT ncessch, latcode as latitude, longcode as longitude, gid, route_id, route_numb, state_code, through_la, f_system, aadt, aadt_combi, aadt_singl, ST_Distance(publicschools1415.geom,roadswithtraffic14.geom) as distance INTO roadsnearpublicschools1415 FROM publicschools1415, roadswithtraffic14 WHERE ST_DWithin(roadswithtraffic14.geom, publicschools1415.geom, 500);

\copy roadsnearpublicschools1415 to '/Users/cskees/Desktop/highway-schools/src/data/roadsnearpublicschools1415.csv' with CSV HEADER;