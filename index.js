#!/usr/bin/env node
const process = require('process');
const del = require('del');
const builder = require('./builder');
const FileCreater = require('./createFiles');
const geth1 = require('./getH1');
const chalk = require('chalk');

const opts = process.argv;
const opt2 = process.argv[2];

let optCount = opts.length;

let optionsArr = [];

if (process.argv[3] !== undefined &&optCount>3) {
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
        console.log(`${chalk.yellow('summarybuilder:  ')}`+'Temporary Files has deleted!');
        break;
}
// node index -b -t !ignore
if (opt2 == "-b") {
    builder.buildSummary(optionsArr);
}
const SBer_summary = require('./builder').onlySmHere;
const SBer_createMD = require('./createFiles').onlyCreateFrom;
const SBer_summaryMDs = require('./builder').buildSummaryHere;
module.exports = {
    SBer_summary,
    SBer_createMD,
    SBer_summaryMDs
}