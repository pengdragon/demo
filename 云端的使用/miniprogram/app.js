//app.js
App({


  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      // app启动时初始化云开发
      wx.cloud.init({
        // 追踪用户信息
        traceUser: true,
      })
    }

  }




})
