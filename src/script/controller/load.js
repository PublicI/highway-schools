var request = require('d3-request');

module.exports = {
    retrieve: function(store) {
        var url = 'nominees.json';

        request.json(url,function (err,data) {
            store.dispatch('setNominees', data.nominees.map(function (nominee,i) {
            	nominee.index = i;

            	return nominee;
            }));
        });
    }
};
