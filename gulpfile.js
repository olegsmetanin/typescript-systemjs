var gulp = require('gulp');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var del = require('del');
var spawn = require('child_process').spawn;
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();

gulp.task('clean', function() {
    return del(['public', 'build']);
});

gulp.task('assets', function() {
    return gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./public'));
});

gulp.task('watch', function() {
    watch('./src/assets/**/*')
        .on('change', (event) => {
            runSequence('assets', () => {
                browserSync.reload();
            });
        });

    watch('./public/js/**/*')
        .on('change', (event) => {
            browserSync.reload();
        });
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./public",
            reloadDebounce: 1000,
            routes: {
                "/node_modules": "node_modules"
            }
        }
    });
});

gulp.task('tsc', function (cb) {
    var tsc = spawn(require.resolve('./node_modules/.bin/tsc'), ['--module', 'amd', '--target', 'ES5', '--jsx', 'react', '--sourceMap', '--outDir', './public/js', '-w', './src/index.tsx']);

    tsc.stdout.on('data', (data) => {
        var dataStr = data.toString();
        if (dataStr.toLowerCase().indexOf('error') === -1) {
            gutil.log('[tsc] ' + dataStr);
        } else {
            gutil.log(gutil.colors.red('[tsc:error] '+ dataStr));
        }
        browserSync.reload();
    });

    tsc.stderr.on('data', (data) => {
        gutil.log(gutil.colors.red(`[tsc:error]: ${data}`));
    });

    tsc.on('close', (code) => {
        gutil.log(`[tsc] exited with code ${code}`);
    });

    cb();
})

gulp.task('serve', function(callback) {
    runSequence(
        'assets',
        'watch',
        'tsc',
        'browser-sync',
        callback
    );
});