var gulp = require('gulp');
// css
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
// optimising media queries is a bad idea
// js
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish'); // add color to jshint output
// css + js
// var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var gzip = require('gulp-gzip');

var paths = {
    sassSrc: 'source/sass/*.scss',
    jsSrc: 'source/js/*.js',
    jsPlugins: 'source/plugins/*.js',
    dist: 'dist/'
};

// Production style
var inProduction = true;


gulp.task('sass', function () {
    if (!inProduction) {
        gulp.src(paths.sassSrc)
                .pipe(sourcemaps.init())
                .pipe(sass({outputStyle: 'compressed'}))
                .pipe(autoprefixer({
                    browsers: ['> 1%', 'IE 7'], 
                    remove: true 
                }))
            .pipe(sourcemaps.write())
            // .pipe(gzip())
            .pipe(gulp.dest(paths.dist));
    } else {
        gulp.src(paths.sassSrc)
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(autoprefixer({
                browsers: ['> 1%', 'IE 7'], 
                remove: true 
            }))
        // .pipe(gzip())
        .pipe(gulp.dest(paths.dist));
    }
});

gulp.task('js',function() {
    if (!inProduction) {
        return gulp.src(paths.jsPlugins.concat(paths.jsSrc))
            .pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(sourcemaps.init())
                .pipe(concat('all.js'))
            .pipe(sourcemaps.write())
            // .pipe(gzip())
            .pipe(gulp.dest(paths.dist));
    } else {
        // Feel like this shouldn't work???
        return gulp.src(paths.jsPlugins.concat(paths.jsSrc))
            .pipe(concat('all.js'))
            .pipe(uglify())
            // .pipe(gzip())
            .pipe(gulp.dest(paths.dist));
    }
});
 
gulp.task('default',function() {
    gulp.watch(paths.sassSrc,['sass']);
    gulp.watch(paths.jsSrc, ['js']);
});