var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    less = require('less-middleware'),
    logger = require('morgan'),
    path = require('path'),
    pkg = require('../../package.json'),
    ractive = require('ractive-render'),
  //  script = require('../script/script'),
    webpack = require('webpack'),
    webpackMiddleware = require('webpack-dev-middleware');

var app = express();

// setup express
ractive.config({
    stripComments: false,
    preserveWhitespace: true
});

// view engine setup
app.engine('html', ractive.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../');

// misc. express middlware
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

// style.less middleware
app.use('/' + pkg.version, less(path.join(__dirname, '..', 'style')));
app.use('/' + pkg.version, express.static(path.join(__dirname, '..', 'style')));

// serves up common scripts
app.use('/apps/common/', express.static(path.join(__dirname, '..', 'script', 'lib', 'common')));

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
    entry: './src/script/embed.js',
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

app.use('/',webpackMiddleware(embedCompiler, {
    noInfo: true
}));

// script.js webpack middlware
var compiler = webpack({
    entry: './src/script/script.js',
    output: {
        path: __dirname + '/../script',
        filename: 'script.js',
        publicPath: '/' + pkg.version + '/'
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.json$/,
            loader: 'json'
        },{
            test: /\.html$/,
            loader: 'ractive'
        }]
    }
});

app.use('/' + pkg.version,webpackMiddleware(compiler, {
    noInfo: true
}));


app.use('/' + pkg.version, express.static(path.join(__dirname, '..')));
app.use('/', express.static(path.join(__dirname, '..')));

if (require.main === module) {
    app.listen(process.env.PORT || 5000);
}

module.exports = app;
