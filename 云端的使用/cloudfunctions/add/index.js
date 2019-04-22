// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 小程序中调用云函数，执行的是index.js文件下的main函数
  console.log(event);
  console.log(context);

  const wxContext = cloud.getWXContext();
  console.log(context);


  return {
    event,
    context,
    result: event.a + event.b,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }


// 吾记日记
}