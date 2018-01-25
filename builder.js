var gulp = require('gulp');
var gFileList = require('gulp-filelist');
var gH1 = require('./geth1');
var fs = require('fs');


function glist(srcs) {
    gulp.src(srcs)
        .pipe(gFileList('.li.json'))
        .pipe(gulp.dest('./'));
}

function buildSummary(arr) {
    var opt_t=arr[0];
    var gSRC = ['./**/*.md', './**/*.html', '!SUMMARY.md', '!node_modules/**', '!_summary.md'];
    if(arr==null){
        glist(gSRC);
    }else if(arr!==undefined && arr[0]=="-t"){
        var arrs = arr.splice(0,1);
        var gSRCs = [...gSRC,...arr];
        glist(gSRCs);
    }else{
        var gSRCs = [...gSRC,...arr];
        glist(gSRCs);
    }
    setTimeout(function () {  // gulp 是否完成无法确定，只好等上3秒。我觉得应该够了.....
        if (fs.existsSync('./.li.json')) {
            var fcount = JSON.parse(fs.readFileSync('./.li.json'));
            var foooo = [];
            if (fcount[0] !== undefined) {
                for (var i = 0; i < fcount.length; i++) {
                    var CFpath = fcount[i];
                    var CFtitle = gH1.getFirstH1(fcount[i],"both");
                    if (arr!==null && opt_t == "-t") {
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
                console.log("ok");
            }
        }
    }, 5000);
}
// for gulp
/**
 * Run only in the specified folder
 * 
 * @param {string} jsonFileName The path of the JSON file.It's better to be created by the plugin: gulp-filelist.
 * @param {boolean} isIndent indent? If'true'will be indented.
 * @param {string} outFileName Like this: 'a.md',Any you wanted if you sure it can be read.
 */
function onlySmHere(jsonFileName,isIndent,outFileName){
    if (fs.existsSync(jsonFileName)) {
        var fcount = JSON.parse(fs.readFileSync(jsonFileName));
        var foooo = [];
        if (fcount[0] !== undefined) {
            for (var i = 0; i < fcount.length; i++) {
                var CFpath = fcount[i];
                var CFtitle = gH1.getFirstH1(fcount[i],"both");
                if ( isIndent == true) {
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
            fs.writeFile(outFileName, datas, { encoding: 'utf8', flag: 'w' }, function (err) {
                if (err) {
                    throw err;
                }
            });
            console.log(outFileName+"ok");
        }
    }else{
        console.log("No such a file names:"+jsonFileName+'. It is better to be created by the plugin: gulp-filelist.And sure all path of the list in '+jsonFileName+' are existent.')
    }
}
module.exports = {
    buildSummary,
    onlySmHere
}