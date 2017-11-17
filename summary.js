var process = require('process');
var fs = require('fs');
var readline = require('readline');
var builder = require('./build');
var cf = require('./cFile');
var del = require('del');

(function(){
    var opt = process.argv[2];
    if(opt=="create"||opt=="-c"){
        if(fs.existsSync('./SUMMARY.md')){
            builder.build(true);
        }else{
            console.log('No such a file :\"./SUMMARY.md\" in pwd()');
        }
    }else if(opt=="build"||opt=="-b"){
        cf.cFile(true);
    }else if(opt == "delete"||opt =="-d"){
        del(['./.li.json', './_summary.md']).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'));
        });
    }else{
        throw console.error("ERROR:must give an option！[-c]: create files listed in SUMMARY.md;[-b]: create file:\"_summary.md\". 必须加上参数：[-c]或者[-b]！");
    }
})();