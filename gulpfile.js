var gulp         = require('gulp');
var sass         = require('gulp-sass');
var imagemin     = require('gulp-imagemin');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var hb           = require('gulp-hb');
var path         = require('path');
var data         = require('gulp-data');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');


/*The default task that runs when the `gulp` command is run in the project
 *directory.*/
gulp.task('default', [
  'copyHTML',
  'compileSASS',
  'imageMin',
  'scripts',
  'handlebars'
]);

gulp.task('watch', function() {
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/images/*', ['imageMin']);
  gulp.watch('src/sass/*.scss', ['compileSASS']);
  gulp.watch('src/*.html', ['copyHTML']);
  gulp.watch('src/**/*.{hbs,json}', ['handlebars']);
});

/*Copy the HTML files as is*/
gulp.task('copyHTML', function() {
  gulp.src('src/*.html')
    .pipe(gulp.dest('build'));
});

/*Compile SASS files to CSS*/
gulp.task('compileSASS', function() {
  gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'));
});

/*Minify image files*/
gulp.task('imageMin', function() {
  gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
}
);

/*Minify JS files*/
gulp.task('scripts', function(){
  gulp.src('src/js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('build/js'));
});

/*Compile Handlebars to static HTML*/
gulp.task('handlebars', function() {
  return gulp.src('src/templates/*hbs')
    .pipe(data(function(file) {
        console.log(path.basename(file.path, '.hbs'))
        return require('./src/data/' + path.basename(file.path, '.hbs') + '.json');
    }))
    .pipe(hb({
      partials: './src/partials/*.hbs',

    }))
    .pipe(rename(function(path) {
      path.extname = ".html";
    }))
    .pipe(gulp.dest('build'));
})
