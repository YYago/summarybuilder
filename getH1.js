var fs = require('fs');

function getFirstH1(file) {
    var mdreg = new RegExp(/\.md$/g);
    if(mdreg.test(file)){
            var mdf = fs.readFileSync(file,{encoding:'utf-8'});
            var H1s = mdf.match(/[#](.*)/g);
            if(H1s!==null){
                var firstH1 = H1s[0].replace(/\#+/g,"");
                return firstH1;
            }
        }
}

module.exports ={
    getFirstH1
}