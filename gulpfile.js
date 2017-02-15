var awspublish = require('gulp-awspublish'),
    csslint = require('gulp-csslint'),
    fs = require('fs'),
    gulp = require('gulp'),
    hogan = require('hogan-express'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    merge = require('merge-stream'),
    cleanCSS = require('gulp-clean-css'),
    pkg = require('./package.json'),
    rename = require('gulp-rename'),
    models = require('./src/models'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    yaml = require('js-yaml');

gulp.task('style', function() {
    return gulp.src('src/style/*.less')
        .pipe(less({
            paths: ['.', 'lib']
        }))
        .pipe(csslint({
            'box-model': false,
            'adjoining-classes': false,
            'import': false,
            'known-properties': false
        }))
        .pipe(csslint.formatter())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/' + pkg.version));
});

gulp.task('jshint', function() {
    return gulp.src(['src/script/*.js'], {
            base: 'src/script/'
        })
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('embedScripts', function() {
    return gulp.src('./src/script/embed.js')
        .pipe(webpackStream({
            output: {
                filename: 'embed.js',
                publicPath: pkg.version + '/'
            },
            plugins: [
                new webpack.DefinePlugin({
                    'PKG_VERSION': '\'' + pkg.version + '\'',
                    'PKG_NAME': '\'' + pkg.name + '\''
                }),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.OccurenceOrderPlugin(true),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                })
            ]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
    return gulp.src('./src/script/script.js')
        .pipe(webpackStream({
            entry: ['es6-promise/auto','whatwg-fetch','./src/script/script.js'],
            output: {
                filename: 'script.js',
                publicPath: pkg.version + '/'
            },
            plugins: [
                new webpack.DefinePlugin({
                    'PKG_VERSION': '\'' + pkg.version + '\'',
                    'process.env': {
                        NODE_ENV: '"production"'
                    },
                    'ArrayBuffer.isView': 'function (t) { return ArrayBuffer.isView && ArrayBuffer.isView(t) }'
                }),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.OccurenceOrderPlugin(true),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                })
            ],
            module: {
                loaders: [{
                    test: /\.json$/,
                    loader: 'json'
                }, {
                    test: /\.html$/,
                    loader: 'vue-template-compiler'
                }]
            }
        }))
        .pipe(gulp.dest('dist/' + pkg.version));
});

gulp.task('bakeEmbed', function(cb) {
    hogan(__dirname + '/src/view/embed.html', {
        pkg: pkg,
        settings: {}
    }, function(err, html) {
        if (err) {
            cb(err);
            return;
        }

        fs.writeFile(__dirname + '/dist/embed.html', html, {
            encoding: 'utf8'
        }, function(err) {
            if (!err) {
                cb(err);
                return;
            }

            cb();
        });
    });
});

gulp.task('bakeIndex', function(cb) {
    hogan(__dirname + '/src/view/index.html', {
        pkg: pkg,
        settings: {}
    }, function(err, html) {
        if (err) {
            cb(err);
            return;
        }

        fs.writeFile(__dirname + '/dist/index.html', html, {
            encoding: 'utf8'
        }, function(err) {
            if (!err) {
                cb(err);
                return;
            }

            cb();
        });
    });
});

gulp.task('copy', function() {
    return gulp.src(['src/img/**'], {
            base: 'src/'
        })
        .pipe(gulp.dest('dist')); // /' + pkg.version
});


gulp.task('copy-oembed', function() {
    return gulp.src(['src/data/oembed.json'], {
            base: 'src/data/'
        })
        .pipe(gulp.dest('dist/'));
});

gulp.task('push', function(cb) {
    var config = yaml.safeLoad(fs.readFileSync(__dirname + '/config.yml', 'utf8'));

    var publisher = awspublish.create({
        accessKeyId: config.aws.key,
        secretAccessKey: config.aws.secret,
        params: {
            Bucket: config.aws.bucket
        }
    });

    var rest = gulp.src(['dist/' + pkg.version + '/**'])
        .pipe(rename(function(path) {
            path.dirname = '/apps/2017/01/' + pkg.name + '/' + pkg.version + '/' + path.dirname;
        }))
        .pipe(awspublish.gzip())
        .pipe(publisher.publish())
        .pipe(publisher.cache())
        .pipe(awspublish.reporter())
        .on('end', function() {
            gulp.src(['dist/*'])
                .pipe(rename(function(path) {
                    path.dirname = '/apps/2017/01/' + pkg.name + '/' + path.dirname;
                }))
                .pipe(publisher.publish({
                    'Cache-Control': 's-maxage=' + (60 * 2) + ',max-age=0'
                }))
                .pipe(publisher.cache())
                .pipe(awspublish.reporter())
                .on('end',cb);
        });
});

/*
gulp.task('bakeData',function (cb) {
    models.nominees(function (err,nominees) {
            fs.writeFile(__dirname + '/dist/nominees.json',JSON.stringify({
                        nominees: nominees
                },null,'    '),function () {
                fs.writeFile(__dirname + '/dist/nominees.json',JSON.stringify({
                    nominees: nominees
                }),cb);
            });
    });
});*/

gulp.task('build', ['bakeEmbed', 'bakeIndex', 'copy-oembed', 'style', 'jshint', 'scripts', 'embedScripts']);
