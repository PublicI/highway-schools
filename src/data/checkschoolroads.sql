select roadsnearpublicschools1415.state_code, latitude, longitude, roadsnearpublicschools1415.route_numb, roadsnearpublicschools1415.aadt, distance, roadswithtraffic14.geom::geometry from roadsnearpublicschools1415 join roadswithtraffic14 using (gid) where ncessch in (select max(ncessch) from publicschools1415 group by lstate) order by roadsnearpublicschools1415.aadt desc