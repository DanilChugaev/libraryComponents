/*
*	Основной таск, который требуется выполнять
*	gulp watch - следит за всеми изменениями в файлах, автоматически обновляя браузер
*/

var gulp 			= require('gulp'),
    scss 			= require('gulp-sass'),
    autoprefixer 	= require('gulp-autoprefixer'),
    browserSync 	= require('browser-sync'),
    rigger          = require('gulp-rigger'),
    babel           = require('gulp-babel');

gulp.task('scss', function() {
    return gulp.src(['!app/scss/_var.scss', 'app/scss/**/*.scss'])
        .pipe(scss({outputStyle: 'expanded'}).on('error', scss.logError))
        .pipe(autoprefixer({
            browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
            cascade: true
        }))
        .pipe(gulp.dest('app/css/custom'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', function () {
    return gulp.src('app/html/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('app/'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('es6', function () {
    return gulp.src('app/js/custom/*.js')
        .pipe(babel({
            presets: ['env'],
            plugins: ['transform-runtime']
        }))
        .pipe(gulp.dest('app/js/compiled'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('watch', ['browser-sync', 'scss', 'html', 'es6'], function() {
    gulp.watch('app/css/preloader.min.css', browserSync.reload);
    gulp.watch('app/scss/**/*.scss', ['scss']);
    gulp.watch('app/html/**/*.html', ['html']);
    gulp.watch('app/js/custom/*.js', ['es6']);
});