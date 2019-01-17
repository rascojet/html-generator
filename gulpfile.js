var gulp = require('gulp');
var gulpInject = require('gulp-inject');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var prefix = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat');


// Styles - Compile & Minify
gulp.task('sass', function () {
    gulp.src('./templates/assets/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
        .pipe(plumber())
        .pipe(concat('index.min.css'))
        .pipe(gulp.dest('./website/assets/css'))
        .pipe(browserSync.stream());

    gulp.src('./website/assets/css/index.min.css')
        .pipe(gulp.dest('./templates/assets/css/'));

});

// Javascript - Rename uglified index.js to index.min.js
gulp.task('scripts', function () {
    gulp.src('./templates/assets/js/index.js')
		.pipe(uglify())
		.pipe(rename('index.min.js'))
		.pipe(gulp.dest('./templates/assets/js/'));
});

gulp.task('build', function () {
    return gulp.src('./templates/assets/**/*')
        .pipe(gulp.dest('./website/assets/'));
});

gulp.task('html', function () {
    return gulp
        .src('./templates/*.html')
        .pipe(gulp.dest('./website/'));
});

gulp.task('components', function () {
    return gulp
        .src('./templates/*.html')
        .pipe(gulpInject(gulp.src(['./templates/components/*.html']), {
            starttag: '<!-- inject:{{path}} -->',
            relative: true,
            transform: function (filePath, file) {
                // return file contents as string
                return file.contents.toString('utf8');
            }
        }))
        .pipe(gulp.dest('./website/'));
});

// Default task - Runs sass, browser-sync, scripts
gulp.task('inject', ['sass', 'scripts', 'components', 'html', 'build'], function () {

});

gulp.task('serve', ['inject'], function () {
    // serve files from the build folder
    browserSync.init({
        server: {
            baseDir: './website/'
        }
    });

    // watch files and run tasks
    gulp.watch('./templates/components/*.html', ['components']);
    gulp.watch('./templates/*.html', ['components']);
    gulp.watch('./templates/assets/scss/**/*.scss', ['sass']);
    gulp.watch('./templates/assets/js/**/*.js', ['scripts']);
    gulp.watch("./website/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);

gulp.task('noserver', ['inject'], function () {
    // serve files from the build folder
});