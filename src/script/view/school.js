var template = require('../../view/school.html');

module.exports = {
    data: function () {
        return {
            pkg: {
                version: PKG_VERSION
            },
            /*
            merc: new SphericalMercator({
                size: 256
            }),*/
            page: 1,
            itemsPerPage: 30
        };
    },
    props: ['school'],
    render: template.render,
    staticRenderFns: template.staticRenderFns,
    methods: {
        track: function (e) {
            // console.log(e);
        }
    }
};
