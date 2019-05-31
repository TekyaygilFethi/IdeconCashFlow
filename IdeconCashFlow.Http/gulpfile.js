const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const replace = require('gulp-replace');

gulp.task('sass', () =>
  gulp
    .src('./scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public/css'))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./public/css')),
);

gulp.task('sass:watch', () => gulp.watch('./scss/**/*.scss', gulp.series('sass')));


gulp.task('set:config', done => {
  // eslint-disable-next-line
  const config = require(`./config/${process.env.CONFIG}.json`);

  const params = Object.keys(config);
  const task = gulp.src(['./public/js/config.js']);
  params.forEach(item => {
    const reg = new RegExp(`(${item}: ?["']([^"']|""|'')*["'])`, 'g');
    task.pipe(replace(reg, `${item}: '${config[item]}'`));
  });
  task.pipe(gulp.dest('public/js/'));
  done();
});

gulp.task('default', gulp.series('sass'));
