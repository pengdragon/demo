<template>
  <div class="content-wrapper">
    <div class="orderNum">单据编号：987655</div>
    <el-row>
      <el-col class="form-wrapper">
        <div class="title">基本信息</div>
        <el-form :label-width="'110px'"
                 :model="formData"
                 size="small"
                 class="form-content">
          <el-form-item label="项目号:" class="formItem">
            <el-input v-model="formData.productNum"
                      class="inputBox"
                      placeholder="项目号"></el-input>
          </el-form-item>
          <el-form-item label="金额:" class="formItem">
            <el-input v-model="formData.money"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="银行:" class="formItem term">
            <el-input v-model="formData.bank"
                      class="inputBox"
                      placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="账号:" class="formItem">
            <el-input v-model="formData.amount"
                      class="inputBox"
                      placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="预计到款时间:" class="formItem">
            <el-date-picker
              v-model="formData.date"
              type="date"
              class="inputBox"
              placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注:" class="formItem">
            <el-input v-model="formData.desc"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="upload-wrapper">
        <div class="title">附件上传</div>
        <el-upload
          class="upload-content"
          action="#"
          accept=".xls,.xlsx,.txt,.doc,.docx,.pdf"
          :httpRequest="upLoad"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">支持上传文件:表格(*.xls;*.xlsx) 文档(*.txt,*.doc,*.docx,*.pdf)</div>
        </el-upload>
        <div class="make-content">
          <span class="makeTime">制单时间: 2018-03-14 18:22:50</span>
          <span class="maker">制单人: 杨朝妮</span>
        </div>
      </el-col>
      <el-col class="submit-wrapper">
        <el-button type="info" @click="back">返回</el-button>
        <el-button type="primary" @click="submitHandle(0)">保存</el-button>
        <el-button style="background: #42B983;color: #fff;" @click="submitHandle(0)">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: 1,
        formData: {
          productNum: '', // 项目号
          money: '', // 金额
          bank: '', // 银行
          amount: '', // 账号
          date: '', // 预计到款时间
          desc: '', // 备注
          file: []
        },
        fileList: [
          // { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        ]
      }
    },
    methods: {
      back() {
        this.$router.back(-1)
      },
      handleRemove(file) { // 删除对应显示文件
        this.fileList = this.fileList.filter((item) => {
          return item.name !== file.name
        })
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file) {
        return this.$confirm(`确实要删除${file.name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      upLoad(item) { // 上传方法
        // 处理item,获取文件名
        let formData = new FormData()
        formData.append('file', item.file)
        formData.append('name', '测试文本')
        let orderId = this.formData.orderId
        formData.append('orderId', orderId)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$http.post('http://203.86.26.27:9982/file/upload', formData, config).then((result) => {
          if (result.status !== 200) {
            this.$message({
              message: '网络故障请重试!',
              type: 'warning'
            })
            return
          }
          // 上传完需要的字段,文件id,文件上传后下载地址,文件名,文件后缀,
          let res = result.data
          let fileName = item.file.name
          let fileType = fileName.split('.')
          fileType = fileType[fileType.length - 1]
          let fileId = res.fileId
          let fileDownloadUrl = 'http://10.1.1.42:9982/file/download/' + fileId
          // 上传完文件,则重新修改查询文件列表,重新渲染页面
          this.fileList.push(
            {
              name: fileName,
              url: fileDownloadUrl
            }
          )
          // 修改提交要提交表单数据中的file数组
          let uuid = this.$getid()
          // fileName 不能重复------------------
          this.formData.file.push({
            'id': uuid,
            'fileName': fileName,
            'fileType': fileType,
            'fTypeName': fileType.length,
            'fileId': fileId
          })
          // todo 删除操作还未完成可暂时不处理
          // 修改显示文件lisit,并修改对应网址,进行删除操作
          // 删除请求,删除对应form中的file数组内容
          // todo 保存业务信息后,初次进入页面进行根据订单号查询文件列表
          // 查询文件列表
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 15px 0 90px 20px;
    min-height: 898px;
  .title{
    display: block;
    height: 22px;
    line-height: 22px;
    padding-left: 12px;
    border-left: 2px solid #01B8E1;
    font-size: 17px;
    font-weight: 600;
    color: #09BAE3;
    margin-bottom: 15px;
  }
  .orderNum{
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .form-content {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
  .radioBox{
    -webkit-box-flex: 0;
    -ms-flex: 0 0 40%;
    flex: 0 0 100%;
  }
  .formItem {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 40%;
    flex: 0 0 40%;
  .inputBox{
    width: 360px;
  }
  }
  .Shipments{
    flex: 0 0 100%;
  }
  }
  .upload-wrapper{
    width: 530px;
    margin-top: 30px;
  .make-content{
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 30px;
    font-size: 14px;
  }
  .upload-content{
    margin-bottom:10px;
  .el-upload__tip{
    display: inline-block;
    margin-left: 10px;
  }
  }
  }
  .submit-wrapper{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    position: absolute;
    right: 20px;
    bottom: 0px;
  }
  }
</style>
