module.exports = {
    state: {
        list: []
    },
    mutations: {
        setNominees: function (state,nominees) {
            state.list = nominees;
            /* .map(function (nominee) {
                nominee.hide = false;

                return nominee;
            })*/
        }/*
        ,
        showNominees: function (state,nominees) {
            var names = nominees.map(function (nominee) {
                return nominee.name;
            });

            state.list.forEach(function (nominee) {
                if (names.indexOf(nominee.name) === -1) {
                    nominee.hide = true;
                }
                else {
                    nominee.hide = false;
                }
            });
        }*/
    },
    getters: {
        nominees: function (state) {
            return state.nominees.list;
        }
    }
};
