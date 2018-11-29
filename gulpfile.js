'use strict';
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const cssimport = require('gulp-cssimport');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const replace = require('gulp-replace');


var jsfileslib = [
	'node_modules/jquery/dist/jquery.min.js',
	'node_modules/popper.js/dist/umd/popper.min.js',
	'node_modules/bootstrap/dist/js/bootstrap.min.js',
];

var jsfilesapp = [
	'src/js/app.js'
];

gulp.task('jslib:concat', function () {
	return gulp.src(jsfileslib)
	.pipe(concat('jslib.js'))
	.pipe(gulp.dest('js/'));
});
gulp.task('jsapp:concat', function () {
	return gulp.src(jsfilesapp)
	.pipe(sourcemaps.init())
	.pipe(concat('js.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('js/'));
});

gulp.task('serve', ['sass', 'jslib:concat', 'jsapp:concat', 'dev:watch'], function () {
	browserSync.init({
		server: "./",
		port: 5015
	});
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('**/*.html').on('change', browserSync.reload);
	gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
});

gulp.task('sass', function () {
	return gulp.src('./src/scss/css.scss')
	.pipe(sass())
	.pipe(cssimport({ matchPattern: '*.css' }))
	.pipe(gulp.dest('./css'))
	.pipe(cssmin())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('./css'))
	.pipe(browserSync.stream());
});

gulp.task('dev:watch', function () {
	gulp.watch('./src/scss/**/*.scss', ['sass']);
	gulp.watch('./src/js/**/*.js', ['jsapp:concat']);
});

gulp.task('default', ['serve']);
