var fs = require('fs');
var readline = require('readline');
var path = require('path');

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
            var fileName_dir =  path.dirname(fileName);
            if(fs.existsSync(fileName)==false){
                if(fs.existsSync(fileName_dir)){
                    fs.writeFileSync(fileName,title,{encoding:'utf8'},(err)=>{
                        if(err) throw err;
                    });
                }else{
                    fs.mkdirSync(fileName_dir);
                    fs.writeFileSync(fileName,title,{encoding:'utf8'},(err)=>{
                        if(err) throw err;
                    });
                }
            }
            
        });
    }
}

module.exports = {
    cf
}