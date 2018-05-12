var gulp = require('gulp');
var gFileList = require('gulp-filelist');
var gH1 = require('./getH1');
var fs = require('fs');
const chalk = require('chalk');
const lodash = require('lodash');
const haslisted = require('./getHasListed');

function glist(srcs) {
    gulp.src(srcs)
        .pipe(gFileList('.li.json'))
        .pipe(gulp.dest('./'));
}

function buildSummary(arr) {
    var opt_t=arr[0];
    var gSRC = ['./**/*.md', '!SUMMARY.md', '!node_modules/**', '!_summary.md'];
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
            if(fs.existsSync('SUMMARY.md')){
                fcount = lodash.without(fcount,...haslisted.hasListed('SUMMARY.md'));
            }
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
                console.log(`${chalk.yellow('summarybuilder:  ')}`+"_summary.md has updated!");
            }else{
                fs.writeFileSync('_summary.md',"nothing!",{ encoding: 'utf8', flag: 'w' });
                console.log(`${chalk.yellow('summarybuilder:  ')}`+"can't find any .md files,or both has listed in SUMMARY.md , the summary.md is 'nothing'");
            }
        }
    }, 3000);
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
        if(fs.existsSync('SUMMARY.md')){
            fcount = lodash.without(fcount,...haslisted.hasListed('SUMMARY.md'));
        }
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
            console.log(`${chalk.yellow('summarybuilder:  ')}`+outFileName+"......ok");
        }
    }else if(typeof(jsonFileName)=="object"){
        var fcount = jsonFileName;
        var foooo = [];
        if(fs.existsSync('SUMMARY.md')){
            fcount = lodash.without(fcount,...haslisted.hasListed('SUMMARY.md'));
        }
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
            console.log(`${chalk.yellow('summarybuilder:  ')}`+outFileName+" ....... ok");
        }
        
    }else{
        console.log(`${chalk.yellow('summarybuilder:  ')}`+"No such a file names:"+jsonFileName+'. It is better to be created by the plugin: gulp-filelist.And sure all path of the list in '+jsonFileName+' are existent.');
        console.log(`${chalk.yellow('summarybuilder:  ')}`+' You can use an array type variable ,or like this: SBer_summary(["a.md","b/a.md"],true,"mySummary.md"). ')
    }
}
/**
 * 
 * @param {Array} arr .md files
 * @example buildSummaryHere(['-t','docs/*.md'])
 */
function buildSummaryHere(arr) {
    var opt_t=arr[0];
    var gSRC = ['./**/*.md','!SUMMARY.md', '!node_modules/**', '!_summary.md'];
    var ignores = ['!SUMMARY.md', '!node_modules/**', '!_summary.md'];
    if(arr==null){
        glist(gSRC);
    }else if(arr!==undefined && arr[0]=="-t" && arr[1] ==undefined){
        var arrs = arr.splice(0,1);
        var gSRCs = [...gSRC,...arr];
        glist(gSRCs);
    }else{
        var gSRCs = [...ignores,...arr];
        glist(gSRCs);
    }
    setTimeout(function () {  // gulp 是否完成无法确定，只好等上3秒。我觉得应该够了.....
        if (fs.existsSync('./.li.json')) {
            var fcount = JSON.parse(fs.readFileSync('./.li.json'));
            var foooo = [];
            if(fs.existsSync('SUMMARY.md')){
                fcount = lodash.without(fcount,...haslisted.hasListed('SUMMARY.md'));
            }
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
                console.log(`${chalk.yellow('summarybuilder:  ')}`+"_summary.md......ok");
            }else{
                fs.writeFileSync('_summary.md',"nothing!",{ encoding: 'utf8', flag: 'w' })
            }
        }
    }, 3000);
}
module.exports = {
    buildSummary,
    onlySmHere,
    buildSummaryHere
}