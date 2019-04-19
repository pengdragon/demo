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
          <el-form-item label="我的订单号：" class="formItem">
            <el-input v-model="formData.myOrder"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="采购日期：" class="formItem">
            <el-date-picker
              v-model="formData.date"
              class="inputBox"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="供应商：" class="formItem term">
            <el-input v-model="formData.supplier"
                      class="inputBox"
                      suffix-icon="el-icon-search"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="是否垫资：" class="formItem">
            <el-radio v-model="formData.pad" label="垫资" :value="'垫资'">垫资</el-radio>
            <el-radio v-model="formData.pad" label="不垫资" :value="'不垫资'">不垫资</el-radio>
          </el-form-item>
          <el-form-item label="币别：" class="formItem">
            <el-select v-model="formData.currency" class="inputBox" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注:" class="formItem">
            <el-input v-model="formData.desc"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="tableView-wrapper">
        <div class="title">采购明细</div>
        <tabTmp :tabData="orderListData"
                :openDbClick="true"
                @dbClickCell="dbClickCell"
                @getSelectResult="getSelectResult"
                :showHandle="true"
                @deleteItem="deleteItem"
                :tabTagData="tabTagData">
        </tabTmp>
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
        <el-button type="info" @click="$router.back(-1)">返回</el-button>
        <el-button type="primary" @click="submitHandle(0)">打印</el-button>
        <el-button type="primary" @click="submitHandle(0)">保存</el-button>
        <el-button style="background: #42B983;color: #fff;" @click="submitHandle(0)">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import tabTmp from '@/components/tabTemplate'
  export default {
    data() {
      return {
        activeIndex: 1,
        formData: {
          myOrder: '', // 我的订单号
          date: '', // 采购日期
          supplier: '', // 供应商
          pad: '', // 是否垫资
          currency: '', // 币别
          desc: '', // 备注
          file: []
        },
        fileList: [
          // { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        ],
        options: [
          {
            value: '选项1',
            label: 'RMB'
          }, {
            value: '选项2',
            label: 'USB'
          }, {
            value: '选项3',
            label: '日元'
          }, {
            value: '选项4',
            label: '法郎'
          }, {
            value: '选项5',
            label: '英镑'
          }
        ],
        tabTagData: [
          {
            label: '品名',
            prop: 'productName',
            width: ''
          },
          {
            label: '型号',
            prop: 'modelNum',
            width: ''
          },
          {
            label: '数量',
            prop: 'number',
            width: ''
          },
          {
            label: '单价',
            prop: 'price',
            width: ''
          },
          {
            label: '单位',
            prop: 'unit',
            width: ''
          },
          {
            label: '品牌',
            prop: 'brand',
            width: ''
          },
          {
            label: '产地',
            prop: 'place',
            width: ''
          }
        ],
        orderListData: [
          {
            productName: '二极管',
            modelNum: 'FV8899',
            number: '888888',
            price: '2000',
            unit: '个',
            brand: '飞利浦',
            place: ''
          },
          {
            productName: '二极管',
            modelNum: 'FV8899',
            number: '888888',
            price: '2000',
            unit: '个',
            brand: '飞利浦',
            place: ''
          }
        ]
      }
    },
    methods: {
      deleteItem(index) {
        this.orderListData.splice(index, 1)
      },
      dbClickCell(row) {
        console.log(row)
      },
      getSelectResult(val) {
        console.log(val)
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
    },
    components: {
      tabTmp
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 15px 0 90px 20px;
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
        .inputName{
          width: 120px;
        }
        .inputNum{
          width: 100px;
          margin-right: 5px;
        }
        .inputTel{
          width: 235px;
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
