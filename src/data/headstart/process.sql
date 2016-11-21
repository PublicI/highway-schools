ALTER TABLE headstart16 ADD COLUMN geom geography(Point,4326);

UPDATE headstart16 SET geom = ST_SetSRID(ST_MakePoint(cast(longitude AS double PRECISION),cast(latitude AS double PRECISION)),4326);

CREATE INDEX ON headstart16 USING GIST (geom);

# ALTER TABLE roadswithtraffic14 ALTER COLUMN geom TYPE geography(multilinestring,4326) using ST_Force_2D(geom);

SELECT headstart16.id, latitude, longitude, gid, route_id, route_numb, state_code, through_la, f_system, aadt, aadt_combi, aadt_singl, ST_Distance(headstart16.geom,roadswithtraffic14.geom) as distance INTO roadsnearheadstart16 FROM headstart16, roadswithtraffic14 WHERE ST_DWithin(roadswithtraffic14.geom, headstart16.geom, 500);

\copy roadsnearheadstart16 to '/Users/cskees/Desktop/highway-schools/src/data/roadsnearheadstart16.csv' with CSV HEADER;