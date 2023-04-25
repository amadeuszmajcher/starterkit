const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const webpack = require('webpack-stream');
const clean = require('gulp-clean');
const webpackConfig = require('./webpack.config');
const promises = require('fs.promises');
const browserSync = require('browser-sync').create();

const path = {
    root: "./dist/",
    cssSrc: "./src/scss/**/*.scss",
    cssDist: "./dist/css",
    imgSrc: "./src/assets/img/**/*",
    imgDist: "./dist/assets/img",
    htmlSrc: "./src/content/index.html",
    jsSrc: "./src/js/main.js",
    jsSrcAll: "./src/js/**/*.js",
    jsDist: "./dist/js"
};

//CSS
const css = function() {
    return gulp.src(path.cssSrc)
        .pipe(sass(
            {outputStyle: "compressed"}
        ).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(path.cssDist))
};
// IMAGES
const images = function(){
    return gulp.src(path.imgSrc)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 80, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest(path.imgDist))
};
// HTML
const html = function(){
    return gulp.src(path.htmlSrc)
        .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'   
        }))
        .pipe(gulp.dest(path.root))
};
// HTML MIN
const htmlMinify = function(){
    return gulp.src(path.htmlSrc)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.root))
};
// JAVASCRIPT
const javascript = function(){
    return gulp.src(path.jsSrc)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(path.jsDist))
};
// CLEANER
const cleaner = function(){
    return gulp.src(path.root)
        .pipe(clean());
};
// BROWSERSYNC
const server = function(cb){
    browserSync.init({
        server: {
            baseDir: path.root
        }
    })
    cb();
};
const serverReload = function(cb){
    browserSync.reload();
    cb();
};

const watch = function(){
    gulp.watch(path.cssSrc, gulp.series(css, serverReload));
    gulp.watch(path.jsSrcAll, gulp.series(javascript, serverReload));
    gulp.watch(path.htmlSrc, gulp.series(html, serverReload));
};

exports.styles = css;
exports.scripts = javascript;
exports.img = images;
exports.html = gulp.series(html, htmlMinify);
exports.default = gulp.series(cleaner, html, css, javascript, server, watch);
exports.production = gulp.series(images, htmlMinify);