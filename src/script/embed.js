(function() {
    var prefix = '';

    if (document.location.hostname != 'localhost' &&
        document.location.hostname != '10.0.2.2' &&
        document.location.hostname != '192.168.1.151' &&
        document.location.hostname != 'argus') {
        prefix = '//cloudfront-files-1.publicintegrity.org/apps/2017/01/highway-schools/';
    }

    try {
        /*
        if (!window.pym) {
            window.pym = require('pym.js');

            window.pym.Scroll = require('./lib/pym.scroll');
            // window.pym.Hash = require('./lib/pym.hash');
        }*/

        window.show_social_links_footer = function() {
            // no-op
        };

        var el = document.getElementById('highwaySchools');

        if (typeof el == 'undefined' || !el) {
            return;
        }

        var view = el.getAttribute('data-view');
        var topmatter = el.getAttribute('data-topmatter');
        var hash = el.getAttribute('data-hash');
        var queryArray = [];

        if (typeof view === 'undefined' || !view) {
            view = '';
        }
        if (typeof topmatter === 'undefined' || !topmatter) {
            // topmatter = '';
        } else {
            queryArray.push('topmatter=true');
        }
        if (typeof hash === 'undefined' || !hash) {
            // hash = '';
        } else {
            queryArray.push('hash=true');
            if (window.location.hash && window.location.hash.indexOf('state') !== -1) {
                console.log(window.location.hash);
                view = window.location.hash.replace('#','');
            }
        }

        var queryString = '?' + queryArray.join('&');

        var url = prefix + 'embed.html#' + view + queryString;

        var iframe = null;

        if (el.tagName.toLowerCase() == 'div') {
            iframe = document.createElement('iframe');
            iframe.setAttribute('src',url);
            iframe.setAttribute('id','highwaySchools');
            iframe.setAttribute('style','width:100%;height:900px;');
            iframe.setAttribute('frameBorder','0');
            iframe.setAttribute('scrolling','no');
            el.appendChild(iframe);
        }
        else if (el.tagName.toLowerCase() == 'iframe') {
            iframe = el;
        }

        // USAT
        function oembedResizeIframe(els, data) {
            for (var i = 0; i < els.length; i++) {
                if (data.height) {
                    els[i].style.height = data.height + 'px';
                }
                /*
                if (typeof data.scrollTo !== 'undefined' && data.scrollTo !== null) {
                    var elPos = els[i].getBoundingClientRect().top + window.pageYOffset;

                    var totalOffset = elPos + parseInt(data.scrollTo);
                    window.scrollTo(0, totalOffset);
                }*/
            }
        }

        function receiveMessage(event) {
            if (event.data && event.data.route) {
                window.location.hash = event.data.route;
            }
            if (typeof iframe !== 'undefined' && iframe) {
                oembedResizeIframe([iframe], event.data);
            }
        }
        window.addEventListener('message', receiveMessage, false);

        if (typeof iframe !== 'undefined' && iframe.contentWindow) {
            var scrollMonitor = require('scrollmonitor');

            var elementWatcher = scrollMonitor.create( iframe );

            elementWatcher.enterViewport(function() {
                iframe.contentWindow.postMessage({
                    anim: true
                },'*');
            });
            elementWatcher.exitViewport(function() {
                iframe.contentWindow.postMessage({
                    anim: false
                },'*');
            });

        }

        // var pymParent = new pym.Parent('highwaySchools', prefix + 'embed.html#' + view + topmatter, {});

        // var pymScroll = new pym.Scroll(pymParent);
        // var pymHash = new pym.Hash(pymParent);

    } catch (e) {
        document.getElementById('highwaySchools').innerHTML = '<img src="' + prefix + PKG_VERSION + '/img/graphic-940.png"/>';
    }
})();
