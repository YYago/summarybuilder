function pwedu_fileAndDirCreate(filepath, writeData, isREwite) {
    let ar3 = arguments[3];
    let os = require('os');
    let path = require('path');
    let fs = require('fs');
    let systemOS = os.type();
    let filepath_dir = path.dirname(filepath);

    if (systemOS == "Windows_NT") {
        let spmRegexp = new RegExp(/\:\/|(\.\/)/g);
        if (spmRegexp.test(filepath)) {
            var dirSlipt = filepath_dir.replace(/\/|\\/g, "\\");
        } else {
            var dirSlipt = './' + filepath;
        }
        dirSlipt = path.normalize(dirSlipt);
        dirSlipt = dirSlipt.replace(/\/|\\/g, "\\");
        let sliptDIR = path.dirname(dirSlipt);
        sliptDIR = sliptDIR.split(path.sep);
        let sliptArr = [];
        for (let i = 0; i < sliptDIR.length; i++) {
            sliptArr.push(sliptDIR[i]);
            let fpPrefixer = sliptArr.join("/");
            if (fs.existsSync(fpPrefixer) == false) {
                fs.mkdirSync(fpPrefixer);
            }
        }
        if (isREwite == true) {
            fs.writeFileSync(filepath, writeData, { encoding: 'utf8', flag: 'w' }, (err) => { if (err) throw err });
        } else if (isREwite == false) {
            if (fs.existsSync(filepath) == false) {
                fs.writeFileSync(filepath, writeData, { encoding: 'utf8', flag: 'w' }, (err) => { if (err) throw err });
            }
        }

    } else {
        let spmRegexp = new RegExp(/\.\//g);
        if (spmRegexp.test(filepath) == false) {
            var filePATHs = './' + filepath;
        } else {
            var filePATHs = filepath;
        }
        let filepath_normal = path.normalize(filePATHs);
        let filepath_dir = path.dirname(filepath_normal);
        let splitDIR = filepath_dir.split(path.sep);
        console.log(splitDIR);
        let dirArr = [];
        for (let i = 0; i < splitDIR.length; i++) {
            dirArr.push(splitDIR[i]);
            let fpPrefixer = dirArr.join('/');
            if (fs.existsSync(fpPrefixer) == false) {
                fs.mkdirSync(fpPrefixer);
            }
        }
        if (isREwite == true) {
            fs.writeFileSync(filepath, writeData, { encoding: 'utf8', flag: 'w' }, (err) => { if (err) throw err });
        } else if (isREwite == false) {
            if (fs.existsSync(filepath) == false) {
                fs.writeFileSync(filepath, writeData, { encoding: 'utf8', flag: 'w' }, (err) => { if (err) throw err });
            }
        }
    }
}

module.exports = {
    pwedu_fileAndDirCreate
}