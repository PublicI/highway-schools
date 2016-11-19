ALTER TABLE publicschools1415 ADD COLUMN geom geography(Point,4326);

UPDATE publicschools1415 SET geom = ST_SetSRID(ST_MakePoint(cast(loncod AS double PRECISION),cast(latcod AS double PRECISION)),4326);

CREATE INDEX ON publicschools1415 USING GIST (geom);

ALTER TABLE roadswithtraffic14 ALTER COLUMN geom TYPE geography(multilinestring);

SELECT ncessch, schnam, recid, route_id, lname, fclass, ST_Distance(publicschools1415.geom,roads.geom) as distance, latcod as latitude, loncod as longitude, publicschools1415.geom INTO schoolsnearroads FROM publicschools1415, roads WHERE ST_DWithin(roads.geom, publicschools1415.geom, 500);

select distinct on (ncessch) ncessch, schnam, recid, route_id, lname, fclass, distance, latitude, longitude into schoolsnearroadsdistinct from schoolsnearroads order by ncessch, distance;

\copy schoolsnearroadsdistinct to '/Users/cskees/Desktop/highwayschools/src/data/schoolsnearroadsv3.csv' with CSV HEADER;

alter table schoolsnearroads alter column geom type geometry(point) USING geom::geometry(Point);

ALTER TABLE roadswithtraffic ALTER COLUMN geom TYPE geography(multilinestring);

SELECT ncessch, schnam, leanm, member, white, totfrl, lstree, lcity, lstate, lzip, coname, type, status, level, latcod as latitude, loncod as longitude, id, route_id, state_code, through_la, f_system_v, aadt_vn, ST_Distance(publicschools1415.geom,roadswithtraffic.geom) as distance, publicschools1415.geom INTO schoolsnearroads FROM publicschools1415, roadswithtraffic WHERE ST_DWithin(roadswithtraffic.geom, publicschools1415.geom, 500);

select distinct on (ncessch) * into schoolsnearroadsdistinct from schoolsnearroads order by ncessch, aadt_vn DESC NULLS LAST, through_la DESC NULLS LAST, f_system_v ASC NULLS LAST, distance ASC NULLS LAST;