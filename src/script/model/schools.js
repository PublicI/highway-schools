module.exports = {
    state: {
        // list: []
        list: require('dsv!../../data/hightrafficschools2.csv').slice(0,198)
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
