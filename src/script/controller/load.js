// var request = require('d3-request');

var Tabletop = require('tabletop');

module.exports = {
    retrieve: function(store) {
        var url = 'https://docs.google.com/spreadsheets/d/1AZ_oRij3iNEr0xRlfYFTn4bWu3MHtxfWxF3QGysifPs/pubhtml';

        Tabletop.init( { key: url,
                         callback: function (data) {
                            store.dispatch('setSchools', data);
                         },
                         simpleSheet: true } );
    }
};
