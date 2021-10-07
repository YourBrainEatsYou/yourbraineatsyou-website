'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const inject = require('gulp-inject-string');
const browserSync = require('browser-sync');

gulp.task('sass', () => {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});
gulp.task('sass-watcher', gulp.series('sass'));


gulp.task('html', () => {
	return gulp.src('src/index.html')
		.pipe(inject.before('</head>', '<link rel="stylesheet" href="/css/styles.css">'))
		.pipe(gulp.dest('dist'));
});
gulp.task('html-watcher', gulp.series('html', (cb) => {
	browserSync.reload;
	return cb()
}));

gulp.task('assets', () => {
	return gulp.src('src/assets/**')
		.pipe(gulp.dest('dist/assets'));
});
gulp.task('favicon', () => {
	return gulp.src(['src/favicon.ico', 'src/favicon.svg', 'src/apple-touch-icon.png'])
		.pipe(gulp.dest('dist/'));
})
gulp.task('assets-watcher', gulp.series('assets', (cb) => {
	browserSync.reload;
	return cb()
}));

gulp.task('build', gulp.series(
	gulp.parallel('sass', 'html', 'assets', 'favicon')
));

gulp.task('watcher', () => {
	gulp.watch('src/scss/**/*.scss', gulp.series('sass-watcher'));
	gulp.watch('src/**.html', gulp.series('html-watcher'));
	gulp.watch('src/assets/**/*', gulp.series('assets-watcher'));
})

gulp.task('serve',
	gulp.series(
		'build',
		() => {
			browserSync.init({
				server: {
					baseDir: './dist',
				},
				port: 5200
			});

			gulp.watch('src/scss/**', gulp.series('sass-watcher'));
			gulp.watch('src/**/*.html', gulp.series('html-watcher'));
			gulp.watch('src/assets/**', gulp.series('assets-watcher'));
		},
	));
