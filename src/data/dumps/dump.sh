#!/bin/bash

for TABLE in publicschools1415 roadswithtraffic14 roadswithtraffic14_gid_seq caschools geocodes headstart16 parcels privateschools1112 roadsnearheadstart16 roadsnearprivateschools1112 roadsnearpublicschools1415 schools_current_stacked schools_current_stacked_ogc_fid_seq
do
    echo $TABLE
    pg_dump -O -t $TABLE carbonwars > $TABLE.sql
    gzip $TABLE.sql
done
