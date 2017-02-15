module.exports = {
    state: {
        list: [{
            ncessch: '240048000877',
            latcode: 39.0183036,
            longcode: -77.0116627,
            name: 'Montgomery Blair High School',
            city: 'Silver Spring',
            state: 'MD'
        }]
    },
    mutations: {
        setSchools: function (state,schools) {
            state.list = schools;
        }
    },
    getters: {
        schools: function (state) {
            return state.schools.list;
        }
    }
};
