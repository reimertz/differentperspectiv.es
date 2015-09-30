/*global -$ */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;


gulp.task('stylesheets', function () {
  return gulp.src('src/stylesheets/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.', 'bower_components/animate.css-scss/', 'bower_components/font-awesome/scss/'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 2 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(gulp.dest('.dist/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('build-js', function () {
  return gulp.src('src/scripts/*.js')
    .pipe(gulp.dest('.dist/scripts'));
});

gulp.task('jshint', function () {
  return gulp.src('src/scripts/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
    .pipe(gulp.dest('.dist/scripts'));
});

gulp.task('templates', function () {
  return gulp.src('src/templates/views/**/*.jade')
    .pipe($.jade({pretty: true}))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('html', ['templates', 'stylesheets'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src(['src/*.html', '.tmp/**/*.html'])
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    //.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('.dist'));
});

gulp.task('images', function () {
  return gulp.src('src/images/**/*')
    // .pipe($.cache($.imagemin({
    //   progressive: true,
    //   interlaced: true,
    //   // don't remove IDs from SVGs, they are often used
    //   // as hooks for embedding and styling
    //   svgoPlugins: [{cleanupIDs: false}]
    // })))
    .pipe(gulp.dest('.dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('src/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('.dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'src/CNAME',
    'src/*.*',
    '!src/*.html',
    '!src/*.jade'
  ], {
    dot: true
  }).pipe(gulp.dest('.dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', '.dist']));

gulp.task('serve', ['templates', 'stylesheets', 'fonts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'src'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'src/*.html',
    '.tmp/*.html',
    'src/scripts/**/*.js',
    'src/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('src/**/*.jade', ['templates']);
  gulp.watch('src/stylesheets/**/*.scss', ['stylesheets']);
  gulp.watch('src/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('src/scss/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('src/styles'));

  gulp.src('src/**/*.jade')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('src/'));
});


gulp.task('build', ['html', 'images', 'fonts', 'extras', 'build-js'], function () {
  return gulp.src('.dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('deploy', ['build'], function () {
  return gulp.src('.dist/**/*')
    .pipe($.ghPages())
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
