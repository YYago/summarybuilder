"use strict";
var fs = require('fs');
var readline = require('readline');
var path = require('path');
const chalk = require('chalk');
const nNmc = require('node-modules-custom');
function cf(bool) {
    if (bool == true) {
        var rl = readline.createInterface({
            input: fs.createReadStream('./SUMMARY.md')
        });
        rl.on('line', function (line) {
            var title = line.match(/\[[\s\S]*\]\B/g);
            title = '# ' + title[0].replace(/^\[|\]$/g, "");
            var filePath = line.match(/\]\([\w\W]*\)\B/g);// fix: 匹配上出了问题——如果像这样： `* [title(hello)](hi.md)` 路径就会可能变成 hello]/hi.md,修复： 将路径匹配范围改为 "](...)" Note: 这个BUG可能依旧会存在：当出现类似:"* [[title](hello)](hi.md)"时，只能警示用户此BUG的存在，让用户在创建文件之前修改标题以避免类似的情况发生。
            var fileName = filePath[0].replace(/[\]\(\)]/g,"");// fix: 将多余的“]”去掉。
            nNmc.fs_wfSync(fileName,title,false)
            console.log(`${chalk.yellow('summarybuilder:  ')}`+fileName+'.........ok');
        });
    }
}
/**
 * 基于类似SUMMARY.md的列表创建对应的markdown文件。
 * @param {string} summaryFilePath 具有和SUMMARY.md 相同内容格式的文件的路径.
 * @description 其实，不一定只能创建markdown文件，可以是其他的文件。只是二进制类型之类的文件可能会出现不能读取的情形又或者生成的文件格式、语法错误。所以要尽量出现类似的文件。
 */
function onlyCreateFrom(summaryFilePath){
    /**
     * @var {string} agm 额外需要写入文件的内容。
     */
    var agm = arguments[1];
    var ostpye = require('os').type;
    if(fs.existsSync(summaryFilePath)){
        var rl = readline.createInterface({
            input: fs.createReadStream(summaryFilePath)
        });
        rl.on('line', function (line) {
            var title = line.match(/\[[\s\S]*\]\B/g);
            title = '# ' + title[0].replace(/^\[|\]$/g, "");
            var filePath = line.match(/\]\([\w\W]*\)\B/g);
            var fileName = filePath[0].replace(/[\]\(\)]/g,"");
            if(ostpye=="Windows_NT" && agm!==undefined){
                var wData = title + '\r\n'+agm;
                nNmc.fs_wfSync(fileName,wData,false)
            }else if(ostpye !=="Windows_NT" && agm!==undefined){
                var wData = title + '\n'+agm;
                nNmc.fs_wfSync(fileName,wData,false)
            }else{
                nNmc.fs_wfSync(fileName,title,false)
            }
            console.log(`${chalk.yellow('summarybuilder:  ')}`+fileName+'.........created!');
        });
    }else{
        console.log(`${chalk.yellow('summarybuilder:  ')}找不到文件(No such file)--`+summaryFilePath)
    }
}
module.exports = {
    cf,
    onlyCreateFrom
}