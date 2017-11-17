var fs = require('fs');
var readline = require('readline');
var path = require('path');

function build(bool) {
    if (bool == true) {
        var rl = readline.createInterface({
            input: fs.createReadStream('./SUMMARY.md')
        });
        rl.on('line', function (line) {
            var title = line.match(/\[[\s\S]*\]\B/g);
            title = '# ' + title[0].replace(/^\[|\]$/g, "");
            var filePath = line.match(/\([\w\W]*\)\B/g);
            filePath = filePath[0].replace('(', "").replace(')', "").replace('./', "");// note: 替换掉前缀“./”
            if (fs.existsSync(filePath) !== true) {
                var porint = new RegExp('/');
                if (porint.test(filePath)) {
                    var p = filePath.replace(/\/\w+\.\w+/, "");
                    if(fs.existsSync(p)!==true){
                        fs.mkdir(p);
                    }                
                }
                fs.writeFileSync(filePath, title, { encoding: 'utf8', flag: 'w' }, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
        });
    }
}

module.exports = {
    build
}