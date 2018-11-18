exports.reply=async (ctx,next)=>{
    var message=this.weixin;
    // console.log(message);
    // if (message.MsgType==='event'){
    //     if (message.Event==='subscribe'){
    //         if (message.EventKey){
    //             console.log(1)
    //         }
    //         ctx.body='订阅了大哥'
    //     }
    //     else if (message.Event=='unsubscribe'){
    //         console.log('取关了    ')
    //     }
    // }

    // else {
    //
    // }
    await next
}