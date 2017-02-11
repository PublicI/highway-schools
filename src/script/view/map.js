var template = require('../../view/map.html');

require('leaflet.vectorgrid');

module.exports = {
    data: function () {
        return {
            map: null,
            schoolIndex: 0
        };
    },
    vuex: require('../model/schools'),
    render: template.render,
    staticRenderFns: template.staticRenderFns,
    methods: {
        nextSchool: function () {
            this.schoolIndex++;

            this.map.setView([this.schools[this.schoolIndex].latcode, this.schools[this.schoolIndex].longcode], 17);
        }
    },
    mounted: function () {
        var vm = this;

        this.map = L.map(vm.$el,{
            attributionControl: false
        }) //.setView([38.901947, -77.039047],17);
                    .setView([vm.schools[vm.schoolIndex].latcode, vm.schools[vm.schoolIndex].longcode], 17);

        var mapLink = 
            '<a href="http://www.esri.com/">Esri</a>';

        var wholink = 
            'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
        L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; '+mapLink+', '+wholink,
            maxZoom: 18,
            opacity: 0.85
        }).addTo(vm.map);

        var roadLayer = L.vectorGrid.protobuf('tiles/roads/{z}/{x}/{y}.mvt', {
            opacity: 0.4,
            minZoom: 12,
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
                    color: 'rgb(200,200,200',
                    fillOpacity: 1,
                    fill: true
                }
            }
        }).addTo(vm.map);

        L.tileLayer('http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png', {
            maxZoom: 18,
            opacity: 0.8
        }).addTo(vm.map);

        // setInterval(vm.nextSchool,5000);

        var GoogleSearch = L.Control.extend({
          onAdd: function() {
            var element = document.createElement("input");

            element.id = "searchBox";
            element.placeholder = 'Search for a place';

            return element;
          }
        });

        var gs = (new GoogleSearch()).addTo(vm.map);

        var input = document.getElementById("searchBox");

        var searchBox = new google.maps.places.SearchBox(input);

        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length === 0) {
            return;
          }

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

    }
};
