var Vue = require('vue'),
    Vuex = require('vuex'),
    App = require('./view/app'),
    VueRouter = require('vue-router');

Vue.use(Vuex);
Vue.use(VueRouter);

App.store = new Vuex.Store({
    modules: require('./model')
});

var router = new VueRouter({
    routes: [{
        path: '/',
        component: require('./view/mapcontainer')
    }]
});

App.router = router;

module.exports = new Vue(App);
