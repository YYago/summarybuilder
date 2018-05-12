const fs = require('fs');
function hasListed(summaryFilePath){
    let retHaslisted =[];
    if(fs.existsSync(summaryFilePath)){
        let sumContent = fs.readFileSync(summaryFilePath,{encoding:'utf8'});
        let reg = /\(.*\)/g;
        let listed = sumContent.match(reg);
        if(listed !==null){
            for(let i = 0; i<listed.length;i++){
                let item = listed[i].replace(/\)|\(/g,"");
                item.replace('./',"");
                item.replace('../',"");
                retHaslisted.push(item);
            }
        }
    }
    return retHaslisted;
}
module.exports = {
    hasListed
}