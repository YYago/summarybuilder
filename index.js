#!/usr/bin/env node
const process = require('process');
const del = require('del');
const builder = require('./builder');
const FileCreater = require('./createFiles');
const geth1 = require('./getH1');

const opts = process.argv;
const opt2 = process.argv[2];

let optCount = opts.length;

let optionsArr = [];

if (process.argv[3] !== undefined && process.argv[3] !== "-t") {// not -b -t 
    for (var i = 3; i < optCount; i++) {
        var sub = process.argv[i];
        optionsArr.push(sub);
    }
}

switch (opt2) {
    case "-c":
        FileCreater.cf(true);
        break;
    case "-d":
        del.sync('./.li.json');
        del.sync('./_summary.md');
        console.log('has deleted');
        break;
}

if (opt2 == "-b" && optCount > 3) {
    if (process.argv[3] !== "-t") {
        builder.buildSummary(optionsArr);
    } else {
        builder.buildSummary("-t", optionsArr);
    }
} else if (opt2 == "-b" && process.argv[3] == undefined) {
    builder.buildSummary();
}else if(opt2 =="-b" && process.argv[3]=="-t" && process.argv[4]==undefined){
    builder.buildSummary("-t");
}


module.exports = {
    summaryBuilder: builder,
    getFileHeader: geth1,
    createFiles: FileCreater,
}