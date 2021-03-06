var gulp = require('gulp'),
    connect = require('gulp-connect'),
    traceur = require('gulp-traceur'),
    watch = require('gulp-watch'),
    concatCss = require('gulp-concat-css'),
    ts = require('gulp-typescript');

gulp.task('html', function () {
    return gulp.src('src/html/**/*.html')
        .pipe(watch('src/html/**/*.html'))
        .pipe(gulp.dest('public'));
});

gulp.task('connect', function(){
    connect.server({
        root: ['public'],
        host: '0.0.0.0',
        port: 9000
    })
});

gulp.task('vendorjs', function () {
    return gulp.src([
        'node_modules/gulp-traceur/node_modules/traceur/bin/traceur-runtime.js',
        'node_modules/systemjs/dist/system-csp-production.js',
        'node_modules/systemjs/dist/system-csp-production.src.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/angular2/bundles/angular2.js',
        'node_modules/angular2/bundles/http.dev.js',
        'node_modules/angular2/bundles/router.dev.js',
        'node_modules/systemjs/dist/system.js',
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/es6-shim/es6-shim.min.js',
        'node_modules/rxjs/bundles/Rx.js'
    ])
    .pipe(gulp.dest('public/vendor/'));
});

gulp.task('js', function () {
    return gulp.src('src/public/**/*.ts')
        //.pipe(watch('src/public/**/*.ts'))
        .pipe(ts({
            module: 'system',
            experimentalDecorators: true,
            moduleResolution: 'node',
            target: 'ES5'            
        }))
        .pipe(gulp.dest('public/app'));
});

gulp.task('serverjs', function() {
    return gulp.src('src/server/**/*.js')
        .pipe(watch('src/server/**/*.js'))
        .pipe(traceur({
            modules: 'instantiate',
            annotations: true,
            experimental: true,
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('concatVendorCSS', function(){
    return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.css'])
        .pipe(concatCss("vendor.css"))
        .pipe(gulp.dest('public/vendor/'));    
});




gulp.task('default', ['connect', 'html', 'vendorjs', 'concatVendorCSS', 'js', 'serverjs']);

