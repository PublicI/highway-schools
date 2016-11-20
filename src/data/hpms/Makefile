DIR=.

all: download extract load clean

download:
	wget -P $(DIR)/downloads -r -l 2 -H -t 1 -nd -N -np -e robots=off --accept-regex 2014 http://www.fhwa.dot.gov/policyinformation/hpms/shapefiles.cfm; \
	rm $(DIR)/downloads/shapefiles.cfm

load:
	mkdir $(DIR)/extracts/; \
	FLAGS="-a"; \
	for file in $(DIR)/downloads/*.zip; do \
		extract_dir=$(DIR)/extracts/$$(basename "$$file" .zip); \
		unzip -u -d "$$extract_dir" $$file; \
		for file2 in "$$extract_dir"/*.shp; do \
			echo "$$file2"; \
			shp2pgsql $$FLAGS -s 4326 "$$file2" roadswithtraffic14 | psql -q; \
			FLAGS="-a"; \
			rm -rf $$extract_dir; \
		done; \
	done
