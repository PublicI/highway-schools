module.exports = {
    state: {
        // list: []
        list: require('dsv!../../data/hightrafficschools2.csv').sort(function (a,b) {
            return b.aadt-a.aadt;
        })
    },
    mutations: {
        // TK
    },
    getters: {
        schools: function (state) {
            return state.schools.list;
        }
    }
};
