var gulp = require('gulp');
var gFileList = require('gulp-filelist');
var gH1 = require('./geth1');
var fs = require('fs');

function cFile(bool) {
    var smArg = arguments[1];
    var indent = arguments[2];
    var regexps = new RegExp(/[\[\]]/g);
    if (bool == true && smArg == undefined) {
        gulp.src(['./**/*.md', './**/*.html', '!SUMMARY.md', '!node_modules/**', '!_summary.md'])
            .pipe(gFileList('.li.json'))
            .pipe(gulp.dest('./'));
            
    } else if (bool == true && regexps.test(smArg)) {
        var ignoefoo = ['./**/*.md', './**/*.html', '!SUMMARY.md', '!node_modules/**', '!_summary.md'];
        var ig = smArg.replace(/[\[\]]/g, "");
        var ignores = [...ignoefoo, ig];
        // console.log(ignores);
        gulp.src(ignores)
            .pipe(gFileList('.li.json'))
            .pipe(gulp.dest('./'));

    } else if (bool == true && typeof(smArg)=="object") {
        var ignoefoo = ['./**/*.md', './**/*.html', '!SUMMARY.md', '!node_modules/**', '!_summary.md'];
        var ignores = [...ignoefoo, smArg];
        // console.log(ignores);
        gulp.src(ignores)
            .pipe(gFileList('.li.json'))
            .pipe(gulp.dest('./'));
    } else if (bool == true && smArg == true) {
        gulp.src(['./**/*.md', './**/*.html', '!SUMMARY.md', '!node_modules/**', '!_summary.md'])
            .pipe(gFileList('.li.json'))
            .pipe(gulp.dest('./'));
    }
    setTimeout(function () {  // gulp 是否完成无法确定，只好等上3秒。我觉得应该够了.....
        if (fs.existsSync('./.li.json')) {
            var fcount = JSON.parse(fs.readFileSync('./.li.json'));
            var foooo = [];
            if (fcount[0] !== undefined) {
                for (var i = 0; i < fcount.length; i++) {
                    var CFpath = fcount[i];
                    var CFtitle = gH1.getFirstH1(fcount[i]);
                    if (smArg == true || indent == true) {
                        var prefix = '\ \ ';
                        var spsign = CFpath.match(/\//g);
                        if (spsign !== null) {
                            var spsignCount = spsign.length;
                            var prefixRep = prefix.repeat(spsignCount);
                            var foo_item = prefixRep + '* [' + CFtitle + '](' + CFpath + ')';
                            foooo.push(foo_item);
                        } else {
                            var foo_item = '* [' + CFtitle + '](' + CFpath + ')';
                            foooo.push(foo_item);
                        }
                    } else {
                        var foo_item = '* [' + CFtitle + '](' + CFpath + ')';
                        foooo.push(foo_item);
                    }
                }
                var datas = foooo.join('\n');
                fs.writeFile('_summary.md', datas, { encoding: 'utf8', flag: 'w' }, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
    }, 3000);
}
module.exports = {
    cFile
}