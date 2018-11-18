const sign = {};
const Wechat = require('./wechat'); //工具函数
const sha1 = require('sha1');  //加密认证
const getRawBody = require('raw-body');  //获取微信返回的xml信息
const xml2js=require('xml2js');   //处理xml信息
const reply=require('./reply');  //处理回复
/**/
sign.sign = function (config,handler) {
    var wechat = new Wechat(config);
    return async (ctx) => {
        var token = config.token;
        var signature = ctx.request.query.signature;
        var nonce = ctx.request.query.nonce;
        var timestamp = ctx.request.query.timestamp;
        var echostr = ctx.request.query.echostr;
        let str = [token, timestamp, nonce].sort().join('');
        var sha = sha1(str);
        if (ctx.request.method === "GET") {
            // ctx.body = sha === signature ? echostr + '' : 'failed'
            if (sha === signature) {
                console.log("连接成功");
                ctx.response.body = echostr + '';
            } else {
                console.log("get fail");
                ctx.response.body = "wrong";
            }
        }
        else if (ctx.request.method === "POST") {
            if (sha !== signature) {
                console.log("post fail");
                return false;
            }
            const xml = await getRawBody(ctx.req, {
                length: ctx.request.length,
                limit: '1mb',
                encoding: ctx.request.charset || 'utf-8'
            });

            /*处理xml信息*/
            function parseXML(xml) {
                return new Promise((resolve, reject) => {
                    xml2js.parseString(xml, {
                        trim: true,
                        explicitArray: false,
                        ignoreAttrs: true
                    }, function (err, result) {
                        if (err) {
                            return reject(err)
                        }
                        resolve(result.xml)
                    })
                })
            }
            const formatted = await parseXML(xml);
            // this.weixin=formatted;
            // await handler.call(this);
            // wechat.reply.call(this);
            let content = '';
            if (formatted.Content === '音乐') {
                content = {
                    type: 'music',
                    content: {
                        title: 'Lemon Tree',
                        description: 'Lemon Tree',
                        musicUrl: 'http://mp3.com/xx.mp3'
                    },
                }
            } else if (formatted.MsgType === 'text') {
                content = formatted.Content
            } else if (formatted.MsgType === 'image') {
                content = {
                    type: 'image',
                    content: {
                        mediaId: formatted.MediaId
                    },
                }
            } else if (formatted.MsgType === 'voice') {
                content = {
                    type: 'voice',
                    content: {
                        mediaId: formatted.MediaId
                    },
                }
            } else {
                content = 'hello'
            }
            const replyMessageXml = reply(content, formatted.ToUserName, formatted.FromUserName);
            ctx.type = 'application/xml';
            return ctx.body = replyMessageXml
        }
    }
};
module.exports = sign;
