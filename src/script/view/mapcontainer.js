var template = require('../../view/mapcontainer.html');
	// mapboxglsupported = require('mapbox-gl-supported');

window.initPlaces = function () {
    // no-op
};

module.exports = {
    components: {
        slippyMap: require('./map')// mapboxglsupported() ? require('./mapgl') : require('./map')
    },
    render: template.render,
    staticRenderFns: template.staticRenderFns
};
