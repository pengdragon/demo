// miniprogram/pages/database/database.js
Page({

  onReady(){
    // 获得数据库
    const db = wx.cloud.database({
      // env: 'test-746be3'
    });

    // 获得数据库的集合
    this.users = db.collection('users');

    this.find();
  },

  add(){
    

    // 操作数据库，添加一条用户数据
    this.users.add({
      data: {
        name: '李四',
        age: 20,
        gender: false
      },
      success(res){
        console.log(res);
      },
      fail(error){
        console.log(error);
      }

    })

    
    

  },

  update(){
    this.users.doc('XGz2OXkPDdDCJ5qL').update({
      data: {
        name: '赵六'
      },
      success(res) {
        console.log('成功');
        console.log(res);
      },
      fail(error) {
        console.log('失败');
        console.log(error);
      }
    })
  },

  find(){
    let _ = wx.cloud.database().command;

    this.users.where({
      age: _.gt(18)
    }).get({
      success(res){
        console.log(res);
      }
    })
  }



})