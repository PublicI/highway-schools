var template = require('../../view/mapcontainer.html');

module.exports = {
    components: {
        slippyMap: require('./map')
    },
    render: template.render,
    staticRenderFns: template.staticRenderFns
};
