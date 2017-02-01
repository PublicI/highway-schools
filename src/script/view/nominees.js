var template = require('../../view/nominees.html');

module.exports = {
    data: function () {
        return {
            pkg: {
                version: PKG_VERSION
            }
        };
    },
    vuex: require('../model/nominees'),
    render: template.render,
    staticRenderFns: template.staticRenderFns
};
