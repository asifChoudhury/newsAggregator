const gulp = require('gulp');
const sass = require('gulp-sass'); // Requires the gulp-sass plugin
const browserSync = require('browser-sync').create();
const userf = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const cache = require('gulp-cache');
const del = require('del');
const runSequence = require('run-sequence');
const imageminUPNG = require('imagemin-upng');

gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss') //look for any number of files with .scss extension in the specified folder
        //converst sass to css with gulp-sass
        // and log error if there's an error
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css')) //save the converted file in here
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('src/scss/*.scss', ['sass']); //gulp watch syntax
    //other watchers
    gulp.watch('src/**.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload)
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
});

gulp.task('useref', function() {
    return gulp.src('src/*.html')
        .pipe(userf())
        .pipe(gulpIf('*.js', uglify())) //minify only js files
        .pipe(gulpIf('*.css', cssnano())) //minify only css files
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin([
            imageminMozjpeg({
                quality: 70
            }),
            imageminUPNG()
        ]))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
});

gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch'],
        callback
    )
});