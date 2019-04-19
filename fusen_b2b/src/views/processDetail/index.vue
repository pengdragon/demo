<template>
  <div class="content-wrapper">
    <el-row>
      <el-col >
        <div class="order-content">
          <div class="title">加工合同信息</div>
          <el-form label-position="right" :model="order" size="small" :rules="orderRules"  label-width="120px">
            <el-row :gutter="50">
              <el-col :span="12">
                <el-form-item label="富森项目号:" prop="fsOrderNo"
                              class="formItem">
                  <el-select v-model="order.fsOrderNo"
                             style="width: 100%"
                             v-if="editState"
                             filterable
                             @change="gatheringCompanyChange"
                             class="inputBox"
                             placeholder="请选择">
                    <el-option
                      v-for="item in fsOrderNoList"
                      :key="item.fsOrderNo"
                      :label="item.fsOrderNo"
                      :value="item">
                    </el-option>
                  </el-select>
                  <div v-else>{{order.fsOrderNo}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内部项目号：">
                  <el-input v-model="order.customerNo"  v-if="editState"></el-input>
                  <div v-else>{{order.customerNo}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目平台：" prop="invHead">
                  <el-select v-model="order.invHead" @change="getInvHead" v-if="editState" placeholder="请选择" style="width: 100%">
                    <el-option
                      v-for="pur in purchaser"
                      :key="pur.value"
                      :label="pur.label"
                      :value="pur.value">
                    </el-option>
                  </el-select>
                  <div v-else>{{order.invHead}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="加工厂:">
                  <el-select v-model="order.processingMaching"
                             style="width: 100%"
                             v-if="editState"
                             filterable
                             :filter-method="dataFilter"
                             @change="gatheringFactory"
                             class="inputBox"
                             placeholder="请选择">
                    <el-option
                      v-for="item in factoryList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div v-else>{{order.processingMaching}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="委托日期：">
                  <el-date-picker style="width: 276px"
                                  v-if="editState"
                                  v-model="order.orderDate"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  type="datetime"
                                  placeholder="选择日期">
                  </el-date-picker>
                  <div v-else>{{order.orderDate}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品名称：" prop="productName">
                  <el-input v-model="order.productName"  v-if="editState"></el-input>
                  <div v-else>{{order.productName}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="交货日期：" prop="dispDate">
                  <el-date-picker style="width: 276px"
                                  v-if="editState"
                                  v-model="order.dispDate"
                                  type="datetime"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期">
                  </el-date-picker>
                  <div v-else>{{order.dispDate}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="加工型号：" prop="jgSpce">
                  <el-input v-model="order.jgSpce"  v-if="editState"></el-input>
                  <div v-else>{{order.jgSpce}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="加工数量：" prop="pQty" >
                  <el-input v-model.number="order.pQty" type="number" @change="amountChange"  v-if="editState"></el-input>
                  <div v-else>{{order.pQty}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="加工单价：" prop="pPrice">
                  <el-input v-model="order.pPrice" type="number"  v-if="editState"></el-input>
                  <div v-else>{{order.pPrice}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位：" prop="unit">
                  <el-input v-model="order.unit"  v-if="editState"></el-input>
                  <div v-else>{{order.unit}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="加工金额：" prop="customsAmount" >
                  <el-input v-model="order.customsAmount"  v-if="editState"></el-input>
                  <div v-else>{{order.customsAmount}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单币别：" prop="orderCurrency">
                  <el-select v-model="order.orderCurrency" placeholder="请选择" style="width: 100%"  v-if="editState">
                    <el-option
                      v-for="item in currency"
                      :key="item.orderCurrency"
                      :label="item.orderCurrency"
                      :value="item.orderCurrency">
                    </el-option>
                  </el-select>
                  <div v-else>{{order.orderCurrency}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="付款类型：" v-show="false">
                  <el-input v-model="order.settleType"  v-if="editState"></el-input>
                  <div v-else>{{order.settleType}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注：">
                  <el-input v-model="order.remark"  v-if="editState"></el-input>
                  <div v-else>{{order.remark}}</div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="text-align: right;margin-top: 20px">
            <!--<el-button type="info" @click="$router.push('/fictitious/production')">返回</el-button>-->
            <el-button type="primary" @click="submitHandle('0')"  v-if="editState">保存</el-button>
            <el-button type="success" @click="submitHandle('1')"  v-if="editState">提交</el-button>
          </div>
        </div>
      </el-col>
      <!--<el-col :span="4"><div style="font-size: 12px;text-align: right">订单号：876543264567341</div></el-col>-->
    </el-row>
  </div>
</template>

<script>
  import req from '@/utils/req'
  export default {
    data() {
      return {
        editState: true,
        order: {
          itemId: '',
          orderId_fk: '000B2E8B-0000-0000-0000-0000A119FA2C',
          fsMachineOrderNo: '',
          orderStatus: '0',
          fsOrderNo: '',
          customerNo: '',
          invHead: '',
          customsTakeGoodsUnitFK: '',
          processingMaching: '',
          orderDate: '',
          productName: '',
          dispDate: '',
          jgSpce: '',
          pQty: '',
          unit: '',
          pPrice: '',
          customsAmount: '',
          orderCurrency: '',
          settleType: '2',
          remark: ''
        },
        factoryList: [],
        fsOrderNoList: [],
        currency: [
          {
            label: 'RMB',
            value: 'RMB'
          },
          {
            label: 'USD',
            value: 'USD'
          }
        ],
        date: '',
        takeno: [],
        orderRules: {
          fsOrderNo: [{ required: true, message: '请选择富森项目号', trigger: 'change' }],
          invHead: [{ required: true, message: '请选择项目平台', trigger: 'blur' }],
          productName: [{ required: true, message: '请填写产品名称', trigger: 'blur' }],
          jgSpce: [{ required: true, message: '请填写加工型号', trigger: 'blur' }],
          pPrice: [{ required: true, message: '请填写加工单价', trigger: 'blur' }],
          orderCurrency: [{ required: true, message: '请选择币别', trigger: 'blur' }],
          unit: [{ required: true, message: '请填写加工单位', trigger: 'blur' }],
          dispDate: [{ required: true, message: '请选择交货日期', trigger: 'blur' }],
          pQty: [{ required: true, message: '请填写加工数量', trigger: 'blur' }]
        },
        purchaser: [{
          value: '0002D787-0000-0000-0000-00005A20515A',
          label: '研祥智能科技股份有限公司'
        }, {
          value: '000F03F3-0000-0000-0000-000075C76C98',
          label: '深圳市吉而泰电子有限公司'
        }, {
          value: '2D27659B-F2A7-4DF2-83A0-5E9ADD682F23',
          label: '遵义市四海实业有限公司'
        }]
      }
    },
    created() {
      if (this.$route.query.status) {
        this.getOrderDetail()
        if (this.$route.query.status !== '暂存') {
          // 已审核后的输入框按钮状态
          this.editState = false
        }
      }
      this.initFsOrder() //  获取富森单号
      this.getCurrency() //  获取币别
      this.initFactory()
    },
    methods: {
      /**
       * * 获取加工厂
       * */
      initFactory() {
        req.get('api/virtual/order/partnerSearch', {
          params: {
            keyWord: ''
          }
        }).then((res) => {
          this.factoryList = []
          if (res.data && Array.isArray(res.data)) {
            res.data.forEach((val) => {
              this.factoryList.push({
                label: val.partnerShortName,
                value: val.partnerShortFk
              })
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * * 富森订单号
       * */
      initFsOrder() {
        req.get('api/virtual/order/itemSearch', {
          params: {
            keyword: ''
          }
        }).then((res) => {
          if (res.data && Array.isArray(res.data)) {
            res.data.forEach((val) => {
              this.fsOrderNoList.push({
                itemId: val.itemId,
                fsOrderNo: val.fsOrderNo,
                settleType: val.settleType,
                invHead: val.projectPlatform,
                customerNo: val.internalProjectNumber
              })
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       **带出项目号付款方式 平台 内部项目号
       * */
      gatheringCompanyChange(val) {
        this.order.fsOrderNo = val.fsOrderNo
        this.order.settleType = val.settleType
        this.order.invHead = val.invHead
        this.order.customerNo = val.customerNo
        this.order.itemId_fk = val.itemId
        // this.order.exportBuyer = val.exportBuyer
      },
      gatheringFactory() {
        // this.initFactory()
      },
      getInvestInfo(val) { // 选取单据编码,覆盖原有值
        this.order.fsOrderNo = val.fusenOrder
      },
      /**
       * * 自定义查询加工厂
       * */
      dataFilter(val) {
        req.get('api/virtual/order/partnerSearch', {
          params: {
            keyWord: val
          }
        }).then((res) => {
          this.factoryList = []
          if (res.data && Array.isArray(res.data)) {
            res.data.forEach((val) => {
              this.factoryList.push({
                label: val.partnerShortName,
                value: val.partnerShortFk
              })
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getCurrency() { // 币别
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
      // 查询订单详情
      getOrderDetail() {
        req.get('api/virtual/processingContract/getItemInfo', {
          params: {
            itemId: this.$route.query.id
          }
        }).then((res) => {
          this.order = res.data
        }).catch((error) => {
          console.log(error)
        })
      },
      // 保存订单
      orderList() {
        let jsonStr = this.order
        console.log(jsonStr)
        // 订单保存/提交
        this.$axios.post('api/virtual/processingContract/itemSaveOrCommit', jsonStr).then((res) => {
          if (res.result === 'success') {
            this.$notify({
              title: '订单保存成功',
              message: res.msg,
              type: 'success'
            })
            this.$router.replace('/fictitious/production')
          }
        }).catch((error) => {
          console.log(`保存/提交 ${error}`)
          // 失败时重置状态
          this.order.orderStatus = '0'
        })
      },
      amountChange(val) {
        console.log(val)
      },
      submitHandle(val) {
        this.order.orderStatus = val
        this.orderList()
      },
      getInvHead(val) { // 带出默认工厂
        this.order.customsTakeGoodsUnitFK = val
      },
      deleteOrder(order, index) {
        console.log(order)
        this.oederDetail.splice(index, 1)
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    padding: 10px 20px;
    min-width: 1310px;
    .order-content{
      width: 1110px;
      .order-status{
        width: 100%;
        height: 40px;
      }
      .title{
        border-left: 3px solid #1F9BD6;
        margin: 20px 0;
        padding-left: 20px;
        color: #1F9BD6;
      }
    }
    .status-item{
      position: relative;
      float: left;
      margin-left: 10px;
      width: 130px;
      height: 40px;
      border-radius: 5px;
      /*border: 1px solid rgb(196,196,196);*/
      background: rgb(196,196,196);
      text-align: center;
      line-height: 40px;
      color: white;
      .triangle{
        position: absolute;
        top: 10px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-left: 10px solid white;
        border-bottom: 10px solid transparent;
      }
      .triangle-right{
        right: -10px;
        border-left: 10px solid rgb(196,196,196);
      }
      .triangle-left{
        left: 0px;
      }
    }
    .complete{
      background: #1F9BD6 !important;
      .triangle-right{
        right: -10px;
        border-left: 10px solid #1F9BD6;
      }
    }
    .upload-file{
      /*width: 500px;*/
      margin-bottom: 20px;
    }
    .el-upload__tip{
      display: inline-block;
      margin-left: 20px;
      color: rgb(178,178,178)
    }
  }
</style>
<style lang="scss">
  .el-date-picker__editor-wrap{
    .el-input{
      width: 100%;
    }
  }
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
