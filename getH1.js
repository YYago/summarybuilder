var fs = require('fs');

function getFirstH1(file) {
    var htmlreg = new RegExp(/\.html$/g);
    var mdreg = new RegExp(/\.md$/g);
    if (fs.existsSync(file)) {
        if (htmlreg.test(file)) {
            var htmf = fs.readFileSync(file, { encoding: 'utf-8' });
            var H1s = htmf.match(/<h1(.*)<\/h1>/g);
            if (H1s !== null) {
                var firstH1 = H1s[0].match(/>.*?</g);
                H1 = firstH1[0].replace(/[<|>]/g, "");
                return H1;
            }
        }else if(mdreg.test(file)){
            var mdf = fs.readFileSync(file,{encoding:'utf-8'});
            var H1s = mdf.match(/[#](.*)/g);
            if(H1s!==null){
                var firstH1 = H1s[0].replace(/\#+/g,"");
                return firstH1;
            }
        }
    }
}

module.exports ={
    getFirstH1
}