ALTER TABLE privateschools1112 ADD COLUMN geom geography(Point,4326);

UPDATE privateschools1112 SET geom = ST_SetSRID(ST_MakePoint(cast(longitude12 AS double PRECISION),cast(latitude12 AS double PRECISION)),4326);

CREATE INDEX ON privateschools1112 USING GIST (geom);

# ALTER TABLE roadswithtraffic14 ALTER COLUMN geom TYPE geography(multilinestring,4326) using ST_Force_2D(geom);

SELECT ppin, latitude12 as latitude, longitude12 as longitude, gid, route_id, route_numb, state_code, through_la, f_system, aadt, aadt_combi, aadt_singl, ST_Distance(privateschools1112.geom,roadswithtraffic14.geom) as distance INTO roadsnearprivateschools1112 FROM privateschools1112, roadswithtraffic14 WHERE ST_DWithin(roadswithtraffic14.geom, privateschools1112.geom, 500);

\copy roadsnearprivateschools1112 to '/Users/cskees/Desktop/highway-schools/src/data/roadsnearprivateschools1112.csv' with CSV HEADER;