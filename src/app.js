var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    hogan = require('hogan-express'),
    less = require('less-middleware'),
    logger = require('morgan'),
    path = require('path'),
    pkg = require('../package.json'),
    webpack = require('webpack'),
    webpackMiddleware = require('webpack-dev-middleware');

var roads = require('./routes/roads');

var app = express();

// view engine setup
app.engine('html', hogan);
// app.enable('view cache');
app.set('view engine', 'html');
app.set('views', __dirname + '/view');

// misc. express middlware
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

// style.less middleware
app.use('/' + pkg.version, less(path.join(__dirname, 'style')));
app.use('/' + pkg.version, express.static(path.join(__dirname, 'style')));

// app.use('/' + pkg.version + '/fonts', express.static(path.join(__dirname, '..', 'node_modules', 'font-awesome', 'fonts')));

// serves up common scripts
app.use('/apps/common/', express.static(path.join(__dirname, 'script', 'lib', 'common')));

app.get('/', function(req, res) {
    res.render('index', {
        pkg: pkg
    });
});

app.get('/embed.html', function(req, res) {
  //  script.render(function (content) {
        res.render('embed', {
            pkg: pkg
   //         content: content
        });
 //   });
});

// embed.js webpack middleware
var embedCompiler = webpack({
    entry: __dirname + '/script/embed.js',
    output: {
        path: __dirname + '/../script',
        filename: 'embed.js',
        publicPath: '/'
    },
    plugins: [new webpack.DefinePlugin({
        'PKG_VERSION': '\'' + pkg.version + '\''
    })],
    devtool: 'source-map'
});

app.use(roads);
app.use('/' + pkg.version,roads);

app.use('/',webpackMiddleware(embedCompiler, {
    noInfo: true
}));

// script.js webpack middlware
var compiler = webpack({
    entry: ['es6-promise/auto','whatwg-fetch',__dirname + '/script/script.js'],
    output: {
        path: __dirname + '/../script',
        filename: 'script.js',
        publicPath: '/' + pkg.version + '/'
    },
    plugins: [new webpack.DefinePlugin({
        'PKG_VERSION': '\'' + pkg.version + '\'',
        'ArrayBuffer.isView': 'function (t) { return ArrayBuffer.isView && ArrayBuffer.isView(t) }'
    })],
    devtool: 'source-map',
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'vue-template-compiler'
        }]
    }
});

/*
{
    test: /\.json$/,
    loader: 'json'
},
*/

app.use('/' + pkg.version,webpackMiddleware(compiler, {
    noInfo: true
}));


app.use('/' + pkg.version, express.static(path.join(__dirname)));
app.use('/', express.static(path.join(__dirname)));

if (require.main === module) {
    app.listen(process.env.PORT || 5000);
}

module.exports = app;
