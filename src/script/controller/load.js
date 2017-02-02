var request = require('d3-request');

module.exports = {
    retrieve: function(store) {
        var url = 'schools.json';

        request.json(url,function (err,data) {
            store.dispatch('setSchools', data.schools.map(function (nominee,i) {
            	nominee.index = i;

            	return nominee;
            }));
        });
    }
};
