const gulp = require('gulp')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const autoprefixer = require('gulp-autoprefixer')

const { parallel, series, task, src, dest, watch } = gulp

task('build:css', () => {
  return src('src/sass/slider-kit.sass')
    .pipe(sass({
      indentation: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 10 versions']
    }))
    .pipe(dest('dist/css'))
    .pipe(dest('example/css'))
})

task('build:js', () => {
  return src('src/js/slider-kit.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest('dist/js'))
    .pipe(dest('example/js'))
})

task('build:min.js', () => {
  return src('src/js/slider-kit.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest('dist/js'))
    .pipe(dest('example/js'))
})

task('build:example:html', () => {
  return src('src/pug/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('example'))
})

task('build:example:js', () => {
  return src('src/js/index.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest('example/js'))
})

task('build', parallel('build:css', 'build:js', 'build:min.js', 'build:example:html', 'build:example:js'))
task('default', parallel('build'))

task('watch:css', () => watch('src/sass/slider-kit.sass', parallel('build:css')))
task('watch:js', () => watch('src/js/slider-kit.js', parallel('build:js', 'build:min.js')))
task('watch:example:js', () => watch('src/js/index.js', parallel('build:example:js')))
task('watch:example:html', () => watch('src/pug/**/*.pug', parallel('build:example:html')))

task('watch', parallel('watch:css', 'watch:js', 'watch:example:js', 'watch:example:html'))
