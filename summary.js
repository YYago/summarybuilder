#!/usr/bin/env node
var process = require('process');
var fs = require('fs');
var readline = require('readline');
var builder = require('./build');
var cf = require('./cFile');
var del = require('del');
/* console.log(process.argv0);
console.log(process.argv[2]);
console.log(typeof(process.argv[3])); */
(function(){
    if(process.argv0 =="summary"){
       var opt = process.argv[1];
       var opt1 = process.argv[2];
       var ind = process.argv[3];
    }else if(process.argv0 =="node"){
       var opt = process.argv[2];
       var opt1 = process.argv[3];
       var ind = process.argv[4];
    }
    if(opt=="-c"){
        if(fs.existsSync('./SUMMARY.md')){
            builder.build(true);
        }else{
            console.log('No such a file :\"./SUMMARY.md\" in current folder,If your have the file named "summary.md",you can rename it as SUMMARY.md and run the commands after');
        }
    }else if(opt=="-b" && opt1==undefined){
        cf.cFile(true);
    }else if(opt=="-b" && opt1=='-t'){
        cf.cFile(true,true);
    }else if(opt=="-b" && opt1 !==undefined && ind=='-t'){
        cf.cFile(true,opt1,true);
    }else if(opt=="-b" && opt1 !==undefined ){
        cf.cFile(true,opt1);
    }else if(opt == "delete"||opt =="-d"){
        del.sync(['./.li.json', './_summary.md']);
        console.log('./.li.json and ./_summary.md deleted!');
    }else{
        throw console.error("ERROR:must give an option！[-c]: create files listed in SUMMARY.md;[-b]: create file:\"_summary.md\". 必须加上参数：[-c]或者[-b]！");
    }
})();
// custom 
/**
 * 生成 _summary.md 配置
 * @param {array} ignore 数组格式,支持的格式和gulp.src([...])一样
 * @param {string} inendt 是否缩进: true | false
 */
function summaryBuild(ignore,inendt){
    cf.cFile(true,ignore,inendt);
}
/**
 * 创建 markdown 文件
 * @param {boolean} boolean just "-t"，其他的参数没有响应。 
 */
function summaryCreateFile(boolean){
    builder.build(boolean);
}
/**
 * 删除垃圾文件
 * @param {boolean} boolean just true，其他的参数没有响应。
 */
function summaryDelete(boolean){
    del.sync(['./.li.json', './_summary.md']);
    console.log('./.li.json and ./_summary.md deleted!');
}
module.exports={
    summaryBuild,
    summaryCreateFile,
    summaryDelete
}