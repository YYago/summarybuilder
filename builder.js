var gulp = require('gulp');
var gFileList = require('gulp-filelist');
var gH1 = require('./geth1');
var fs = require('fs');


function glist(srcs) {
    gulp.src(srcs)
        .pipe(gFileList('.li.json'))
        .pipe(gulp.dest('./'));
}

function buildSummary() {
    var ar0 = arguments[0];
    var ar1 = arguments[1];

    var gSRC = ['./**/*.md', './**/*.html', '!SUMMARY.md', '!node_modules/**', '!_summary.md'];

    if (ar0 == undefined || ar1 == undefined) {
        glist(gSRC);
    } else if (typeof(ar0) == "object") {
        var gSRCs = [...gSRC, ...ar0];
        glist(gSRCs);
    } else if (typeof (ar1) == "object") {
        var gSRCs = [...gSRC, ...ar1];
    }

    setTimeout(function () {  // gulp 是否完成无法确定，只好等上3秒。我觉得应该够了.....
        if (fs.existsSync('./.li.json')) {
            var fcount = JSON.parse(fs.readFileSync('./.li.json'));
            var foooo = [];
            if (fcount[0] !== undefined) {
                for (var i = 0; i < fcount.length; i++) {
                    var CFpath = fcount[i];
                    var CFtitle = gH1.getFirstH1(fcount[i],"both");
                    if (ar0 == "-t") {
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
    }, 5000);
    console.log("ok");
}

module.exports = {
    buildSummary
}