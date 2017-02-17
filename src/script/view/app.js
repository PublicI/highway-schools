var pym = require('../controller/pym');

var template = require('../../view/app.html');

module.exports = {
    /*
    data: function () {
        return {
            topmatter: false,
            hash: false
        };
    },
    vuex: {
        actions: require('../controller/load')
    },*/
    components: {
        overview: require('./overview')
    },
    el: '#highwaySchools',
    render: template.render,
    staticRenderFns: template.staticRenderFns,
    created: function () {
        pym.init();
    }
    /*
    mounted: function () {
        
        if (this.$route.query.topmatter && this.$route.query.topmatter === 'true') {
            this.topmatter = true;
        }
        if (this.$route.query.hash && this.$route.query.hash === 'true') {
            this.hash = true;
        }

        this.$nextTick(function () {
            pym.sendHeight();
        });
        
        // this.retrieve();
    },
    watch: {
        '$route.path': function () {
            if (this.hash) {
                pym.setHash(this.$route.path);
            }
            pym.scrollTo(this.topmatter ? 200 : 20);
        }
    }*/
};
