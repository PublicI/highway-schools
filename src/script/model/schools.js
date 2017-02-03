module.exports = {
    state: {
        // list: []
        list: require('dsv!../../data/hightrafficschools2.csv')
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
