var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var strip = require('gulp-strip-comments');
var browserSync = require('browser-sync').create();
var notify = require("gulp-notify");
var inlineCss = require('gulp-inline-css');

var rootDir = './';
var srcDir = './src/';
var sources = {
    web: [rootDir+'**/*.+(svg|js|css|php|html|jpg|gif|png)'],
    sass: [srcDir+'sass/app.scss'],
    sassSources: [srcDir+'sass/**/*'],
    jsSources:[
        srcDir+'bower_components/jquery/dist/jquery.min.js',
        srcDir+'bower_components/tether/dist/js/tether.min.js',
        srcDir+'bower_components/bootstrap/dist/js/bootstrap.min.js',
        srcDir+'bower_components/bower-webfontloader/webfont.js',
        srcDir+'scripts/*.js'
    ],
    css : rootDir + 'assets/css/style.min.css'
};

var onError = function(error) {
    console.log( 'An error occurred:', error.message );
    this.emit( 'end' );
};

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: rootDir
    });

    gulp.watch(sources.sassSources, ['sass']);
    gulp.watch(srcDir+"*.html").on('change', browserSync.reload);

    gulp.watch(srcDir+"scripts/*.js", ['scripts']);
    gulp.watch(rootDir+"assets/js/app.js").on('change', browserSync.reload);
});

gulp.task('sass', function() {
    gulp.src(sources.sass)
        .pipe(sass().on('error', onError))
        .pipe(minify({keepBreaks: false, keepSpecialComments: "0"}))
        .pipe(concat(sources.css))
        .pipe(gulp.dest('.'))
        .pipe(browserSync.stream())
        .pipe(notify({
            "title": "CSS Generated",
            "icon":  __dirname  + "/src/images/gulp.png", // case sensitive
            "onLast": true
        }));
});

gulp.task('scripts', function () {
    return gulp.src(sources.jsSources)
        .pipe(concat('app.min.js'))
        .pipe(uglify({
            preserveComments: 'all'
        }))
        .pipe(strip())
        .pipe(gulp.dest(rootDir + 'assets/js/'))
        .pipe(notify({
            "title": "JS Generated",
            "icon":  __dirname  + "/src/images/gulp.png", // case sensitive
            "onLast": true
        }));
});

gulp.task('default', ['sass', 'scripts', 'serve']);