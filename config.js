const path=require('path');
const util=require('./libs/util');
const wechat_file=path.join(__dirname,'./file/wechat.json');
const config = {
    "wechat": {
        "appID": "wx730666522764a093",
        "appSecret": "186c9f6fb21ca404aa447fc695ac27f0",
        "token": "charlie",
        "prefix": "https://api.weixin.qq.com/cgi-bin/",
        "mpPrefix": "https://mp.weixin.qq.com/cgi-bin/",
        getAccessToken:function () {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken:function (data) {
            data=JSON.stringify(data);
            return util.writeFileAsync(wechat_file,data)
        }
    }
};
module.exports=config;