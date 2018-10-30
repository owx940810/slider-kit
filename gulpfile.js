const gulp = require('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const autoprefixer = require('gulp-autoprefixer')

const { parallel, series, task, src, dest, watch } = gulp

task('build:css', () => {
  return src('src/sass/**/*.sass')
    .pipe(sass({
      indentation: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 10 versions']
    }))
    .pipe(dest('dist/css/'))
})

task('build:js', () => {
  return src('src/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest('dist/js'))
})

task('build:min.js', () => {
  return src('src/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest('dist/js'))
})

task('build', parallel('build:css', 'build:js', 'build:min.js'))
task('default', parallel('build'))

task('watch:css', () => watch('src/sass/**/*.sass', parallel('build:css')))
task('watch:js', () => watch('src/js/**/*.js', parallel('build:js')))

task('watch', parallel('watch:css', 'watch:js'))
