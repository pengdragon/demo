<template>
  <div class="content-wrapper" v-loading="loadState">
    <!--文件上传弹框-->
    <uploadCmp :showDialog="showUpload"
               :uploadClose="true"
               :importTabTagData="tabTagData"
               :acceptType="'.xlsx'"
               :downloadModelUrl="'https://test.fusen.net.cn/file/download/5c81efc0ea1c9c6cabd31f7a'"
               @importFileHandle="getImportTabData"
               @closeHandle="showUpload = false"></uploadCmp>
      <div class="form-wrapper">
        <div class="title">收款信息</div>
        <el-form :label-width="'120px'"
                 :model="formData"
                 :rules="formRules"
                 ref="formMain"
                 size="small"
                 class="form-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="收款方:"
                            prop="gatheringCompany">
                <el-select v-model="formData.gatheringCompany"
                           v-if="editState"
                           filterable
                           @change="gatheringCompanyChange"
                           class="inputBox"
                           placeholder="请选择收款方">
                  <el-option
                    v-for="item in gatheringCompanyList"
                    :key="item.company"
                    :label="item.company"
                    :value="item.company">
                  </el-option>
                </el-select>
                <div v-else>{{formData.gatheringCompany}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收款银行:" prop="gatheringBank">
                <el-input v-model="formData.gatheringBank"
                          disabled
                          v-if="editState"
                          class="inputBox"
                          placeholder="请输入银行名称"></el-input>
                <div v-else>{{formData.gatheringBank}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="收款账号:" prop="gatherinAccount">
                <el-input v-model="formData.gatherinAccount"
                          disabled
                          v-if="editState"
                          class="inputBox"
                          placeholder="请输入银行账号"></el-input>
                <div v-else>{{formData.gatherinAccount}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款金额(原币):"  prop="paymentAmount">
                <el-input v-model.number="formData.paymentAmount"
                          type="number"
                          v-if="editState"
                          class="inputBox"
                          placeholder="请输入金额"></el-input>
                <div v-else>{{formData.paymentAmount}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款币别:" prop="currency">
                <el-select
                  v-model="formData.currency"
                  v-if="editState"
                  filterable
                  placeholder="请选择付款币别"
                  class="inputBox">
                  <el-option
                    v-for="cur in currencyList"
                    :key="cur.orderCurrency"
                    :label="cur.orderCurrency"
                    :value="cur.orderCurrency">
                  </el-option>
                </el-select>
                <div v-else>{{formData.currency}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="摘要:" class="remarks">
                <el-input v-model="formData.remarks"
                          v-if="editState"
                          type="textarea"
                          autosize
                          :rows="2"
                          class="inputBox"
                          placeholder="请输入摘要内容"></el-input>
                <pre v-else>{{formData.remarks}}</pre>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="title">立项信息</div>
        <div class="handelBtn" v-if="editState">
          <el-button type="primary" size="small"
                     @click="importHandle">导入</el-button>
          <el-button type="primary" size="small"
                     @click="addTabList">新增</el-button>
        </div>
        <!--立项信息列表-->
        <div class="table-content">
          <el-table
            :data="formData.empList"
            border
            class="table-main"
            show-summary
            :summary-method="getSum">
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="insideitemno" label="内部项目号" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.insideitemno"
                          v-if="editState"
                          placeholder="请输入项目号"></el-input>
                <div v-else>{{prop.row.insideitemno}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="model" label="型号" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.model"
                          v-if="editState"
                          placeholder="请输入型号"></el-input>
                <div v-else>{{prop.row.model}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="center">
              <template slot-scope="prop">
                <el-input v-model.number="prop.row.quantity"
                          v-if="editState"
                          type="number"
                          placeholder="请输入数量"></el-input>
                <div v-else>{{prop.row.quantity}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="unitprice" label="单价" align="center">
              <template slot-scope="prop">
                <el-input v-model.number="prop.row.unitprice"
                          v-if="editState"
                          type="number"
                          placeholder="请输入单价"></el-input>
                <div v-else>{{prop.row.unitprice}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="currency" label="币别" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.currency"
                          v-if="editState"
                          placeholder="请输入币别"></el-input>
                <div v-else>{{prop.row.currency}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="总金额" align="center">
              <template slot-scope="prop">
                <el-input v-model.number="prop.row.amount"
                          type="number"
                          v-if="editState"
                          placeholder="请输入总金额"></el-input>
                <div v-else>{{prop.row.amount}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="deposit" label="订金" align="center">
              <template slot-scope="prop">
                <el-input v-model.number="prop.row.deposit"
                          type="number"
                          v-if="editState"
                          placeholder="请输入订金"></el-input>
                <div v-else>{{prop.row.deposit}}</div>
              </template>
            </el-table-column>
            <el-table-column v-if="editState" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" style="color: #85ce61" @click="deleteItem(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="upload-wrapper">
        <div class="title" v-if="editState">附件上传</div>
        <el-upload
          class="upload-content"
          accept=".xls,.xlsx,.txt,.doc,.docx,.pdf"
          :data="parameter"
          :action="`${ baseUrl }/file/upload`"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-preview="handlePreview"
          multiple
          :file-list="fileList">
          <el-button v-if="editState" size="small" type="primary">点击上传</el-button>
          <div v-if="editState" slot="tip" class="el-upload__tip">支持上传文件:表格(*.xls;*.xlsx) 文档(*.txt,*.doc,*.docx,*.pdf)</div>
          <div v-else slot="tip" style="font-size: 16px;font-weight: bold;color: #1F9BD6;">附件列表:</div>
        </el-upload>
      </div>
      <div class="submit-wrapper" v-if="editState">
        <el-button type="primary" :loading="btnState" @click="submitHandle('保存')">保存</el-button>
        <el-button type="primary" :loading="btnState" @click="submitHandle('提交')">提交</el-button>
      </div>
  </div>
</template>

<script>
  import req from '@/utils/req'
  import _ from 'lodash'
  import uploadCmp from '@/components/uploadCmp'
  export default {
    data() {
      return {
        formData: {
          status: '', // 保存状态
          id: '', // 订单ID
          orderNumber: '', // 订单号
          gatheringCompany: '', // 收款公司
          paymentAmount: '', // 付款金额
          gatheringBank: '', // 收款银行
          gatherinAccount: '', // 收款账号
          currency: '', // 币别
          remarks: '', // 备注
          fileList: [], // 文件列表
          empList: [] // 立项信息列表
        },
        formRules: { // 表单规则
          gatheringCompany: [
            { required: true, message: '请选择收款方', trigger: 'blur' }
          ],
          paymentAmount: [
            { required: true, message: '请输入付款金额', trigger: 'blur' }
          ],
          currency: [
            { required: true, message: '请输入币别', trigger: 'blur' }
          ]
        },
        fileList: [], // 页面显示文件列表
        baseUrl: window.g.baseUrl, // 请求基础地址
        parameter: { // 文件上传配置ID
          orderId: '0006C275-0000-0000-0000-00000E97FDBC',
          customId: '736CA29F-0B32-409C-9159-64F1C3EDD949'
        },
        editState: true, // 页面可编辑状态
        btnState: false, // 按钮状态
        loadState: false, // 页面加载状态
        showUpload: false, // 文件上传弹框
        tabTagData: [ // 商品明细列表表头
          {
            label: '内部项目号',
            prop: 'insideitemno',
            width: ''
          },
          {
            label: '型号',
            prop: 'model',
            width: ''
          },
          {
            label: '数量',
            prop: 'quantity',
            width: ''
          },
          {
            label: '单价',
            prop: 'unitprice',
            width: ''
          },
          {
            label: '币别',
            prop: 'currency',
            width: ''
          },
          {
            label: '总金额',
            prop: 'amount',
            width: ''
          },
          {
            label: '订金',
            prop: 'deposit',
            width: ''
          }
        ],
        currencyList: [], // 币别列表
        gatheringCompanyList: [] // 收款方列表
      }
    },
    components: {
      uploadCmp
    },
    created() {
      // 获取币别信息
      this.getCurrency()
      // 获取收款方信息
      this.getGatheringMsg()
    },
    activated() {
      // 判断是否为查看详情
      if (this.$route.query.id) {
        this.getOrderDetail()
      }
    },
    methods: {
      /**
       * 商品明细列表删除操作
       * */
      deleteItem(rowData, index) {
        // 判断行ID是否存在,存在则发送删除请求
        if (rowData.id) {
          this.$axios.post('api/export/finance/matcapitalpaymentdetails/delete', { id: rowData.id }).catch((err) => {
            console.log(err)
          })
        }
        this.$delete(this.formData.empList, index)
      },
      /**
       * 收款方改变
       * */
      gatheringCompanyChange(val) {
        let data = {}
        this.gatheringCompanyList.map((item) => {
          if (item.company === val) {
            data = item
          }
        })
        // 改变收款银行
        this.formData.gatheringBank = data.bankName
        // 改变收款账户
        this.formData.gatherinAccount = data.bankAccount
      },
      /**
       * 获取收款方信息
       * */
      getGatheringMsg() {
        this.$axios.post('api/export/finance/payment/gatheringinfo').then((res) => {
          this.gatheringCompanyList = res.data
        }).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 获取币别列表
       * */
      getCurrency() {
        req.get('api/import/baseinfo/exportcurrency').then((res) => {
          if (Array.isArray(res.data)) {
            this.currencyList = res.data
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 获取订单Id
       * */
      async getOrderId() {
        return await req.get('api/import/order/orderinfo/getid').catch((error) => {
          console.log(error)
        })
      },
      /**
       * 获取订单详情
       * */
      getOrderDetail() {
        this.loadState = true
        const id = this.$route.query.id
        this.$axios.get('api/export/finance/matcapitalpayment/object', {
          params: {
            id
          }
        }).then((res) => {
          // 数据赋值
          for (let key in res.data) {
            this.formData[key] = res.data[key]
          }
          // 序列化显示页面文件列表
          this.parseFileList()
          // 判断可编辑状态
          if (this.formData.status !== 'SE') {
            this.editState = false
          }
          this.loadState = false
        }).catch((err) => {
          this.loadState = false
          console.log(err)
        })
      },
      /**
       * 获取商品明细表格总和方法
       * */
      getSum(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计:'
            return
          }
          if (index === 6 || index === 7) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            } else {
              sums[index] = ''
            }
          }
        })
        return sums
      },
      /**
       * 序列化fileList
       * */
      parseFileList() {
        let baseUrl = this.baseUrl
        this.formData.fileList.map((file) => {
          this.fileList.push({
            id: file.id,
            name: file.fileName,
            url: `${baseUrl}file/download/${file.fileId}`
          })
        })
      },
      /**
       * 文件上传后
       * */
      handleChange(file) {
        if (file.response) {
          this.formData.fileList.push({
            fileName: file.raw.name,
            fileType: file.raw.name.split('.')[1],
            fileId: file.response.fileId
          })
        }
      },
      /**
       * 删除对应文件
       * */
      handleRemove({ response }) {
        if (response) {
          const id = response.fileId
          req.post('api/import/file/fileinfo/del', {
            id
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '附件删除成功',
              type: 'success'
            })
          }).catch((error) => {
            console.log(error)
          })
          this.formData.fileList = this.formData.fileList.filter((v) => {
            return v.fileId !== id
          })
        }
      },
      /**
       * 预览下载对应文件
       * */
      handlePreview(file) {
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
      },
      /**
       * 提交操作
       * */
      async submitHandle(type) {
        this.btnState = true
        let formData = _.cloneDeep(this.formData)
        // 判断保存类型
        if (type === '保存') {
          formData.status = 'SE'
        } else if (type === '提交') {
          formData.status = 'SQ'
          let checkout = false
          this.$refs.formMain.validate((v) => {
            checkout = !v
          })
          if (checkout) {
            this.btnState = false
            return
          }
        }
        // 判断有无ID
        if (formData.id === '') {
          let result = await this.getOrderId()
          formData.id = result.orderId
        }
        // 发送保存请求
        this.$axios.post('api/export/finance/matcapitalpaymentobject/save', formData).then(() => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
          this.btnState = false
          // 清除当前表单数据,及提示
          Object.assign(this.$data.formData, this.$options.data().formData)
          // 清除提示
          this.$refs.formMain.resetFields()
          // 关闭当前页签
          this.$store.dispatch('delVisitedViews', { fullPath: this.$route.fullPath })
          // 页面重定向至列表页
          this.$router.replace('/export/pay/padPay')
        }).catch((err) => {
          this.btnState = false
          console.log(err)
        })
      },
      /**
       * 添加一项列表
       * */
      addTabList() {
        this.formData.empList.push({})
      },
      /**
       * 导入文件操作
       * */
      importHandle() {
        this.showUpload = true
      },
      /**
       * 获取导入的数据
       * */
      getImportTabData(list) {
        list.map((val) => {
          this.formData.empList.push(val)
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
    padding: 15px 0 0px 20px;
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
    .form-content {
      margin-top: 20px;
      .inputBox{
        width: 360px;
      }
    }
    .upload-wrapper{
      width: 530px;
      margin-top: 30px;
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
    .table-content{
      box-sizing: border-box;
      padding: 0 20px;
      width: 100%;
    }
    .handelBtn{
      box-sizing: border-box;
      width: 100%;
      margin: 10px 0;
      padding-right: 20px;
      text-align: right;
    }
    .upload-content{
      margin-left: 20px;
      .el-upload__tip{
        display: inline-block;
        margin-left: 10px;
      }
    }
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
  .upload-content{
    .el-upload-list{
      width: 400px;
    }
  }
</style>
