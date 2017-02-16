/*
*	Основные таск, которые требуется выполнять
*	gulp watch - следит за всеми изменениями в файлах, автоматически обновляя браузер
*	gulp libs - компилирует все сторонние библиотеки в один файл
*	gulp build - собирает все нужные файлы всего проекта в папку dist
*/

var gulp 			= require('gulp'),
    scss 			= require('gulp-sass'),
    autoprefixer 	= require('gulp-autoprefixer'),
    browserSync 	= require('browser-sync'),
    concat 			= require('gulp-concat'),
    uglify 			= require('gulp-uglifyjs'),
    cssnano 		= require('gulp-cssnano'),
    rename 			= require('gulp-rename'),
    concatCss 		= require('gulp-concat-css'),
    del 			= require('del'),
    imagemin		= require('gulp-imagemin'),
    pngquant		= require('imagemin-pngquant');
    // если будет использоваться бутсрап, то для удаления ненужных стилей можно использовать плагин gulp-uncss

gulp.task('scss', function() {
    return gulp.src(['!app/scss/_var.scss', 'app/scss/*.scss'])
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer({
            browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
            cascade: true
        }))
        .pipe(gulp.dest('app/css/all'));
});

gulp.task('libs', function() {
    return gulp.src('app/js/libs/*.js')
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('js-min', function() {
    return gulp.src('app/js/custom/*.js')
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css-min', ['scss'], function() {
    return gulp.src('app/css/all/*.css')
        .pipe(concatCss('styles.css'))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('img', function() {
	return gulp.src('app/image/**/*')
	.pipe(imagemin({
		optimizationLevel: 5,
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('dist/image'));
});

gulp.task('watch', ['browser-sync', 'css-min', 'js-min'], function() {
    gulp.watch('app/css/preloader.css', browserSync.reload);
    gulp.watch('app/scss/*.scss', ['css-min']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/scroll-to.js', browserSync.reload);
    gulp.watch('app/js/custom/*.js', ['js-min']);
});

gulp.task('build', ['clean', 'img', 'css-min', 'libs','js-min'], function() {
    var buildCss = gulp.src('app/css/*.css')
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/*.js')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));

    var buildIco = gulp.src('app/ico/*.png')
        .pipe(gulp.dest('dist/ico'));
});
