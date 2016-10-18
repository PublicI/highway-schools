var // app = require('./src/util/server'),
    awspublish = require('gulp-awspublish'),
    buffer = require('vinyl-buffer'),
    changed = require('gulp-changed'),
    csslint = require('gulp-csslint'),
    del = require('del'),
    fs = require('fs'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    merge = require('merge-stream'),
    minifyCSS = require('gulp-minify-css'),
    Pageres = require('pageres'),
    path = require('path'),
    pkg = require('./package.json'),
    ractive = require('ractive-render'),
    rename = require('gulp-rename'),
    // script = require('./src/script/script'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    yaml = require('js-yaml');

gulp.task('clean', function(cb) {
    return del(['dist/*'], cb);
});
/*
gulp.task('screenshot',function (cb) {
    var server = app.listen(3210,function () {
        var pageres = new Pageres({
                delay: 2
            })
            .src('localhost:3210/embed.html', ['1260x1260', '940x940', '620x940', '300x300'], {
                filename: 'graphic-<%= width %>'
            })
            .dest(__dirname + '/dist/' + pkg.version + '/img');
        
        pageres.run(function (err) {
            server.close();

            cb(err);
        });
        
    });
});*/

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
        .pipe(csslint.reporter())
        .pipe(minifyCSS())
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
            output: {
                filename: 'script.js',
                publicPath: pkg.version + '/'
            },
            plugins: [
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
                },{
                    test: /\.html$/,
                    loader: 'ractive'
                }]
            }
        }))
        .pipe(gulp.dest('dist/' + pkg.version));
});

gulp.task('bakeEmbed',function (cb) {
  //  script.render(function (content) {
        ractive.renderFile(__dirname + '/src/embed.html', {
                pkg: pkg,
         //       content: content,
                stripComments: false,
                preserveWhitespace: true
            }, function(err, html) {
                if (err) {
                    cb(err);
                    return;
                }

                fs.writeFile(__dirname + '/dist/embed.html',html,{
                    encoding: 'utf8'
                },function (err) {
                    if (!err) {
                        cb(err);
                        return;
                    }

                    cb();
                });
        });
//    });
});

gulp.task('copy', function() {
    return gulp.src(['src/img/*'], {
                base: 'src/'
            })
            .pipe(gulp.dest('dist/' + pkg.version));
});

gulp.task('push', function() {
    var config = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname + '/config.yml'), 'utf8'));

    var publisher = awspublish.create({
        accessKeyId: config.aws.key,
        secretAccessKey: config.aws.secret,
        params: {
            Bucket: config.aws.bucket
        }
    });

    var embed = gulp.src(['dist/*'])
                .pipe(rename(function(path) {
                    path.dirname = '/apps/2016/06/' + pkg.name + '/' + path.dirname;
                }))
                .pipe(publisher.publish({
                    'Cache-Control': 's-maxage=' + (60*2) + ',max-age=0'
                }))
                .pipe(publisher.cache())
                .pipe(awspublish.reporter());

    var rest = gulp.src(['dist/' + pkg.version + '/**'])
                .pipe(rename(function(path) {
                    path.dirname = '/apps/2016/06/' + pkg.name + '/' + pkg.version + '/' + path.dirname;
                }))
                .pipe(awspublish.gzip())
                .pipe(publisher.publish())
                .pipe(publisher.cache())
                .pipe(awspublish.reporter());

    return merge(embed,rest);
});

gulp.task('build', ['bakeEmbed', 'copy', 'style', 'jshint', 'scripts', 'embedScripts']);
