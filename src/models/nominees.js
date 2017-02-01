var Tabletop = require('tabletop'),
	yaml = require('js-yaml'),
	fs = require('fs');

module.exports = function (cb) {
    var config = yaml.safeLoad(fs.readFileSync(__dirname + '/../../config.yml', 'utf8'));

    cb(null,[]);
/*
    Tabletop.init({
        debug: true,
        key: config.google.sheet.key,
        callback: function(rows, tabletop) {
            cb(null,rows.map(function (nominee) {
                nominee.description = nominee.description.replace(/<a href/g,'<a target="_top" href');

                return nominee;
            }).filter(function (nominee) {
                return nominee.level == 'SCOTUS';
            }));
        },
        simpleSheet: true
    });*/
};
