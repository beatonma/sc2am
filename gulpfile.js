const gulp = require('gulp');
const minifyjs = require('gulp-babel-minify');
const minifycss = require('gulp-cssnano');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

gulp.task('default', ['sass', 'minifyjs', 'minifycss', 'watch']);

gulp.task('build', ['sass', 'minifyjs', 'minifycss']);

gulp.task('watch', () => {
    gulp.watch('web/assets/scss/**/*.scss', ['sass']);
    gulp.watch('web/assets/**/*.js', ['minifyjs']);
    gulp.watch('web/assets/**/*.css', ['minifycss']);
});

gulp.task('minifyjs', () => {
    return gulp.src(['web/assets/**/*.js', '!web/assets/**/*.min.js'])
        .pipe(minifyjs().on('error', logError))
        .pipe(rename(path => {
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest('web/assets'))
});

gulp.task('minifycss', () => {
    return gulp.src(['web/assets/**/*.css', '!web/assets/**/*.min.css'])
        .pipe(minifycss().on('error', logError))
        .pipe(rename(path => {
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest('web/assets'))
});

gulp.task('sass', () => {
    return gulp.src('web/assets/scss/**/*.scss')
        .pipe(sass().on('error', logError))
        .pipe(gulp.dest('web/assets/css'));
});

function logError(err) {
    console.error(err);
    this.emit('end');
}