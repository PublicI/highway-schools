module.exports = {
    init: function () {
        if (typeof document !== 'undefined') {
            /*
            this.pym = pym.Child({
                // polling: 200
            });

            this.scroll = new Scroll(this.pym);
            // this.hash = new Hash(this.pym);*/

            window.addEventListener('resize',this.sendHeight.bind(this,{}));

            setInterval(this.sendHeight.bind(this,{}),200);
        }
    },
    sendHeight: function (opts) {
        /*
        if (this.pym) {
            this.pym.sendHeight();
        }*/

        var heights = [];

        if (typeof document !== 'undefined' && typeof parent !== 'undefined' && parent) {
            var height = document.body.offsetHeight;

            if (typeof opts == 'undefined' || !opts) {
                opts = {};
            }

            opts.height = height+10;

            // if (heights.length <= 3 || opts.scrollTo || opts.route || heights[0] != heights[2]) {
                parent.postMessage(opts, "*");
            // }

            heights.unshift(height+10);

            if (heights.length > 5) {
                heights.pop();
            }
        }
    },
    scrollTo: function (num) {
        this.sendHeight({
            scrollTo: num
        });
    },
    setHash: function (route) {
        this.sendHeight({
            route: route
        });
    }
};
