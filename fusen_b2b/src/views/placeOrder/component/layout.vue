<template>
  <div class="content-wrapper">
    <div class="box">
      <div class="title">基本信息</div>
      <div>
        <slot name="baseInfo"></slot>
        <!--form表单-->
      </div>

      <div>
        <slot name="goodsList"></slot>
        <!--表格-->
      </div>
      <div class="title">附件上传</div>
      <el-upload
        class="upload-file"
        action="http://test.fusen.net.cn/file/upload"
        accept=".xls,.xlsx,.txt,.doc,.docx,.pdf"
        :data="parameter"
        :file-list="fileList"
        :before-remove="handleBeforRemove"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :on-preview="evebtFile"
      >
        <el-button type="primary"  v-if="editStatus">{{ uploadBtnName || '附件上传' }}</el-button>
        <div v-if="editStatus" slot="tip" class="el-upload__tip">支持上传格式：表格（*.xls; *.xlsx）  文档（*.txt; *.doc; *.docx; *.pdf ）</div>
      </el-upload>
      <el-row :gutter="100" class="producer" style="margin-top: 20px">
        <el-col :span="12" v-if="produceTime"><span style="color: rgb(178,178,178);margin-right: 20px">制单时间：</span>{{produceTime}}</el-col>
        <el-col :span="12" v-if="producer"><span style="color: rgb(178,178,178);margin-right: 20px">制单人：</span>{{producer}}</el-col>
      </el-row>
    </div>
    <!--富森订单号-->
    <!-- <div class="order" v-if="editStatus">
      <span>选择订单号：</span>
      <el-select v-model="order.fusenOrder"
                 value-key="id"
                 @change="getInvestInfo"
                 placeholder="请选择" size="mini" style="width: 130px;">
        <el-option
          v-for="(item) in takeno"
          :key="item.fusenOrder"
          :label="item.fusenOrder"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <div v-else class="order">
      富森订单号: {{order.fusenOrder}}
    </div> -->
    <!--保存/提交按钮-->
    <div class="bottom-action">
      <el-button v-if="editStatus" type="primary"
                 @click="saveOrder">保存</el-button>
      <el-button v-if="editStatus" type="success"
                 @click="submitOrder">提交</el-button>
    </div>
  </div>
</template>

<script>
  import req from '@/utils/req'
  export default {
    props: {
      order: {
        type: Object,
        default() {
          return {}
        }
      },
      uploadBtnName: {
        type: String
      },
      produceTime: {
        type: String
      },
      producer: {
        type: String
      },
      editStatus: {
        type: Boolean,
        default: true
      },
      fileListProp: {
        type: Array,
        default() {
          return []
        }
      }
    },
    watch: {
      /**
       * 传入新文件数组时,序列化文件数组
       * */
      fileListProp(fileList) {
        // 查看详情时,第一次进行文件列表序列化
        if (this.fileList.length === 0 && Array.isArray(fileList)) {
          const baseUrl = window.g.baseUrl
          fileList.forEach((file) => {
            this.fileList.push({
              id: file.id,
              name: file.fileName,
              url: `${baseUrl}file/download/${file.fileId}`
            })
          })
        }
      }
    },
    data() {
      return {
        parameter: {
          orderId: '0006C275-0000-0000-0000-00000E97FDBC',
          customId: '736CA29F-0B32-409C-9159-64F1C3EDD949'
        },
        fileList: [], // 文件列表
        takeno: [] // 富森单号列表
      }
    },
    created() {
      // 获取富森单号列表
      // this.initFsOrder()
    },
    methods: {
      initFsOrder() { // 获取富森单号
        req.get('/api/import/baseinfo/takeno').then((res) => {
          if (res.data && Array.isArray(res.data)) {
            res.data.forEach((val) => {
              this.takeno.push({
                fusenOrder: val.fusenOrder,
                numberId: val.numberId
              })
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      async saveOrder() { // 保存操作
        this.order.status = '0'
        // if (!this.order.orderId) {
        //   await this.getOrderId()
        // }
        this.$emit('submitHandle', '保存')
      },
      async submitOrder() { // 提交操作
        this.order.status = '1'
        // if (!this.order.orderId) {
        //   await this.getOrderId()
        // }
        this.$emit('submitHandle', '提交')
      },
      /**
       * 同步获取并赋值订单ID操作
       * */
      async getOrderId() {
        // 获取orderId
        let orderIdRes = await req.get('/api/import/order/orderinfo/getid').catch((err) => {
          console.log(err)
        })
        this.order.orderId = orderIdRes.orderId
      },
      // 文件上传后
      handleChange(file) {
        if (file.response) {
          this.$emit('uploadConfim', file)
        }
      },
      getInvestInfo(val) { // 选取单据编码,覆盖原有值
        this.order.fusenOrder = val.fusenOrder
        this.order.numberId = val.numberId
      },
      /**
       * 删除文件前,进行可删除判断
       * */
      handleBeforRemove() {
        this.editStatus || this.$message({ type: 'warning', message: '当前状态无法删除该文件' })
        return this.editStatus
      },
      /**
       * 删除对应显示文件
       * */
      handleRemove({ id, response, url }) {
        if (this.editStatus && (response || id || url)) {
          const currentId = id || (response && response.fileId) || url.split('download/')[1]
          req.post('api/import/file/fileinfo/del', {
            id: currentId
          }).then((res) => {
            if (res.result !== 'fail') {
              this.$notify({
                title: '成功',
                message: '附件删除成功',
                type: 'success'
              })
            }
          }).catch((error) => {
            console.log(error)
          })
          this.order.file = this.order.file.filter((v) => {
            return v.fileId !== currentId
          })
        }
      },
      // 文件下载
      evebtFile(file) {
        let url
        if (file.url) {
          url = file.url
        } else {
          let fileId = file.response.fileId
          let baseUrl = window.g.baseUrl
          url = `${baseUrl}file/download/${fileId}`
        }
        let link = document.createElement('a')
        link.setAttribute('href', url)
        link.click()
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    padding: 10px 20px;
    /*min-width: 1310px;*/
    .order{
      width: 20%;
      float: right;
      text-align: right;
    }
    .box{
      width: 80%;
      float: left;
      .item{
        position: relative;
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: white;
        border-radius: 5px;
        background: rgb(196,196,196);
      }
    }
    .title{
      border-left: 3px solid #1F9BD6;
      margin: 20px 0;
      padding-left: 20px;
      color: #1F9BD6;
    }
    .complete{
      background: #1F9BD6 !important;
      .triangle-right{
        border-left: 10px solid #1F9BD6 !important;
      }
    }
    .upload-file{
      margin-bottom: 20px;
    }
    .el-upload__tip{
      display: inline-block;
      margin-left: 20px;
      color: rgb(178,178,178)
    }
  }
  .bottom-action{
    position: fixed;
    right: 20px;
    bottom: 10px;
    text-align: right;
    margin-top: 20px
  }
  .producer{
    margin-bottom: 20px;
  }
</style>
<style lang="scss">
  .table-main{
    .cell{
      .el-input{
        input{
          text-align: center;
          border: none;
          background-color: transparent;
        }
      }
      .el-input__inner{
        padding: 0;
      }
      .el-textarea{
        textarea{
          text-align: center;
          border: none;
          background-color: transparent;
        }
      }
    }
    tbody{
      td{
        padding: 0;
      }
    }
  }
</style>
