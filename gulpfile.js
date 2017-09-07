const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const minifyInline = require('gulp-minify-inline');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlreplace = require('gulp-html-replace');
const revReplace = require('gulp-rev-replace');
const inlinesource = require('gulp-inline-source');
const rev = require('gulp-rev');
const clean = require('gulp-clean');
const pump = require('pump');
const browserSync = require('browser-sync').create();
const historyApiFallback = require('connect-history-api-fallback');

const scriptsFilename = 'scripts.js';

gulp.task('compress', function (cb) {
    "use strict";
    pump([
        gulp.src(['app/*.js']),
        concat(scriptsFilename),
        gulp.dest('tmp'),
        uglify(),
        rev(),
        gulp.dest('dist'),
        rev.manifest(),
        gulp.dest('tmp')
    ], cb);
});


gulp.task('minify', ['compress'], function () {
    "use strict";
    const manifest = gulp.src("tmp/rev-manifest.json");
    return gulp
        .src('app/*.html')
        .pipe(htmlreplace({js: scriptsFilename}))
        .pipe(revReplace({manifest: manifest}))
        .pipe(inlinesource())
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(minifyInline())
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function () {
    "use strict";
    return gulp
        .src([
            //'app/*.css',
            'app/*.json'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-imgs', function () {
    "use strict";
    return gulp
        .src([
            'app/imgs/**'
        ])
        .pipe(gulp.dest('dist/imgs'));
});

gulp.task('clean', ['do-build'], function () {
    "use strict";
    return gulp
        .src('tmp/', {read: false})
        .pipe(clean());
});

gulp.task('do-build', [
    'compress', 'minify', 'copy', 'copy-imgs'
]);

gulp.task('build', ['clean']);


gulp.task('serve-dev', function () {
    "use strict";
    browserSync.init({
        server: {
            baseDir: "./app",
            middleware: [historyApiFallback()]
        }
    });
});


gulp.task('serve-dist', ['build'], function () {
    "use strict";
    browserSync.init({
        server: {
            baseDir: "./dist",
            middleware: [historyApiFallback()]
        }
    });
});

gulp.task('default', ['serve-dev']);
