#!/bin/bash

osm2pgsql -H localhost -P 3333 -U czubakskees -d environment schools.osm
osm2pgsql -H localhost -P 3333 -U czubakskees -d environment --append schools2.osm
osm2pgsql -H localhost -P 3333 -U czubakskees -d environment --append schools3.osm