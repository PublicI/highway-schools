var template = require('../../view/map.html');

var d3 = require('d3');

require('leaflet.vectorgrid');

module.exports = {
    data: function () {
        return {};
    },
    vuex: require('../model/schools'),
    render: template.render,
    staticRenderFns: template.staticRenderFns,
    mounted: function () {
        var map = L.map(this.$el).setView([this.schools[0].latcode, this.schools[0].longcode], 17);

        var mapLink = 
            '<a href="http://www.esri.com/">Esri</a>';
        var wholink = 
            'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
        L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; '+mapLink+', '+wholink,
            maxZoom: 18,
            }).addTo(map);

        var vectorTileOptions = {
            vectorTileLayerStyles: {
                roads: {
                    weight: 2,
                    color: 'red'
                }
            }
        };

        var pbfLayer = L.vectorGrid.protobuf('http://tile.mapzen.com/mapzen/vector/v1/roads/{z}/{x}/{y}.mvt?api_key=vector-tiles-PuZfnud', vectorTileOptions).addTo(map);

    }
};
