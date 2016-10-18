var prefix = '';

if (document.location.hostname != 'localhost' &&
    document.location.hostname != '10.0.2.2') {
    prefix = '//cloudfront-files-1.publicintegrity.org/apps/2016/06/highway-schools/';
}

try {
    if (!window.pym) {
        window.pym = require('pym.js');
    }
    
    var pymParent = new pym.Parent('highwaySchools', prefix + 'embed.html', {});
    
}
catch (e) {
    document.getElementById('highwaySchools').innerHTML = '<img src="' + prefix + PKG_VERSION + '/img/graphic-940.png"/>';
}
