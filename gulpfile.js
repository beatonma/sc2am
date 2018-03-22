const gulp = require('gulp');
const minifyjs = require('gulp-babel-minify');
const minifycss = require('gulp-cssnano');
const rename = require('gulp-rename');

gulp.task('default', ['minifyjs', 'minifycss', 'watch']);

gulp.task('watch', () => {
    gulp.watch('web/assets/**/*.js', ['minifyjs']);
    gulp.watch('web/assets/**/*.css', ['minifycss']);
});

gulp.task('minifyjs', () => {
    return gulp.src(['web/assets/**/*.js', '!web/assets/**/*.min.js'])
        .pipe(minifyjs())
        .pipe(rename(path => {
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest('web/assets'))
});

gulp.task('minifycss', () => {
    return gulp.src(['web/assets/**/*.css', '!web/assets/**/*.min.css'])
        .pipe(minifycss())
        .pipe(rename(path => {
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest('web/assets'))
});