var gulp = require('gulp');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var del = require('del');
var spawn = require('child_process').spawn;
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var debounce = require('lodash.debounce');
var browserReload =  debounce(browserSync.reload, 1000);

var tscCompilationCompleteRegex = / Compilation complete\. Watching for file changes\./;
var typescriptErrorRegex = /\(\d+,\d+\): error TS\d+:/;

gulp.task('clean', function() {
    return del(['public', 'build']);
});

gulp.task('assets', function() {
    return gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./public'));
});

gulp.task('watch', function() {
    // Original gulp.watch too slow
    // watch('./public/**/*')
    //     .on('change', (event) => {
    //         browserReload();
    //     });
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            open: false,
            baseDir: "./public",
            routes: {
                "/node_modules": "node_modules"
            }
        }
    });
});

gulp.task('tsc', function (cb) {
    var firstCompilation = true;
    // typescript watch is the best one
    var tsc = spawn(require.resolve('./node_modules/.bin/tsc'), ['--module', 'amd', '--target', 'ES5', '--jsx', 'react', '--sourceMap', '--outDir', './public/js', '-w', './src/index.tsx']);

    tsc.stdout.on('data', (data) => {
        var dataStr = data.toString();
        if (typescriptErrorRegex.test(dataStr)) {
            // tsc otput errors to stdout!
            gutil.log(gutil.colors.red('[tsc:error] '+ dataStr));
        } else {
            gutil.log('[tsc] ' + dataStr);
        }

        if (firstCompilation) {
            firstCompilation = false;
            cb();
        } else {
            if (tscCompilationCompleteRegex.test(dataStr)) {
                browserReload();
            }
        }
    });

    tsc.stderr.on('data', (data) => {
        gutil.log(gutil.colors.red(`[tsc:error]: ${data}`));
    });

    tsc.on('close', (code) => {
        gutil.log(`[tsc] exited with code ${code}`);
    });
})

gulp.task('serve', function(callback) {
    runSequence(
        'assets',
        'tsc',
        'browser-sync',
        'watch',
        callback
    );
});