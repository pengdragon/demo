<template>
  <div class="view-main">
    <el-row class="content-wrapper">
      <el-col class="orderState-wrapper">
      </el-col>
      <el-col class="form-wrapper">
        <div class="title">基本信息</div>
        <el-form :label-width="'100px'"
                 :model="formData"
                 size="small"
                 ref="formMain"
                 class="form-content">
          <el-form-item label="收款公司:"
                        class="formItem">
            <el-select v-model="formData.collectionCompany"
                       style="width: 360px"
                       v-if="editState"
                       filterable
                       @change="gatheringCompanyChange"
                       class="inputBox"
                       placeholder="请选择">
              <el-option
                v-for="(item,index) in skCollection"
                :key="index"
                :label="item.company"
                :value="item">
              </el-option>
            </el-select>
            <div v-else>{{order.fsOrderNo}}</div>
          </el-form-item>
          <el-form-item label="收款账号：" class="formItem">
            <el-input v-model="formData.bankNO"
                      class="inputBox rdodly"
                      :readonly="true"
                      placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="收款银行：" class="formItem">
            <el-input v-model="formData.bankName"
                      class="inputBox rdodly"
                      :readonly="true"
                      placeholder="立项日期"></el-input>
          </el-form-item>
          <el-form-item label="支付方式" class="formItem">
            <el-select v-model="formData.paymentMode" placeholder="请选择" class="inputBox">
              <el-option
                v-for="(item,i) in payTypeOptions"
                :key="i"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否垫资" class="formItem">
            <el-radio v-model="formData.isMemo" label="0">垫资</el-radio>
            <el-radio v-model="formData.isMemo" label="1">不垫资</el-radio>
          </el-form-item>
          <el-form-item label="金额：" class="formItem payMoney">
            <div style="width: 276px;">
              <el-input v-model="formData.paymentMoney"
                        class="inputBox"
                        placeholder="自动计算"></el-input>
              <el-select v-model="formData.currencyType" placeholder="币种" disabled style="width: 130px;">
                <el-option
                  v-for="item in currency"
                  :key="item.orderCurrency"
                  :label="item.orderCurrency"
                  :value="item.orderCurrency">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="备注：" class="formItem">
            <el-input v-model="formData.summary" class="inputBox"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="tableView-wrapper">
        <div class="title-wrapper">
          <div class="title">付款明细</div>
          <span class="handleButton">
            <el-button type="primary" size="small" @click="chooseOrder('选择订单')">选择订单</el-button>
          </span>
        </div>
        <el-table :data="formData.orderItemInfoList"
                  show-summary
                  :summary-method="getSummaries"
                  border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column label="订单号" align="center" width="120" prop="itemOrderNo"></el-table-column>
          <el-table-column label="项目号" align="center" width="120" prop="fsOrderNo"></el-table-column>
          <el-table-column label="客户委托单号" align="center" width="120" prop="customerNo"> </el-table-column>
          <el-table-column label="供应商" align="center" width="120" prop="supplier"></el-table-column>
          <el-table-column label="付款类型" align="center" width="120" prop="payType"></el-table-column>
          <el-table-column label="订单货值" align="center" width="220" prop="customsAmount"></el-table-column>
          <el-table-column label="发票税率" align="center" width="120" prop="taxRate"></el-table-column>
          <el-table-column label="税率说明" align="center" width="240" prop="taxRateExplanation">
            <template slot-scope="prop">
              <div>{{prop.row.taxRate}}发票金额：{{prop.row.customsAmount}}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单币别" align="center" width="120" prop="orderCurrency"></el-table-column>
          <el-table-column label="已收票未付款" align="center" width="120" prop="wfhjeAmt"></el-table-column>
          <el-table-column label="未付款金额" align="center" width="120" prop="wfhMoney">
            <template slot-scope="prop">
              {{prop.row.wfhMoney = prop.row.customsAmount - prop.row.amountPay}}
            </template>
          </el-table-column>
          <el-table-column prop="amountPay" label="付款金额" width="180" align="center">
            <template slot-scope="prop">
              <el-input v-if="editStatus"
                        v-model.number="prop.row.amountPay"
                        @input="amountVal(prop.row)"
                        type="number"
                        size="mini"
                        placeholder="付款金额"></el-input>
              <div v-else>
                {{prop.row.amountPay}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="付款金额(rmb)" align="center" width="120" prop="amountRMB">
            <template slot-scope="prop">
              <!--{{prop.row.amountRMB = prop.row.orderRate * prop.row.amountPay}}-->
              {{prop.row.amountRMB}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="prop">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(prop.$index, prop.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      <div class="submit-wrapper">
        <el-button type="primary" @click="submitHandle(0)">保存</el-button>
        <el-button style="background: #42B983;color: #fff;" @click="submitHandle(1)">提交</el-button>
      </div>
    </el-row>
    <el-dialog :title="chooseTitle" :visible.sync="showOrderDetail" class="chooseOrder">
      <el-form :model="formData" inline size="medium" class="formFlexBox" style="float: right">
        <el-form-item>
          <div class="tmpContent" >
            <el-input
              class="inline-input"
              v-model="searchformData.registrar"
              ref="enterInputA"
              name="enterInputA"
              placeholder="请输入订单号">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item class="search-button">
          <el-button type="primary" @click="searchHandle">查询</el-button>
        </el-form-item>
      </el-form>
      <div v-if="payType === '5'">
        <tabTmp :tabData="orderListData"
                @getSelectResult="getSelectResult"
                :tabHeight="'300px'"
                :showSelection="true"
                :showHandle="true"
                @deleteItem="deleteItem"
                :tabTagData="tabTagData">
        </tabTmp>
      </div>
      <div v-if="payType === '6'">
        <tabTmp :tabData="orderListData"
                @getSelectResult="getSelectResult"
                :tabHeight="'300px'"
                :showHandle="true"
                :showSelection="true"
                @deleteItem="deleteItem"
                :tabTagData="domesticData">
        </tabTmp>
      </div>
      <div v-if="payType === '7'">
        <tabTmp :tabData="orderListData"
                @getSelectResult="getSelectResult"
                :tabHeight="'300px'"
                :showHandle="true"
                :showSelection="true"
                @deleteItem="deleteItem"
                :tabTagData="machiningData">
        </tabTmp>
      </div>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        class="paginationContent choosePage"
        layout="prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showOrderDetail = false">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import req from '@/utils/req'
  import tabTmp from '@/components/tabTemplate'
  import uploadCmp from '@/components/uploadCmp'
  export default {
    data() {
      // let _this = this
      return {
        showOrderDetail: false, // 弹框
        editState: true,
        editStatus: true,
        chooseTitle: '', // 弹框标题
        payorder: [],
        skCollection: [], // 收款公司
        orderListData: [ // 付款明细数据数组
          {
            projectOrder: '987654',
            payMoney: '888888RMB',
            currentPay: '100000'
          }
        ],
        searchformData: {
          registrar: ''
        },
        machiningData: [ // 加工付款
          {
            label: '订单号',
            prop: 'fsOrderNo',
            width: '120px'
          },
          {
            label: '项目号',
            prop: 'itemOrderNo',
            width: '120px'
          },
          {
            label: '内部项目号',
            prop: 'customerNo',
            width: '120px'
          },
          {
            label: '税率',
            prop: 'orderRate',
            width: '120px'
          },
          {
            label: '订单日期',
            prop: 'orderDate',
            width: '120px'
          },
          {
            label: '订单货值',
            prop: 'customsAmount',
            width: '120px'
          },
          {
            label: '已付款',
            prop: 'yfhAmt',
            width: '120px'
          },
          {
            label: '已收票未付款',
            prop: 'wfhjeAmt',
            width: '120px'
          },
          {
            label: '项目平台',
            prop: 'invHead',
            width: '120px'
          },
          {
            label: '付款类型',
            prop: 'settleType',
            width: '80px'
          }
        ],
        domesticData: [ // 采购付款明细表头数据
          {
            label: '订单号',
            prop: 'fsOrderNo',
            width: '120px'
          },
          {
            label: '项目号',
            prop: 'itemOrderNo',
            width: '120px'
          },
          {
            label: '供应商',
            prop: 'supplier',
            width: '240px'
          },
          {
            label: '内部项目号',
            prop: 'customerNo',
            width: '120px'
          },
          {
            label: '项目平台',
            prop: 'invHead',
            width: '120px'
          },
          {
            label: '订单日期',
            prop: 'orderDate',
            width: '120px'
          },
          {
            label: '订单货值',
            prop: 'customsAmount',
            width: '120px'
          },
          {
            label: '已付款',
            prop: 'yfhAmt',
            width: '120px'
          },
          {
            label: '已收票未付款',
            prop: 'wfhjeAmt',
            width: '120px'
          },
          {
            label: '付款类型',
            prop: 'settleType',
            width: '80px'
          }
        ],
        tabTagData: [ // 进口付款明细表头数据
          {
            label: '订单号',
            prop: 'fsOrderNo',
            width: '120px'
          },
          {
            label: '项目号',
            prop: 'itemOrderNo',
            width: '120px'
          },
          {
            label: '内部项目号',
            prop: 'customerNo',
            width: '120px'
          },
          {
            label: '报关批号',
            prop: 'customerNo',
            width: '120px'
          },
          {
            label: '订单日期',
            prop: 'orderDate',
            width: '120px'
          },
          {
            label: '订单货值',
            prop: 'customsAmount',
            width: '120px'
          },
          {
            label: '已付汇',
            prop: 'yfhAmt',
            width: '120px'
          },
          {
            label: '付款类型',
            prop: 'settleType',
            width: '120px'
          }
        ],
        currency: [ // 币别选项数据
        ],
        payTypeOptions: [ // 支付方式数据
          {
            value: '5',
            label: '电汇'
          },
          {
            value: '6',
            label: '期票'
          },
          {
            value: '7',
            label: '现票'
          }
        ],
        dialogTabTagData: [ // 付款明细列表
          {
            label: '订单号',
            prop: 'itemOrderNo',
            width: '120px'
          },
          {
            label: '项目号',
            prop: 'fsOrderNo',
            width: '120px'
          },
          {
            label: '客户委托单号',
            prop: 'customerNo',
            width: '120px'
          },
          {
            label: '供应商',
            prop: 'supplier',
            width: '240px'
          },
          {
            label: '付款类型',
            prop: 'settleType',
            width: '120px'
          },
          {
            label: '订单货值',
            prop: 'customsAmount',
            width: '240px'
          },
          {
            label: '发票税率',
            prop: 'orderRate',
            width: '120px'
          },
          {
            label: '税率说明',
            prop: 'taxRateExplanation',
            width: '120px'
          },
          {
            label: '订单币别',
            prop: 'ianNoshm',
            width: '120px'
          },
          {
            label: '已收票未付款',
            prop: 'rate',
            width: '120px'
          },
          {
            label: '未付款金额',
            prop: 'wfhMoney',
            width: '120px'
          },
          {
            label: '付款金额',
            prop: 'amountPay',
            width: '120px'
          },
          {
            label: '付款金额(rmb)',
            prop: 'amountRMB',
            width: '120px'
          }
        ],
        dialogData: [
        ],
        requestDara: {
          pageSize: 1,
          pageCount: 10,
          busiType: '',
          gatherSelcondition: ''
        },
        payType: '',
        pageTotal: 0,
        currentPage: 1,
        pageSize: 10,
        formData: {
          accountId: '',
          paymentOrderNo: '',
          collectionCompany: '',
          bankNO: '',
          bankName: '',
          busiType: '',
          paymentType: '',
          paymentMode: '',
          isMemo: '0',
          paymentMoney: '',
          currencyType: 'RMB',
          summary: '',
          orderItemInfoList: [],
          file: []
        },
        parameter: {
          orderId: '0006C275-0000-0000-0000-00000E97FDBC',
          customId: '736CA29F-0B32-409C-9159-64F1C3EDD949'
        },
        baseUrl: window.g.baseUrl, // 请求基础地址
        fileList: [
        ],
        orderNumberOptions: []
      }
    },
    components: {
      tabTmp,
      uploadCmp
    },
    created() {
      if (this.$route.query.id) {
        this.getOrderObj()
      }
      this.getkeyword() // 获取收款公司
      this.getCurrency()
    },
    mounted() {
      this.payType = this.$route.query.payType + ''
    },
    methods: {
      // paymentChange(val) {
      //   this.requestDara.busiType = val
      // },
      // 获取订单对象
      getOrderObj() {
        this.loadState = true
        req.get('api/virtual/paymentOrder/getItemInfo', {
          params: {
            itemId: this.$route.query.id
          }
        }).then((res) => {
          this.formData = res.data
          res.data.orderItemInfoList.forEach((item, index, arr) => {
            // 获取数据并赋值给表格
            arr[index].customsAmount = arr[index].cValue
            arr[index].taxRate = arr[index].lianNo
            arr[index].taxRateExplanation = arr[index].lianNoshm
            arr[index].wfhjeAmt = arr[index].invsMoeny
            arr[index].orderRate = arr[index].rate
            arr[index].orderCurrency = arr[index].cur
            arr[index].wfhjeAmt = arr[index].invsMoeny
            if (!arr[index].fsOrderNo) {
              arr[index].fsOrderNo = arr[index].itemOrderNo
            }
          })
          this.parseFileList()
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      chooseOrder(title) {
        this.requestDara.busiType = this.$route.query.payType
        this.requestDara.gatherSelcondition = this.searchformData.registrar
        this.showOrderDetail = true
        this.chooseTitle = title
        this.getOrderTab()
      },
      // 查询付款委托项目列表、加工合同列表、国内采购列表
      getOrderTab() {
        this.loadState = true
        let jsonStr = this.requestDara
        console.log(jsonStr)
        this.$axios.post('api/virtual/paymentOrder/orderList', jsonStr).then((res) => {
          this.orderListData = res.data.list
          this.pageTotal = res.data.total
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      deleteLialog(index) {
        this.dialogData.splice(index, 1)
      },
      deleteItem(index) {
        this.orderListData.splice(index, 1)
      },
      sureBtn() {
        this.showOrderDetail = false
        this.dialogData = this.payorder
      },
      // 选中表格数据
      getSelectResult(val) {
        this.payorder = val
        this.formData.orderItemInfoList = val
        this.formData.paymentType = val[0].settleType // 选择主表付款类型
        this.formData.orderItemInfoList.forEach((item, index, arr) => {
          // let customsVal = arr[index].customsAmount
          // arr[index].wfhMoney = customsVal - yfhVal
          arr[index].customsAmount = arr[index].customsAmount
          arr[index].yfhAmt = arr[index].yfhAmt
          arr[index].itemId = '' // 选中的订单id设置为空
          arr[index].payType = arr[index].settleType // 明细表添加字段payType
          arr[index].cValue = arr[index].customsAmount
          arr[index].lianNo = arr[index].taxRate
          arr[index].lianNoshm = arr[index].taxRateExplanation
          arr[index].invsMoeny = arr[index].wfhjeAmt
          arr[index].rate = arr[index].orderRate
          arr[index].cur = arr[index].orderCurrency
          arr[index].invsMoeny = arr[index].wfhjeAmt
        })
        this.formData.orderItemInfoList.forEach((v) => {
          if (!v.amountPay) {
            this.$set(v, 'amountPay', 0)
          }
        })
      },
      handleCurrentChange(currentPage) {
        this.requestDara.pageSize = currentPage
        this.getOrderTab()
      },
      saveHandle() {
        this.$notify({
          title: '保存成功',
          message: '该订单已保存',
          type: 'success'
        })
      },
      submitHandle(val) {
        this.formData.orderStatus = val
        this.formData.busiType = this.payType // 主表保存时添加字段busiType
        let jsonStr = this.formData
        console.log(jsonStr)
        // 订单保存/提交
        this.$axios.post('api/virtual/paymentOrder/itemSaveOrCommit', jsonStr).then((res) => {
          if (res.result === 'success') {
            this.$notify({
              title: '订单保存成功',
              message: res.msg,
              type: 'success'
            })
            this.$refs.formMain.resetFields()
            this.$router.replace('/fictitious/payApply')
          }
        }).catch((error) => {
          console.log(`保存/提交 ${error}`)
          // 失败时重置状态
          // this.order.orderStatus = '0'
        })
      },
      // 获取收款公司
      getkeyword() {
        req.get('api/virtual/paymentOrder/searchCompany', {
          params: {
            keyWord: ''
          }
        }).then((res) => {
          if (res.data && Array.isArray(res.data)) {
            res.data.forEach((val) => {
              this.skCollection.push({
                company: val.company,
                bankName: val.bankName,
                bankAccount: val.bankAccount
              })
              console.log()
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      // 获取币别列表
      getCurrency() {
        req.get('api/import/baseinfo/currency', {
          params: {
            businessCode: 1
          }
        }).then((res) => {
          this.currency = res.currencyLst
        }).catch((error) => {
          console.log(error)
        })
      },
      /* 选择带出收款公司账号 */
      gatheringCompanyChange(val) {
        this.formData.collectionCompany = val.company
        this.formData.bankName = val.bankName
        this.formData.bankNO = val.bankAccount
      },
      searchHandle() {
        this.chooseOrder()
      },
      /**
       * 删除表格行
       * */
      handleDelete(index) {
        this.formData.orderItemInfoList.splice(index, 1)
      },
      /**
       * 获取备品表格总和方法
       * */
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价'
            return
          }
          if (index === 12 || index === 12 || index === 13) {
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
        this.formData.paymentMoney = sums[13]
        return sums
      },
      /**
       * 计算rmb金额
       * */
      amountVal(val) {
        let orderRate = val.orderRate
        let amount = val.amountPay
        val.amountRMB = (orderRate * amount).toFixed(2)
        if (val.amountPay > val.customsAmount) {
          val.amountPay = val.amountPay
          this.$set(val, 'amountPay', val.customsAmount)
          this.$message({
            message: '付款金额不能大于订单货值',
            type: 'warning'
          })
        }
      },
      /**
       * 序列化fileList
       * */
      parseFileList() {
        let baseUrl = this.baseUrl
        this.formData.file.map((file) => {
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
          this.formData.file.push({
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
          this.formData.file = this.formData.file.filter((v) => {
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .view-main{
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding-bottom: 90px;
    .payMoney{
      .el-input{
        width: 119px !important;
      }
      .el-select{
        width: 146px !important;
        margin-left: 5px;
      }
    }
    .term{
      flex: 0 0 100% !important;
      .inputBox{
        width: 120px !important;
      }
      .el-date-editor{
        width: 232px !important;
        margin-left: 5px;
      }
    }
  }
  .content-wrapper{
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 22px;
    padding-bottom: 0;
    font-size: 0;
    .orderState-wrapper{
      .tagContent{
        display: flex;
        justify-content: flex-start;
        .tagItem{
          width: 134px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 15px;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAAoCAYAAAA7b4IPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAADIUlEQVR42u3cwWsjdRTA8e/vl6F0OpsyCC0tmTiFdDy2l7qnwasI2pt686y4yOp1vSgueDIXBVH8A3S9rX/CO1mhtHhrL9OSHtZLIGuGyiTxYAKhzLYZTRgzvA8Ekkze5P34Pd5MfhPGMCYibwEfA68C91DL7DlwBHwVx/Ev/2YHBkBEvnBd91EYhvi+T61WK3tg6j8YDAZ0u12SJCFN08dxHH9adB9GRN50Xffp3t4ejuOUPSY1R1mWcXp6Spqmh3EcPy0Sa4FPwjDUoqggx3EIwxD+OUUoxAIHvu+XPQa1IOO5PSgaZ4G6nlNU13hu60XjbNmJq/8nLQyVSwtD5dLCULm0MFQuLQyVywJcX1+XnYdaoLW1NUTkRxHZmDXGAo+Oj4/TTqfDaDQqewxqAfb39wmC4B1jzO8i8vYsMZOLaC3gG8/zXm+1WtTrhddD1BLo9XqcnZ2RpukT4EEcx89e9Fkz/UJE3gXaW1tb23r9pJqGwyEXFxdcXV09G41GD+I4fpL3OXPzDRHxgccrKyvv7+zs2I2NmQ9Laonc1T3MiwJF5D7wne/7+61Wi9XV1bLHoubstu5hbgsUEQf4yFr7WRAE94IgwBhz5xeq5ZLXPWaaZRFpAl+7rnu4u7vL+vp62WNRc3aze8y6wPXX+KEdo8LGc2uAu2dZRN4zxrQbjcZLzWYTa3WxtGp6vR7n5+f0+/2fgQ9vPZSIyMvAt57nvRFFEZ7nlZ2/mrPhcMjl5SWdTueP8cnnT5NteT9XDfCBtfbLZrNZbzQaeviooLwuMb395gLXK8D39Xr9tSiKcF237PzVnN3WJaZNlsQd4GGtVvs8DEN3e3u77PzVAtzVJaYZEdkDfvB9/0AXsqpp1i4xzQGOoiha2dzcLDt/tSAnJyczdYlpDqBFUXH9fp84jme63D6hixIqlxaGyqWFoXJpYahcWhgqlxaGymWB3mAwKDsPtSDjuX1eNM4Cv3W73bLzVwsyntujonEWaCdJQpZlZY9BzVmWZSRJAtAuGqs3Z6ugudycbfJERA6Bh8B9QP+Vs9z+BH4F2kVvyjbxN+xXR0mzMB99AAAAAElFTkSuQmCC");
          background-size: 100% 100%;
          &.active{
             background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAAoCAYAAAA7b4IPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAC8UlEQVR42u3cz2sTQRQH8Dezm902Ta1QaYjQqrVRLBFFxagtpP6IldqLRPAqXrwqgt79AzwU9OBBEE8N/kDQtulWaGFFevAgFGtNaKuCBQVR0nSzk+zEQ1VimKZJ6rJ2+z63/JjkDfPl7WYzLIFfQlpqMEhZ2Ed4gAIogNYtDsAWC3QhyZXJqWjHhVo+gwAA9IzN6CBJXROm6vSc0D8UUU0Ay3o5fmp3d7VjaUhLDWIo3GnCVAEkqSukpQarHUuDlIUxFO41YaoQpCxc7TjqIzzgdPHIXrWsMcUTTferZY2p00Wj/xMGAwlhMJAQBgMJYTCQEAYDCWEwNoCPpA76X0y/bUp8uFXpGDrLPePnlEze6eKRfcZNFZ7nfHuinszlfVrqUSVjCACAPzF3+6hsnPlC6tpfMY/T80A2iqgm+HhuWs97E997t11d6X2k+MF+Lfm4k7LoEN/k+2E5PQVkp5iSXkpaysibaEdM9DopfULX9c03s1vGVIkeeGbWk9W/Aq1X5brHigu/Y3T23iEp2/eOeP1TTHJ6DshGou5RtiPoui5fz7YMt9J8JM4a8eTDxUq7R0WHiubE/MAx2ehNU88u3LvhbjElvXRF+XaxousYFhCrAICnoxsAWT6KkFU7xkEt+bRdyp1+yBrrnC4a2adHNaGhkkNJc2J+oFs2+r4SdSde23C380raeG8pw2VPPnVdJ9eMlqHtUv5EnDXi7i4XK+0Sxa/9FYxAYu7OEdk4+4nUt71mstN1IxuJukQxArD8s/RGtmXET3nkCWvARLhYuS5RjLSOzt0NS0b/DPEG8EKWu63WJYrJx+XMpQesCRPhYr+7hJZrKNsliskEAEPhcm2FLNw/GeqsZgxu1EFCGAwkhMFAQhgMJITBQEIYDCREOQBzughkr1rWmC4W6ILThSN71bLGNMmVyYhqOl07sklENSHJlclqx+HN2VxsLTdn+/O3+14tFe+g7LCP8K0UAHfmrGMcILdYoJ/XcjvHn2YVIUQUlLueAAAAAElFTkSuQmCC");
             background-size: 100% 100%;
             color: #fff;
          }
          &:first-child{
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAAoCAYAAAA7b4IPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAA/ElEQVR42u3cQQqDMBBG4UnpqcbzT65lF9Yi+CtpaFEy71uJKCg8ZmNMsbeImA3Dmaap9NxXzJYo3P3qd8Af1Fq74ihEMb6eOB5XPzTuiTAgEQYkwoBEGJAIAxJhQCIMSIQBiTAScHeLiPmb72GEkYS7fwJpuZ4wkmmdHoSRUMv0IIzEzqYHYSR3ND0IA2a2nx7Pqx8I97Eu2IqImYkBiYmBj1qrmS0LiAkDZrZfF0oYyW2nxPY8YSR2tnqcMBI6mhJbhJFM6z8mhJFEy5TYIowE+BMNP0MYkAgDEmFAIgxIhAGJMCARBiTCgMTmbIPr3pxtPWA7xzH1buf4Ap78ZKD578QFAAAAAElFTkSuQmCC");
            background-size: 100% 100%;
            &.active{
               background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAAoCAYAAAA7b4IPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABkUlEQVR42u3cP07DMBzF8a8tNmBkzC2AM2SAbuUSdKCsMNKVnoM/Gww+A2WDG3grI2UOA20VFVNqkHGR32eM7OoX+emlaqUYpozzh0Af2AO2kP9sAoyAy6au7n/yAQbAOH8BnOW+G0li0NTVeewmY5w/AO5yTy9JdZq6ijpjC5zmnlqS68dusMBu7qkluegztsB27qkluegztrknlvWkYEiQgiFBCoYEKRgSpGBIkIJRCOP8lXF+Z9X1CkY5joBn43x3lcXGON/knlj+3A3Qa+pq/NUCNUaZusDTsvZQY0iwPdQYEmwPNYa0zdtDwZBFY6CnR4ksMoDZyD2FrJVb4Lipq7GCIQAvfHy3uJ5dUDBk3hLtiwpGuT61RJuCUaZgS7QpGGVZ2hJtCkY5vm2JNgWjEE1drfR3+4x+4JIgBUOCFAwJUjAkSMGQIAVDgizwmnsISW4Su8ECj7mnluRGsRssMMw9tSQXfcZ2+m6mQe7JJZlB7Pu3YPrWPgDjfAc4AfaBzdx3I7/yBjwAw5+EAuAdymBgRHKwaFUAAAAASUVORK5CYII=");
               background-size: 100% 100%;
            }
          }
          &:last-child{
             width: 122px;
             background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAAoCAYAAAAxH+4YAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAACcElEQVR42u3cv2vUYBzH8XeeC9JwXgkO5Y7jzNDGQfBczk4P7oJ2dXN3a3Wsk6g4eYuIKP4BznVx/3ZphdD+BQ2lUOgSuMpRSazLCa21Wu2dj3f5viBDeDJ84JMfTx5CPAZE5A6wBNwALqLG2T6wDryw1n4A8ABE5EkQBMtRFBGGIZVKxXVQdQ5FUZBlGWma0u/3n1prH3kicjsIgpV2u43v+64zqiHK85zNzU36/f6CAR5EUaQlTyDf94miCGDJAJ0wDF1nUiMy6LZjgJo+kyfXoNuacR1E/RtadElo0SWhRZeEFl0SWnRJGICDgwPXOdSIGWA5SZL+zs4Oh4eHrvOoETHW2mdFUVzb2tr6uLGxQa/Xc51JjYB3dEdE7gLder3e0PXvybG6unp8MmatfQ9c3d3dfZUkyde9vT3XGdWQeKcNiMg88CYMw+uzs7NMTU25zqr+0okr+ihr7RrQybLsYZIk+9vb2zpZG2PeWQ4SkRbwMgiChbm5Oaanp13nVn/gl1f0D74MNjzvTOeG+s/8dlotIvc8z+s2m81LrVYLY3QxbRydWrSIXAZeV6vVW3EcU61WXWdV53CiaBHxgPvGmOetVqvWbDb1dj0BjhUtIleAt7Va7WYcxwRB4DqfGhIfQER8YLFSqTyOoihoNBquc6kh80WkDbwLw7CjCyOTywfW4zi+MDMz4zqLGiEDaMkloC/FJaFFl4QWXRJadElo0SWhRZeEAXpFUbjOoUZk0O2+AT5lWeY6jxqRQbfrBuimaUqe564zqSHL85w0TQG6+rOaCfTTn9V8HxSRBWARmAf0K4Px9hlYA7rW2hWAb0jVu/FGwKsnAAAAAElFTkSuQmCC");
             background-size: 100% 100%;
             &.active{
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAAoCAYAAAAxH+4YAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAACXklEQVR42u3csWsTURwH8N/73eVOJdGh0hKxorWxIBUEpUEtnJWmQi2IDnVz6OjSwcG/QpAODh1cnBqK4lJM06HFq5BBcOigXEg6mUFRahKv99J756KQUGql5nzcvd9nu7s3fOHL4z3ujsfgl+FieSGDPJtkIo0ABpDIEgC8EWDNEUZpIzd4DwCAAQBcX/log6ZdW/NM2RlJF1mmB+D766vjQ6NsuFheOK7DNJUcT5bpwZcdyGMGeZZKjq81z4QM8iwmmUjLDkPClWQijbTxij8EMFB2CPJ/UNGKoKIVQUUrgopWBBWtCCpaEVgRidU7RnNHdhASLnwzPjS23jLnbyfqlStGS3YeEhLWfnGx6Lw4jzy3JI4mt3zZ0Ui33De2Otfo97nM3Qfmt/4R1nw3ZbqB7ICke9heD84sV55d1rYnP7AjfRtck52T/INdM7pddWJgZtb8ejIl+Mq0UafFO+LY3wzqKWzOXdXdm3VMnKNv19HzxxndzgfmBwC0PYswfb8Bl4rOqwGtObHIU4dkhyUHt2fRPYXNuVHdnfzMtLOLnDqOul1F27bNHrq9S6e1HzfyPEV/n8RER9HpQvXpY8+95WuJU3l+WHY20kU6AIBt2/qj7d7XfehZL3lq33WbRI/ev1ydf+K5U9/RSL+lFyOxpY/pzZnn/Bg1HHPIAKhkBdCPB4qgohVBRSuCilYEFa0IKloRKAC47BAkXAKAYyPAmuwgJFyNAGvoCKNkmZ7sLCQklumBI4wSHVYTYx2H1fy+eaFYzg8iH0kycQIBErJDkoMTAK1GgJ/aj5/6CTbVuYJPaGqgAAAAAElFTkSuQmCC");
                background-size: 100% 100%;
             }
          }
        }
      }
    }
    .form-wrapper{
      margin-top: 20px;
      .form-content{
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 20px;
        .formItem{
          flex: 0 0 40%;
        }
        .numberItem{
          position: absolute;
          right: 0;
          top: -97px;
          .inputBox{
            width: 200px;
          }
        }
      }
      .inputBox{
        width: 276px;
      }
      .el-textarea {
        width: 360px;
      }
      .el-checkbox{
        margin-top: 5px;
      }
    }
    .title{
      display: block;
      height: 22px;
      line-height: 22px;
      padding-left: 12px;
      border-left: 2px solid #01B8E1;
      font-size: 17px;
      font-weight: 600;
      color: #09BAE3;
    }
    .tableView-wrapper{
      .title-wrapper{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
    }
    .upload-wrapper{
      width: 530px;
      margin-top: 30px;
      .title{
        font-size: 17px;
      }
      .upload-content{
        margin-top: 20px;
        .el-upload__tip{
          display: inline-block;
          padding-left: 15px;
        }
      }
      .make-content{
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 30px;
        font-size: 14px;
      }
    }
    .submit-wrapper{
      display: flex;
      justify-content: flex-end;
      position: absolute;
      right: 20px;
      bottom: 0px;
    }
  }
</style>
<style lang="scss">
  .view-main{
    .el-dialog__footer{overflow: hidden;width: 100%}
    .payMoney{
      .el-input{
        width: 146px;
      }
    }
    .choosePage{
      float: right;
      margin-top: 10px;
    }
    .chooseDia .el-dialog__footer{
      overflow: hidden;
      width: 100%;
    }
    .el-dialog__header{
      border-bottom: 1px solid #e0e0e0 !important;
    }
    /*修改table-footer总计样式*/
    .el-table__footer-wrapper{
      td{
        &:not(:first-child){
           color:red;
         }
      }
    }
    .rdodly{
      input[readonly]{
        background: #ECECEC;
      }
    }
    /*table Item样式*/
    .orderTable{
      .el-table__row{
        &>td{
           padding: 0;
         }
      }
      .formInnerInput{
        &>.el-input__inner{
           width: 100%;
           height: 100%;
           text-align: center;
           border: none;
           border-radius: 0;
         }
      }
    }
    .tableView-wrapper{
      td,th{
        padding: 8px 0;
      }
    }
  }
</style>
