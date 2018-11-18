var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var util=require('../libs/util');
var prefix = "https://api.weixin.qq.com/cgi-bin/";
var fs=require('fs');
var api = {
    accessToken: prefix + 'token?grant_type=client_credential'
};
function Wechat(opts) {
    var that = this;  /**/
    this.appID = opts.appID;  /*拿到appID*/
    this.appSecret = opts.appSecret;  /**/
    this.getAccessToken = opts.getAccessToken; /*获取票据的方法*/
    this.saveAccessToken = opts.saveAccessToken;  /*存储票据的方法*/
    this.fetchAccessToken()
}
Wechat.prototype.fetchAccessToken=function(data){
    var that=this;
    /*拿到票据信息*/
    if (this.access_token &&this.expires_in){
        if (this.isVaildAccessToken(this)){
            return Promise.resolve(this)
        }
    }

    this.getAccessToken()
        .then(function (data) {
            try {
                data.JSON.parse(data)
            }
            catch (e) {
                /*如果错误更新票据*/
                return that.updateAccessToken()
            }
            /*票据的合法性检查*/
            if (that.isVaildAccessToken(data)) {
                Promise.resolve(data)
            }
            else {
                return that.updateAccessToken()
            }
            /*传递合法的data*/
        }).then(function (data) {
        that.access_token = data.access_token;
        that.expires_in = data.expires_in;
        that.saveAccessToken(data)
        return Promise.resolve(data)
    })
}
/*检查合法性*/
Wechat.prototype.isVaildAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime())
    if (now < expires_in) {
        return true
    }
    else {
        return false
    }
}

/*更新票据的方法*/
Wechat.prototype.updateAccessToken = function () {
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;
    return new Promise(function (resolve, reject) {
        request({url: url, json: true}).then(function (response) {
            var data = response;
            var now = (new Date().getTime());
            var expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;
            resolve(data)
        })
    })
};
// Wechat.prototype.uploadMaterial=function(type,filepath){
//      var that=this;
//      var form={
//          media:fs.createReadStream(filepath)
//      };
//     var appID = this.appID;
//     var appSecret = this.appSecret;
//     return new Promise(function (resolve, reject) {
//         that
//             .fetchAccessToken()
//             .then(function (data) {
//                 var url = api.upload + '&access_token=' + data.access_token + '&type=' + type;
//                 request({method:'POST',url: url,formdata:form, json: true}).then(function (response) {
//                     var data = response;
//                     if (data){
//                         resolve(data)
//                     }
//                     else {
//                         throw new Error('cuowu')
//                     }
//                 })
//                     .catch(function (err) {
//                         return err
//
//                     })
//             })
//     })
//
// }
// Wechat.prototype.reply=function(ctx){
//     var content=ctx.body;
//     console.log(content)
//
//     // var message=this.weixin;
//     // console.log(this.content)
//     // var xml=util.tpl(content,message)
//     // this.status=200;
//     // this.type='application/xml';
//     // this.body='xml';
//     // console.log(message);
// }
module.exports = Wechat;
