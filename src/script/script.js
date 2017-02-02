var Vue = require('vue/dist/vue.js'),
    Vuex = require('vuex'),
    App = require('./view/app'),
    VueRouter = require('vue-router'),
    util = require('./lib/util');

Vue.use(Vuex);
Vue.use(VueRouter);

App.store = new Vuex.Store({
    modules: require('./model')
});

var router = new VueRouter({
    routes: [{
        path: '/',
        component: require('./view/nominees')
    }]
});

App.router = router;

module.exports = new Vue(App);
