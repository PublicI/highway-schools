var template = require('../../view/map.html');

require('leaflet');
require('leaflet.vectorgrid');

module.exports = {
    data: function () {
        return {
            map: null,
            schoolIndex: 0,
            anim: true
        };
    },
    vuex: require('../model/schools'),
    render: template.render,
    staticRenderFns: template.staticRenderFns,
    methods: {
        showSchool: function () {
            var vm = this;

            if (this.schoolIndex >= this.schools.length) {
                this.schoolIndex = 0;
            }

            if (this.schools.length === 0 ||
                !this.schools[this.schoolIndex].name ||
                this.schools[this.schoolIndex].name === '') {
                return;
            }

            var school = this.schools[this.schoolIndex];

            var coords = [parseFloat(school.latcode),parseFloat(school.longcode)];

            L.circle(coords, {
                radius: 152.4,
                color: 'black',
                fill: false
            }).addTo(this.map);

            this.map.setView(coords, 16);

            var schoolLabel = new L.marker(coords, {
                opacity: 0
            });
            schoolLabel.bindTooltip(school.name, {
                permanent: true,
                className: 'schoolLabel',
                offset: [0, -120],
                direction: 'center'
            });
            schoolLabel.addTo(this.map);

            var cityLabel = new L.marker(coords, {
                opacity: 0
            });
            cityLabel.bindTooltip(school.city + ', ' + school.state, {
                permanent: true,
                className: 'cityLabel',
                offset: [0, -145],
                direction: 'center'
            });
            cityLabel.addTo(this.map);
        },
        nextSchool: function () {
            if (this.anim) {
                this.schoolIndex++;

                this.showSchool();
            }
        },
        stopAnim: function () {
            this.anim = false;
        },
        initPlaces: function () {
            var vm = this;
/*
            var GoogleSearch = L.control({
                position: 'topright'
            });

            GoogleSearch.onAdd = function() {
                var element = document.createElement("input");

                element.id = "searchBox";
                element.placeholder = 'Search for a school or location';

                return element;
            };

            var gs = GoogleSearch.addTo(vm.map);*/

            var input = document.getElementById('searchBox');

            input.addEventListener('focus',vm.stopAnim);

            //L.DomEvent.disableClickPropagation(input);

            var searchBox = new google.maps.places.SearchBox(input);

            searchBox.addListener('places_changed', function() {
              var places = searchBox.getPlaces();

              if (places.length === 0) {
                return;
              }

              vm.enableInteraction();

              var group = L.featureGroup();

              places.forEach(function(place) {

                // Create a marker for each place.
                var marker = L.marker([
                  place.geometry.location.lat(),
                  place.geometry.location.lng()
                ]);
                group.addLayer(marker);
              });

              group.addTo(vm.map);
              vm.map.fitBounds(group.getBounds());

            });
        },
        disableInteraction: function () {
            this.anim = true;
            this.$el.className += ' inactive';
        },
        enableInteraction: function () {
            this.stopAnim();
            var outer = this.$el;
            outer.className = outer.className.replace(/inactive/g,'');
        },
        init: function () {
            var vm = this;

            var mapEl = document.getElementById('map');

            vm.map = L.map(mapEl,{ // vm.$el
                minZoom: 9,
                maxZoom: 16,
                attributionControl: false,
                keyboard: false
            });

            vm.map.on('zoomend',function () {
                var zoom = vm.map.getZoom();

                if (zoom < 16) {
                    mapEl.classList.add('hideLabels');
                }
                else {
                    mapEl.classList.remove('hideLabels');
                }
            });

            vm.map.on('click', vm.stopAnim);
            vm.map.on('dragstart', vm.stopAnim);

            vm.map.on('load',function () {
                var controls = document.querySelectorAll('.leaflet-control a');

                for (var i = 0; i < controls.length; i++) {
                    controls[i].addEventListener('click',vm.stopAnim);
                }
            });
    /*
            var mapLink = 
                '<a href="http://www.esri.com/">Esri</a>';
            var wholink = 
                'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';*/

            L.tileLayer(
                'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                // attribution: '&copy; '+mapLink+', '+wholink,
                minZoom: 9,
                maxZoom: 11,
                opacity: 0.85,
                detectRetina: true
            }).addTo(vm.map);

            L.tileLayer(
                'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                // attribution: '&copy; '+mapLink+', '+wholink,
                minZoom: 12, // 11
                // maxZoom: 16,
                opacity: 0.95, // 0.85,
                detectRetina: true
            }).addTo(vm.map);

            var roadLayer = L.vectorGrid.protobuf('tiles/roads/{z}/{x}/{y}.mvt', {
                opacity: 1,
                minZoom: 9,
                maxZoom: 10,
                updateWhenZooming: false,
                vectorTileLayerStyles: {
                    hightraffic: {
                        fillColor: 'red',
                        weight: 0,
                        fillOpacity: 1,
                        fill: true
                    },
                    truckroute: {
                        fillColor: 'orange',
                        weight: 0,
                        color: 'rgb(200,200,200)',
                        fillOpacity: 1,
                        fill: true
                    }
                }
            }).addTo(vm.map);

            var roadLayer2 = L.vectorGrid.protobuf('tiles/roads/{z}/{x}/{y}.mvt', {
                opacity: 0.4,
                minZoom: 11,
                maxZoom: 16,
                updateWhenZooming: false,
                vectorTileLayerStyles: {
                    hightraffic: {
                        fillColor: 'red',
                        weight: 0,
                        fillOpacity: 1,
                        fill: true
                    },
                    truckroute: {
                        fillColor: 'orange',
                        weight: 0,
                        color: 'rgb(200,200,200)',
                        fillOpacity: 1,
                        fill: true
                    }
                }
            }).addTo(vm.map);

            L.tileLayer('http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png', {
                maxZoom: 15,
                updateWhenZooming: false,
                opacity: 1,
                detectRetina: true
            }).addTo(vm.map);

            vm.showSchool();

            setInterval(vm.nextSchool,5000);

            if (typeof google !== 'undefined' && google.maps && google.maps.places) {
                vm.initPlaces();
            }
            else {
                window.initPlaces = vm.initPlaces;
            }
        }
    },
    mounted: function () {
        var vm = this;

        // require.ensure([], function(require) {
        vm.init();
        // }, 'leaflet');
    }
};
