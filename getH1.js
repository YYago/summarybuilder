const fs = require('fs');

var htmlreg = new RegExp(/\.html$/g);
var mdreg = new RegExp(/\.md$/g);
// html
function typeHTML(fPath) {
    if (htmlreg.test(fPath)) {
        var htmf = fs.readFileSync(fPath, { encoding: 'utf-8' });
        var H1s = htmf.match(/<h1(.*)<\/h1>/g);
        if (H1s !== null) {
            var firstH1 = H1s[0].match(/>.*?</g);
            H1 = firstH1[0].replace(/[<|>]/g, "");
            return H1;
        }
    }
}
// md
function typeMD(fPath) {
    if (mdreg.test(fPath)) {
        var mdf = fs.readFileSync(fPath, { encoding: 'utf-8' });
        var H1s = mdf.match(/[#](.*)/g);
        if (H1s !== null) {
            var firstH1 = H1s[0].replace(/\#+/g, "");
            return firstH1;
        }
    }
}
function getFirstH1(FilePath, filetype) {
    if (fs.existsSync(FilePath)) {
        switch (filetype) {
            case "html":
                typeHTML(FilePath);// just html
                break;
            case "md":
                typeMD(FilePath); // just md
            case "both":
                if (mdreg.test(fPath)) {
                    var mdf = fs.readFileSync(fPath, { encoding: 'utf-8' });
                    var H1s = mdf.match(/[#](.*)/g);
                    if (H1s !== null) {
                        var firstH1 = H1s[0].replace(/\#+/g, "");
                        return firstH1;
                    }
                }else ifif (mdreg.test(fPath)) {
                    var mdf = fs.readFileSync(fPath, { encoding: 'utf-8' });
                    var H1s = mdf.match(/[#](.*)/g);
                    if (H1s !== null) {
                        var firstH1 = H1s[0].replace(/\#+/g, "");
                        return firstH1;
                    }
                }
                break;
        }
    }
}
module.exports = {
    getFirstH1
}