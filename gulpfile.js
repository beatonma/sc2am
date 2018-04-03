const gulp = require('gulp');
const minifyjs = require('gulp-babel-minify');
const minifycss = require('gulp-cssnano');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sequence = require('run-sequence');
const include = require('gulp-include');
const iife = require('gulp-iife');
const del = require('del');

const DEV = './dev/';
const DIST = './dist/';

const JS = 'assets/js';
const CSS = 'assets/css';


gulp.task('default', ['watch']);
gulp.task('watch', ['dev'], () => {
    gulp.watch('web/assets/scss/**/*.scss', ['sass']);
    gulp.watch('web/assets/**/*.js', ['dev:assets:js']);
    gulp.watch('web/assets/**/*.css', ['dev:assets:css']);
    gulp.watch('web/templates/**/*.html', ['dev:templates']);
});

gulp.task('sass', () => {
    return gulp.src('./web/assets/scss/**/*.scss')
        .pipe(sass().on('error', logError))
        .pipe(gulp.dest('web/assets/css'));
});


/*
 * Build development files
 */

gulp.task('dev', ['dev:clean'], () => {
    sequence(['dev:assets', 'dev:server']);
});

gulp.task(
    'dev:assets',
    [
        'dev:assets:js',
        'dev:assets:css',
    ]);

gulp.task(
    'dev:assets:js',
    [
        'dev:assets:js-main',
        'dev:assets:js-profile',
    ]);

gulp.task('dev:assets:js-main', () => {
    return gulp.src('./web/assets/js/main/**/*.js')
        .pipe(include().on('error', logError))
        .pipe(rename(path => {
            path.basename = 'main';
            path.dirname = '';
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest(DEV + JS));
});

gulp.task('dev:assets:js-profile', () => {
    return gulp.src('./web/assets/js/profile/**/*.js')
        .pipe(include().on('error', logError))
        .pipe(rename(path => {
            path.basename = 'profile';
            path.dirname = '';
            path.extname = '.min.js';
        }))
        .pipe(iife())
        .pipe(gulp.dest(DEV + JS));
});

gulp.task('dev:assets:css', ['sass'], () => {
    return gulp.src(['./web/assets/**/*.css', '!./web/assets/**/*.min.css'])
        .pipe(minifycss().on('error', logError))
        .pipe(rename(path => {
            path.dirname = '';
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest(DEV + CSS));
});

gulp.task('dev:templates', () => {
    return gulp.src('./web/templates/**/*.html', {base: './web'})
        .pipe(include().on('error', logError))
        .pipe(gulp.dest(DEV))
});

gulp.task('dev:server', ['dev:server:config'], () => {
    return gulp.src(['./web/**/*', '!./web/assets/**/*'])
        .pipe(include().on('error', logError))
        .pipe(gulp.dest(DEV));
});

gulp.task('dev:server:config', [], () => {
    return gulp.src('./config/**/*.js', {base: '.'})
        .pipe(gulp.dest(DEV));
});

gulp.task('dev:clean', () => {
    del.sync(DEV + '**/*');
});



/*
 * Build distribution files
 */

gulp.task('build', ['build:clean'], () => {
    sequence(['build:assets', 'build:server']);
});

gulp.task(
    'build:assets',
    [
        'build:assets:js',
        'build:assets:css',
    ]);

gulp.task(
    'build:assets:js',
    [
        'build:assets:js-main',
        'build:assets:js-profile',
    ]);

gulp.task('build:assets:js-main', () => {
    return gulp.src('./web/assets/js/main/**/*.js')
        .pipe(include())
        .pipe(minifyjs())
        .pipe(rename(path => {
            path.basename = 'main';
            path.dirname = '';
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest(DIST + JS));
});

gulp.task('build:assets:js-profile', () => {
    return gulp.src('./web/assets/js/profile/**/*.js')
        .pipe(include())
        .pipe(minifyjs())
        .pipe(rename(path => {
            path.basename = 'profile';
            path.dirname = '';
            path.extname = '.min.js';
        }))
        .pipe(iife())
        .pipe(gulp.dest(DIST + JS));
});

gulp.task('build:assets:css', ['sass'], () => {
    return gulp.src(['./web/assets/**/*.css', '!./web/assets/**/*.min.css'])
        .pipe(minifycss().on('error', logError))
        .pipe(rename(path => {
            path.dirname = '';
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest(DIST + CSS));
});

gulp.task('build:server', ['build:server:config', 'build:server:package'], () => {
    return gulp.src([
            './web/**/*',
            '!./web/assets/**/*',
            '!./web/config/**/*',
            '!./web/templates/fragments/**/*',
        ])
        .pipe(include())
        .pipe(gulp.dest(DIST));
});

gulp.task('build:server:config', () => {
    return gulp.src('./web/config/**/*.js', {base: './web'})
        .pipe(gulp.dest(DIST));
});

gulp.task('build:server:package', () => {
    return gulp.src('./package.json')
        .pipe(gulp.dest(DIST));
});

gulp.task('build:clean', () => {
    del.sync([
        DIST + '**/*',
        '!./.git/**/*',
        '!./.gitignore',
    ]);
});

function logError(err) {
    console.error(err);
    this.emit('end');
}