var fs = require('fs');
var readline = require('readline');
var path = require('path');
var fpc = require('./fsAndPathContrl');
function cf(bool) {
    if (bool == true) {
        var rl = readline.createInterface({
            input: fs.createReadStream('./SUMMARY.md')
        });
        rl.on('line', function (line) {
            var title = line.match(/\[[\s\S]*\]\B/g);
            title = '# ' + title[0].replace(/^\[|\]$/g, "");
            var filePath = line.match(/\([\w\W]*\)\B/g);
            var fileName = filePath[0].replace(/[\(\)]/g,"");
            fpc.pwedu_fileAndDirCreate(fileName,title,false);
            console.log(fileName+'.........ok');
        });
    }
}

module.exports = {
    cf
}