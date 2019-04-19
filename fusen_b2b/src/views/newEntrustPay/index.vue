<template>
  <div class="content-wrapper" v-loading="loadState">
    <el-row>
      <el-col class="form-wrapper">
        <div class="title">收款信息</div>
        <el-form :label-width="'120px'"
                 :model="formData"
                 :rules="formRules"
                 ref="formMain"
                 size="small"
                 class="form-content">
          <el-form-item label="收款方:"
                        prop="gatheringCompany"
                        class="formItem">
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
          <el-form-item label="收款银行:" class="formItem term" prop="gatheringBank">
            <el-input v-model="formData.gatheringBank"
                      v-if="editState"
                      disabled
                      class="inputBox"
                      placeholder="银行名称"></el-input>
            <div v-else>{{formData.gatheringBank}}</div>
          </el-form-item>
          <el-form-item label="收款账号:" class="formItem" prop="gatherinAccount">
            <el-input v-model="formData.gatherinAccount"
                      disabled
                      v-if="editState"
                      class="inputBox"
                      placeholder="银行账号"></el-input>
            <div v-else>{{formData.gatherinAccount}}</div>
          </el-form-item>
          <el-form-item label="付款金额(原币):" class="formItem" prop="paymentAmount">
            <el-input v-model="formData.paymentAmount"
                      disabled
                      v-if="editState"
                      class="inputBox"
                      placeholder="订单明细金额总计"></el-input>
            <div v-else>{{formData.paymentAmount}}</div>
          </el-form-item>
          <el-form-item label="付款币别:" prop="currency" class="formItem">
            <el-input v-if="editState"
                      disabled
                      placeholder="订单明细币别"
                      v-model="formData.currency"
                      class="inputBox"></el-input>
            <div v-else>{{formData.currency}}</div>
          </el-form-item>
        </el-form>
        <div class="title">立项信息</div>
        <div class="handelBtn" v-if="editState">
          <el-button type="primary" size="small"
                     @click="showChooseDialog">选择订单</el-button>
        </div>
        <!--立项信息列表-->
        <div class="table-content">
          <el-table
            :data="formData.epdList"
            border
            class="table-main"
            show-summary
            :summary-method="getSum">
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="fsno" label="富森订单号" align="center">
              <template slot-scope="prop">
                {{prop.row.fsno}}
              </template>
            </el-table-column>
            <el-table-column prop="orderDate" label="报关日期" align="center">
              <template slot-scope="prop">
                {{prop.row.orderDate}}
              </template>
            </el-table-column>
            <el-table-column prop="accAmt" label="结汇金额(原币)" align="center">
              <template slot-scope="prop">
                {{prop.row.accAmt}}
              </template>
            </el-table-column>
            <el-table-column prop="acccurrency" label="币别" align="center">
              <template slot-scope="prop">
                {{prop.row.acccurrency}}
              </template>
            </el-table-column>
            <el-table-column prop="accrate" label="结汇汇率" align="center">
              <template slot-scope="prop">
                {{prop.row.accrate}}
              </template>
            </el-table-column>
            <el-table-column prop="yfkAmt" label="已付款金额(原币)" align="center">
              <template slot-scope="prop">
                {{prop.row.yfkAmt}}
              </template>
            </el-table-column>
            <el-table-column prop="kfkAmt" label="可付款金额(原币)" align="center">
              <template slot-scope="prop">
                {{prop.row.kfkAmt}}
              </template>
            </el-table-column>
            <el-table-column prop="paymentAmount" label="付款金额(原币)" align="center">
              <template slot-scope="prop">
                <el-input v-if="editState"
                          type="number"
                          @input="fkAmtHandle($event, prop.row)"
                          placeholder="请输入付款金额"
                          v-model="prop.row.paymentAmount"></el-input>
                <div v-else>
                  {{prop.row.fkAmt}}
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="editState" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" style="color: #85ce61" @click="deleteItem(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col class="upload-wrapper">
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
      </el-col>
    </el-row>
    <div class="submit-wrapper" v-if="editState">
      <el-button type="primary" :loading="btnState" @click="submitHandle('保存')">暂存</el-button>
      <el-button type="primary" :loading="btnState" @click="submitHandle('提交')">提交</el-button>
    </div>
    <!--明细选择弹框-->
    <el-dialog title="选择订单" :visible.sync="showOrderDetail" class="choose">
      <el-form  inline size="medium" class="formFlexBox">
        <el-form-item>
          <div>
            <el-input
              class="inline-input"
              v-model="searchOptions.gatherSelcondition"
              @keydown.native.13="chooseOrder"
              placeholder="请输入订单号">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="chooseOrder">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table align="center"
                :data="orderDetailData"
                @selection-change="chooseOrderSelect"
                v-loading="tabLoading"
                :border="true" style="width:100%;">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="fsno" label="富森号" align="center" width="120"></el-table-column>
        <el-table-column property="accAmt" label="报关金额(原币)" width="120" align="center"></el-table-column>
        <el-table-column property="acccurrency" label="币别" align="center"></el-table-column>
        <el-table-column property="accrate" label="结汇汇率" width="120" align="center"></el-table-column>
        <el-table-column property="yfkAmt" label="已付款金额(原币)" width="120" align="center"></el-table-column>
        <el-table-column property="kfkAmt" label="可付款金额(原币)" width="120" align="center"></el-table-column>
        <el-table-column property="orderDate" label="创建日期" width="120px" align="center"></el-table-column>
      </el-table>
      <div class="orderDetail-pagination">
        <el-pagination
          :page-size="searchOptions.pageCount"
          layout="prev, pager, next"
          :current-page.sync="searchOptions.pageSize"
          @current-change="pageCountChange"
          background
          :total="orderDetailTotal">
        </el-pagination>
      </div>
      <div slot="footer">
        <el-button type="primary"
                   :disabled="exportTableDataButton_state"
                   @click="exportTableDataHandle">导出</el-button>
      </div>
    </el-dialog>
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
          fileList: [], // 文件列表
          epdList: [] // 立项信息列表
        },
        formRules: { // 表单规则
          gatheringCompany: [
            { required: true, message: '请选择收款方', trigger: 'blur' }
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
        gatheringCompanyList: [], // 收款方列表
        tabLoading: false, // 列表加载状态
        orderDetailTotal: 0, // 弹框内订单明细列表总数
        orderDetailData: [], // 弹框中订单明细列表
        showOrderDetail: false, // 显示弹框控制
        searchOptions: { // 弹框内搜索明细
          pageCount: 2,
          pageSize: 1,
          gatherSelcondition: ''
        },
        chooseOrderSelectArr: [] // 弹框内当前选中的订单明细选项
      }
    },
    components: {
      uploadCmp
    },
    computed: {
      /**
       * 导出按钮状态控制
       * */
      exportTableDataButton_state() {
        return !(this.chooseOrderSelectArr.length !== 0)
      }
    },
    activated() {
      // 判断是否为查看详情
      if (this.$route.query.id) {
        this.getOrderDetail()
      }
      this.getGatheringMsg()
    },
    methods: {
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
        this.$axios.get('api/export/finance/payment/object', {
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
          if (index === 3 || index === 6 || index === 7 || index === 8) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  /**
                   * 自动汇总付款金额
                   * */
                  if (index === 8) {
                    this.formData.paymentAmount = prev + curr
                  }
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
        // 处理fusenOrder单号
        let fusenOrderArr = _.cloneDeep(formData.epdList)
        fusenOrderArr = _.uniqBy(fusenOrderArr, 'fsno')
        let handleArr = []
        fusenOrderArr.map((val) => {
          handleArr.push(val.fsno)
        })
        formData.orderNumber = handleArr.join(',')
        // 发送保存请求
        this.$axios.post('api/export/finance/paymentobject/save', formData).then(() => {
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
          this.$router.replace('/export/pay/entrustPay')
        }).catch((err) => {
          this.btnState = false
          console.log(err)
        })
      },
      /**
       * 添加一项列表
       * */
      addTabList() {
        this.formData.goods.push({})
      },
      /**
       * 分页组件当前页改变事件
       * */
      pageCountChange(currentSize) {
        this.searchOptions.pageSize = currentSize
        this.chooseOrder()
      },
      /**
       * 展示选择订单
       * */
      showChooseDialog() {
        this.showOrderDetail = true
        this.chooseOrder()
      },
      /**
       * 获取选择订单列表
       * */
      chooseOrder() {
        this.tabLoading = true
        let jsonData = JSON.parse(JSON.stringify(this.searchOptions))
        jsonData.pageSize -= 1
        this.$axios.post('api/export/finance/payment/maylist', jsonData).then((res) => {
          // 获取列表数据
          this.orderDetailData = res.data.list
          // 总数赋值
          this.orderDetailTotal = res.data.total
          this.tabLoading = false
        }).catch((error) => {
          this.tabLoading = false
          console.log(error)
        })
      },
      /**
       * 获取弹框内选中的订单明细数组
       * */
      chooseOrderSelect(arr) {
        this.chooseOrderSelectArr = arr
      },
      /**
       * 导出弹框内的列表数据
       * */
      exportTableDataHandle() {
        // 校验币别是否不一致
        let checkArr = this.formData.epdList.concat(this.chooseOrderSelectArr)
        let checkout = checkArr.every((val) => {
          return val.acccurrency === checkArr[0].acccurrency
        })
        if (!checkout) {
          this.$message({
            type: 'warning',
            message: '不能选择币别不同的订单'
          })
          return
        }
        // 获取币别
        this.formData.currency = checkArr[0].acccurrency
        // 校验重复项
        let filterList = _.differenceBy(this.chooseOrderSelectArr, this.formData.epdList, 'fina001oid')
        // 导出操作
        filterList.map((v) => {
          this.formData.epdList.push(v)
        })
      },
      /**
       * 商品明细列表删除操作
       * */
      deleteItem(rowData, index) {
        // 判断行ID是否存在,存在则发送删除请求
        if (rowData.id) {
          this.$axios.post('api/export/finance/paymentdetails/delete', { id: rowData.id }).catch((err) => {
            console.log(err)
          })
        }
        this.$delete(this.formData.epdList, index)
      },
      /**
       * 可付款金额最大值处理处理
       * */
      fkAmtHandle(val, row) {
        if (parseFloat(val) > parseFloat(row.kfkAmt)) {
          row.paymentAmount = parseFloat(row.kfkAmt)
        }
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
      .remark{
        flex: 0 0 100%;
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
      .upload-content{
        margin-bottom:10px;
        .el-upload__tip{
          display: inline-block;
          margin-left: 10px;
        }
      }
    }
    .submit-wrapper{
      height: 100px;
      padding-right: 20px;
      text-align: right;
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
    .formFlexBox{
      text-align: right;
      .inline-input{
        width: 360px;
      }
    }
    /*分页容器*/
    .orderDetail-pagination{
      margin-top: 20px;
      text-align: right;
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
