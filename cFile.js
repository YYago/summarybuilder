var gulp = require('gulp');
var gFileList = require('gulp-filelist');
var gH1 = require('./geth1');
var fs = require('fs');

function cFile(bool) {
    if (bool == true) {
        gulp.src(['./**/*.md', './**/*.html', '!SUMMARY.md', '!node_modules/**/*.*'])
            .pipe(gFileList('.li.json'))
            .pipe(gulp.dest('./'));

    }
    setTimeout(function(){  // gulp 是否完成无法确定，只好登上3秒。我觉得应该够了.....
        if (fs.existsSync('./.li.json')) {
            var fcount = JSON.parse(fs.readFileSync('./.li.json'));
            var foooo = [];
            if (fcount[0] !== undefined) {
                for (var i = 0; i < fcount.length; i++) {
                    var CFpath = fcount[i];
                    var CFtitle = gH1.getFirstH1(fcount[i]);
                    var foo_item = '* [' + CFtitle + '](' + CFpath + ')';
                    foooo.push(foo_item);
                }
                var datas = foooo.join('\n');
                fs.writeFile('_summary.md', datas, { encoding: 'utf8', flag: 'w' }, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
    }
    },3000);
}
module.exports={
    cFile
}