Page({
  data: {
    imgPath: '',
    videoPath: ''
  },
  onReady(){

    this.uploadImg();

  },

  uploadImg(){
    // 选择图片
    wx.chooseImage({
      success:  (res)=>{
        let path = res.tempFilePaths[0];
        // 上传图片
        wx.cloud.uploadFile({
          cloudPath: 'header-images/test.png',
          filePath: path,
          success: (res)=>{
            console.log('成功');
            console.log(res);

            // 通过图片id换取临时路径
            wx.cloud.getTempFileURL({
              fileList: [
                res.fileID
              ],
              success: (res)=>{
                //获得路径
                console.log(res.fileList[0].tempFileURL);
     
                this.setData({ imgPath: res.fileList[0].tempFileURL });
              }
            })

          },
          fail(error){
            console.log('失败');
            console.log(error);
          }
        });
      }
    })
  },

  uploadVideo(){
    //录制视频
    wx.chooseVideo({
      success(res){
        console.log(res);
        //上传视频
        wx.cloud.uploadFile({
          cloudPath: 'video/test.mp4',
          filePath: res.tempFilePath,
          success: (res) => {
            console.log('成功');
            console.log(res);

            // 通过视频id换取临时路径
            wx.cloud.getTempFileURL({
              fileList: [
                res.fileID
              ],
              success: (res) => {
                //获得路径
                console.log(res.fileList[0].tempFileURL);
                this.setData({ videoPath: res.fileList[0].tempFileURL });
              }
            })

          },
          fail(error) {
            console.log('失败');
            console.log(error);
          }
        });
      }
    })
  }
})