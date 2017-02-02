var template = require('../../view/schools.html');

module.exports = {
    data: function () {
        return {
            pkg: {
                version: PKG_VERSION
            }
        };
    },
    vuex: require('../model/schools'),
    render: template.render,
    staticRenderFns: template.staticRenderFns
};
