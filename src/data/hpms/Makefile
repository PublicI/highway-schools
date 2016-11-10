DIR=.

all: download extract load clean

download:
	wget -P $(DIR)/downloads -r -l 2 -H -t 1 -nd -N -np -e robots=off --accept-regex 2015 http://www.fhwa.dot.gov/policyinformation/hpms/shapefiles.cfm; \
	rm $(DIR)/downloads/shapefiles.cfm

extract:
	mkdir $(DIR)/extracts/; \
	for file in $(DIR)/downloads/*.zip; do \
		unzip -u -d $(DIR)/extracts/$$(basename "$$file" .zip) $$file; \
	done

load:
	FLAGS="-a"; \
	for file in $(DIR)/extracts/*; do \
		if [ -d "$$file" ]; then \
			for file2 in "$$file"/*.shp; do \
				shp2pgsql $$FLAGS -s 4326 "$$file2" roadswithtraffic | psql -d carbonwars -q; \
				FLAGS="-a"; \
			done; \
		fi; \
	done

clean:
	rm -rf ./$(DIR)/extracts/
