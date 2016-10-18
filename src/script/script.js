var Ractive = require('ractive');

Ractive.DEBUG = false;

if (typeof window !== 'undefined') {
    require('ractive-events-hover');

    var pym = require('pym.js');

}

var app = {

    ractive: null,

    data: null,

    template: null,

    pym: null,

    container: null,

    rendered: function() {
        if (app.pym) {
            app.pym.sendHeight();
        }
    },

    render: function(cb) {
        app.data = require('../data/data.json');

        if (typeof document !== 'undefined') {
            app.pym = pym.Child({
                polling: 200
            });
/*
            var fonts = WebFont.load({
                typekit: {
                    id: 'wtj1rji'
                }
            });*/

            app.container = document.querySelector('#highwaySchools');
        }

        app.ractive = new Ractive({
            el: app.container,
            template: require('../template.html'),
            data: app.data,
            oncomplete: cb
        });

        if (typeof window === 'undefined') {
            cb(app.ractive.toHTML());
        }
    }

};

if (typeof window !== 'undefined') {
    app.render(app.rendered);
} else {
    module.exports = app;
}
