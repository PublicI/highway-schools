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
        this.map = L.map(this.$el)
                    .setView([this.schools[this.schoolIndex].latcode, this.schools[this.schoolIndex].longcode], 17);

        var mapLink = 
            '<a href="http://www.esri.com/">Esri</a>';
        var wholink = 
            'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
        L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; '+mapLink+', '+wholink,
            maxZoom: 18,
            }).addTo(this.map);

        var vectorTileOptions = {
            vectorTileLayerStyles: {
                vectile: function(properties, zoom) {
                    var weight = 150;

                    if (zoom < 17) {
                        weight = 1;
                    }

                    return {
                        weight: weight,
                        color: 'rgb(200,0,0)',
                        opacity: 0.5
                    };
                }
            }
        };

        // var pbfLayer = L.vectorGrid.protobuf('http://tile.mapzen.com/mapzen/vector/v1/roads/{z}/{x}/{y}.mvt?api_key=vector-tiles-PuZfnud', vectorTileOptions).addTo(map);
        var pbfLayer = L.vectorGrid.protobuf('tiles/roads/{z}/{x}/{y}.mvt', vectorTileOptions).addTo(this.map);

        setInterval(this.nextSchool,5000);

    }
};
