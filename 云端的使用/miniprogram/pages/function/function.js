Page({
  onReady(){
    //调用云函数
    let promise = wx.cloud.callFunction({
      name: 'add',
      data: {
        a: 1,
        b: 2
      }
    });

    promise.then(res=>{
      console.log(res);
    })
    
  }
})