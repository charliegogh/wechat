/*存储AccessToken信息*/
var fs=require('fs');
var Promise = require('bluebird');
// var tpl=require('../common/tpl')
exports.readFileAsync=function (fpath,encoding) {
return new Promise(function (resolve,reject) {
    fs.readFile(fpath,encoding,function (err,content) {
        if (err)reject(err)
        else resolve(content)
    })
})
};
exports.writeFileAsync=function (fpath,content) {
    return new Promise(function (resolve,reject) {
        fs.writeFile(fpath,content,function (err) {
            if (err)reject(err)
            else resolve()
        })
    })
};
exports.tpl=function (content,message) {
    var info = {};
    var type = 'text';
    info.content = content || '';
    if (Array.isArray(content)) {
        type = 'news'
    } else if (typeof content === 'object') {
        if (content.hasOwnProperty('type')) {
            type = content.type;
            info.content = content.content
        } else {
            type = 'music'
        }
    }
    info.msgType = type;
    info.createTime = new Date().getTime();
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;
    return tpl.compiled(info)
    
}