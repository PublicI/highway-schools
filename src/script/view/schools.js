var template = require('../../view/schools.html');

module.exports = {
    data: function () {
        return {
            pkg: {
                version: PKG_VERSION
            },
            page: 1,
            itemsPerPage: 30
        };
    },
    vuex: require('../model/schools'),
    render: template.render,
    staticRenderFns: template.staticRenderFns,
    methods: {
        next: function () {
            this.page++;
        },
        prev: function () {
            if (this.page >= 1) {
                this.page--;
            }
        }
    }
};
