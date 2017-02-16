var template = require('../../view/map.html'),
    circle = require('@turf/circle');

module.exports = {
    data: function() {
        return {
            mapboxgl: null,
            map: null,
            schoolIndex: 0,
            anim: true
        };
    },
    vuex: require('../model/schools'),
    render: template.render,
    staticRenderFns: template.staticRenderFns,
    methods: {
        showSchool: function() {
            var vm = this;

            if (vm.schools.length === 0 ||
                vm.schoolIndex >= vm.schools.length ||
                !vm.schools[vm.schoolIndex].name ||
                vm.schools[vm.schoolIndex].name === '') {
                return;
            }

            var school = vm.schools[vm.schoolIndex];

            var coords = [parseFloat(school.longcode), parseFloat(school.latcode)];

            vm.map.getSource('schoolCircle')
                .setData(circle(coords, 152.4, 64, 'meters'));

            var el = document.createElement('div');
            el.innerText = school.name;
            el.className = 'schoolLabel';

            var marker = new vm.mapboxgl.Marker(el, {
                    offset: [-125, 120]
                })
                .setLngLat(coords)
                .addTo(vm.map);

            vm.map.easeTo({
                center: coords,
                zoom: 15.5
            });

            /*
            vm.map.once('moveend', function() {
                vm.map.zoomTo(15.2,{
                    duration: 4000
                });
            });
            */
        },
        nextSchool: function() {
            if (this.anim) {
                this.schoolIndex++;

                this.showSchool();
            }
        },
        stopAnim: function() {
            this.anim = false;
        },
        init: function() {
            var vm = this;

            require.ensure([], function(require) {
                var mapboxgl = require('mapbox-gl/dist/mapbox-gl');

                vm.mapboxgl = mapboxgl;

                // mapboxgl.accessToken = 'pk.eyJ1IjoiY2hyaXN6cyIsImEiOiJkRjh1YWJrIn0.44oxqNNdcnw7SQw3aGJU-A';

                var school = vm.schools[vm.schoolIndex];

                var coords = [school.longcode, school.latcode];

                var style = {
                    "version": 8,
                    "sources": {
                        "satellite": {
                            "type": "raster",
                            "tiles": ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
                            "tileSize": 256
                        },
                        "roads": {
                            "type": "vector",
                            "tiles": ["https://iw-files.s3.amazonaws.com/apps/2017/01/highway-schools/tiles/roads/{z}/{x}/{y}.mvt"]
                        },
                        "schoolCircle": {
                            "type": "geojson",
                            "data": circle(coords, 152.4, 64, 'meters')
                        }
                    },
                    "layers": [{
                        "id": "background",
                        "type": "background",
                        "paint": {
                            "background-color": "white"
                        }
                    }, {
                        "id": "satellite",
                        "type": "raster",
                        "source": "satellite",
                        "minzoom": 0,
                        "maxzoom": 22
                    }, {
                        "id": "hightraffic",
                        "type": "fill",
                        "source": "roads",
                        "source-layer": "hightraffic",
                        "minzoom": 9,
                        // "maxzoom": 16,
                        // "filter": ["==", "$type", "Polygon"],
                        "paint": {
                            "fill-color": "red",
                            "fill-opacity": 0.4
                        }
                    }, {
                        "id": "truckroute",
                        "type": "fill",
                        "source": "roads",
                        "source-layer": "truckroute",
                        "minzoom": 9,
                        // "maxzoom": 16,
                        // "filter": ["==", "$type", "Polygon"],
                        "paint": {
                            "fill-color": "orange",
                            "fill-opacity": 0.4
                        }
                    }, {
                        "id": "schoolCircle",
                        "type": "line",
                        "source": "schoolCircle",
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "black",
                            "line-width": 4
                        }
                    }]
                };

                vm.map = new mapboxgl.Map({
                    container: vm.$el,
                    style: style,
                    zoom: 15.5,
                    center: coords,
                    minZoom: 9,
                    maxZoom: 16
                });

                vm.map.on('click', vm.stopAnim);
                vm.map.on('dragstart', vm.stopAnim);

                vm.map.addControl(new mapboxgl.NavigationControl()); // , 'top-left'

                /*
                vm.map.addControl(new mapboxgl.ScaleControl({
                    maxWidth: 80,
                    unit: 'imperial'
                }));*/

                vm.map.on('load', function() {
                    //setInterval(vm.nextSchool, 5000);
                });
            }, 'mapbox-gl');
        }
    },
    mounted: function() {
        this.init();
    }
};
