const Koa = require('koa');
const config=require('./config');
const sign=require('./common/sign');  //微信认证
// const weixin=require('./weixin')
var app = new Koa();
app.use(sign.sign(config.wechat));
app.listen(3000, () => {
    console.log('node starte' +
        'd port 3000')
});