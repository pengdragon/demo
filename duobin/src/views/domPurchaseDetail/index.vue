<template>
  <div class="content-wrapper">
    <el-row>
      <el-col :span="24">
        <div class="order-content">
          <div class="title">基本信息</div>
          <el-form label-position="right" class="form-content" ref="formMain" :model="order" size="small" :rules="orderRules" label-width="120px">
            <el-row :gutter="50">
              <el-col :span="12">
                <el-form-item label="富森项目号:"
                              class="formItem inputBox">
                  <el-select v-model="order.fsOrderNo"
                             style="width: 360px"
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
                <el-form-item label="内部项目号：" >
                  <el-input v-model="order.customerNo" v-if="editState" disabled class="inputBox"></el-input>
                  <div v-else>{{order.customerNo}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目平台：" prop="invHead">
                  <el-select v-model="order.invHead" v-if="editState" @change="getInvHead"placeholder="请选择" class="inputBox" >
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
                <el-form-item label="项目数量：" prop="pQty">
                  <el-input v-model="order.pQty" v-if="editState" disabled class="inputBox"></el-input>
                  <div v-else>{{order.pQty}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="PO号：" prop="poNo">
                  <el-input v-model="order.poNo" v-if="editState" class="inputBox"></el-input>
                  <div v-else>{{order.poNo}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!--<el-form-item label="收货工厂：" prop="customsTakeGoodsUnitFK">-->
                  <!--<el-input suffix-icon="el-icon-search" class="inputBox" v-model="order.receivingFactory" disabled></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="收货工厂:"
                              class="formItem inputBox">
                  <el-select v-model="order.receivingFactory"
                             style="width: 360px"
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
                  <div v-else>{{order.receivingFactory}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="交货地址：" prop="gncgadd">
                  <el-input suffix-icon="el-icon-search" v-model="order.gncgadd" v-if="editState" class="inputBox"></el-input>
                  <div v-else>{{order.gncgadd}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采购日期：" prop="orderDate" class="inputBox">
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
            </el-row>
          </el-form>
          <div class="title">采购明细</div>
          <div style="text-align: right;margin-bottom: 20px">
            <el-button type="primary" @click="importHandle" v-if="editState">导入</el-button>
            <el-button type="primary" @click="addOrder" v-if="editState">新增</el-button>
          </div>

          <el-table :data="order.list" class="table-main" show-summary :summary-method="getSummaries" border>
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="name" label="料号" align="center">
              <template slot-scope="prop">
                <div class="tmpContent">
                  <el-input class="inline-input" v-model="prop.row.custPartNo" placeholder="料号" v-if="editState"></el-input>
                  <div v-else>{{prop.row.custPartNo}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="useAge" label="用量" align="center">
              <template slot-scope="prop">
                <div class="tmpContent">
                  <el-input class="inline-input" v-model="prop.row.useAge" placeholder="用量" v-if="editState"></el-input>
                  <div v-else>{{prop.row.useAge}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="partName" label="品名" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.partName" placeholder="品名" v-if="editState"></el-input>
                <div v-else>{{prop.row.partName}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="spec" label="配置及规格" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.spec" placeholder="配置及规格" v-if="editState"></el-input>
                <div v-else>{{prop.row.spec}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.quantity" placeholder="数量" v-if="editState"></el-input>
                <div v-else>{{prop.row.quantity}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="成交单位" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.unit" placeholder="成交单位" v-if="editState"></el-input>
                <div v-else>{{prop.row.unit}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.price" placeholder="单价" v-if="editState"></el-input>
                <div v-else>{{prop.row.price}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.amount" placeholder="金额" v-if="editState"></el-input>
                <div v-else>{{prop.row.amount}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="currency" label="币别" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.currency" placeholder="币别" v-if="editState"></el-input>
                <div v-else>{{prop.row.currency}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="gncgJhrq" label="交货日期" width="220px" align="center">
              <template slot-scope="prop">
                <el-date-picker
                  v-model="prop.row.gncgJhrq"
                  v-if="editState"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <div v-else>{{prop.row.gncgJhrq}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="jsfs" label="结算方式" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.jsfs" v-if="editState" placeholder="结算方式"></el-input>
                <div v-else>{{prop.row.jsfs}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="vendorName" label="供应商全称" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.vendorName" v-if="editState" placeholder="供应商"></el-input>
                <div v-else>{{prop.row.vendorName}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="custOrderNos" label="PO号" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.custOrderNos" v-if="editState" placeholder="PO号"></el-input>
                <div v-else>{{prop.row.custOrderNos}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="cuDomentary" label="采购员" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.cuDomentary" v-if="editState" placeholder="采购员"></el-input>
                <div v-else>{{prop.row.cuDomentary}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" style="color: #85ce61" v-if="editState" @click="deleteOrder(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--文件上传弹框-->
          <uploadCmp :showDialog="showUpload"
                     :uploadClose="true"
                     :importTabTagData="tabTagData"
                     :acceptType="'.xlsx'"
                     :downloadModelUrl="'https://test.fusen.net.cn/file/download/5c8b58f9ea1c9c6cabd32059'"
                     @importFileHandle="getImportTabData"
                     @closeHandle="showUpload = false"></uploadCmp>
          <div style="text-align: right;margin-top: 20px">
            <el-button type="primary" @click="submitHandle('0')" v-if="editState">保存</el-button>
            <el-button type="success" @click="submitHandle('1')" v-if="editState">提交</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import req from '@/utils/req'
  import uploadCmp from '@/components/uploadCmp'
  export default {
    data() {
      return {
        editState: true, // 项目可编辑
        showUpload: false, // 文件导入弹窗
        order: {
          itemId: '',
          itemId_fk: '000B2E8B-0000-0000-0000-0000A119FA2C',
          fsPurchaseOrderNo: '',
          fsOrderNo: '',
          customerNo: '',
          invHead: '',
          poNo: '',
          customsTakeGoodsUnitFK: '',
          pQty: '',
          customsAmount: '',
          receivingFactory: '',
          orderCurrency: 'USD',
          gncgadd: '',
          orderDate: '',
          settleType: '3',
          orderStatus: '1',
          list: [
            // {
            //   itemDetailId: '',
            //   custPartNo: '',
            //   useAge: '',
            //   partName: '',
            //   spec: '',
            //   quantity: '',
            //   unit: '',
            //   price: '',
            //   amount: '',
            //   currency: '',
            //   gncgJhrq: '',
            //   jsfs: '',
            //   vendorName: ' ',
            //   custOrderNos: '',
            //   cuDomentary: ''
            // }
          ],
          file: [
          ]
        },
        factoryList: [],
        tabTagData: [// 导入商品明细列表表头
          {
            label: '料号',
            prop: 'custPartNo',
            width: ''
          },
          {
            label: '用量',
            prop: 'useAge',
            width: ''
          },
          {
            label: '品名',
            prop: 'partName',
            width: ''
          },
          {
            label: '配置及规格',
            prop: 'spec',
            width: '140px'
          },
          {
            label: '数量',
            prop: 'quantity',
            width: '200px'
          },
          {
            label: '成交单位',
            prop: 'unit',
            width: ''
          },
          {
            label: '单价',
            prop: 'price',
            width: ''
          },
          {
            label: '金额',
            prop: 'amount',
            width: ''
          },
          {
            label: '币别',
            prop: 'currency',
            width: ''
          },
          {
            label: '交货日期',
            prop: 'gncgJhrq',
            width: ''
          },
          {
            label: '结算方式',
            prop: 'jsfs',
            width: ''
          },
          {
            label: '供应商全称',
            prop: 'vendorName',
            width: ''
          },
          {
            label: 'PO号',
            prop: 'custOrderNos',
            width: ''
          },
          {
            label: '采购员',
            prop: 'cuDomentary',
            width: ''
          }
        ],
        fsOrderNoList: [],
        orderRules: {
          fsOrderNo: [{ required: true, message: '请选择富森项目号', trigger: 'change' }],
          invHead: [{ required: true, message: '请选择项目平台', trigger: 'change' }],
          pQty: [{ required: true, message: '项目数不能为空', trigger: 'blur' }],
          poNo: [{ required: true, message: 'PO号不能为空', trigger: 'blur' }],
          gncgadd: [{ required: true, message: '请选择收货地址', trigger: 'blur' }],
          orderDate: [{ required: true, message: '请选择采购时间', trigger: 'blur' }]
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
        }],
        purchaserValue: '',
        date: ''
      }
    },
    components: {
      uploadCmp
    },
    created() {
      if (this.$route.query.status) {
        this.getOrderDetail()
        if (this.$route.query.status === '审核中') {
          // 已审核后的输入框按钮状态
          this.editState = false
        }
      }
      this.initFsOrder()
      this.initFactory()
    },
    methods: {
      // initFsOrder() { // 获取富森单号
      //   req.get('api/import/baseinfo/takeno').then((res) => {
      //     if (res.data && Array.isArray(res.data)) {
      //       res.data.forEach((val) => {
      //         this.takeno.push({
      //           fusenOrder: val.fusenOrder
      //         })
      //       })
      //     }
      //   }).catch((error) => {
      //     console.log(error)
      //   })
      // },
      // 获取富森订单号
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
                pQty: val.internalProjectNumber,
                customerNo: val.internalProjectNumber

              })
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * * 获取工厂
       * */
      initFactory() {
        req.get('api/virtual/order/partnerSearch', {
          params: {
            keyWord: ''
          }
        }).then((res) => {
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
       * * 自定义查询工厂
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
      getInvestInfo(val) { // 选取单据编码,覆盖原有值
        this.order.fsOrderNo = val.fusenOrder
      },
      getInvHead(val) { // 带出FK
        let obj = {}
        obj = this.purchaser.find((item) => { // 这里的userList就是上面遍历的数据源
          return item.value === val
        })
        this.order.invHead = obj.label
        this.order.customsTakeGoodsUnitFK = obj.value
      },
      getOrderDetail() { // 查询订单详情
        req.get('api/virtual/domesticProcure/getItemInfo', {
          params: {
            itemId: this.$route.query.id
          }
        }).then((res) => {
          this.order = res.data
          // this.order.oederDetail = res.data.list
        }).catch((error) => {
          console.log(error)
        })
      },
      // 保存订单
      submitHandle(val) {
        this.order.orderStatus = val
        let jsonStr = this.order
        console.log(jsonStr)
        // 订单保存/提交
        this.$axios.post('api/virtual/domesticProcure/itemSaveOrCommit', jsonStr).then((res) => {
          if (res.result === 'success') {
            this.$notify({
              title: '订单保存成功',
              message: res.msg,
              type: 'success'
            })
            this.$refs.formMain.resetFields()
            this.$router.replace('/fictitious/material/domPurchase')
          }
        }).catch((error) => {
          console.log(`保存/提交 ${error}`)
          // 失败时重置状态
          this.order.orderStatus = '0'
        })
      },
      deleteOrder(order, index) {
        console.log(order)
        this.order.list.splice(index, 1)
      },
      // getSelectChange(selection) { // 获取选中项
      //   this.selectionList = selection
      // },
      /**
       * *选择富森项目号 并带出内部项目号项目平台 数量
       * */
      gatheringCompanyChange(val) {
        this.order.fsOrderNo = val.fsOrderNo
        this.order.invHead = val.invHead
        this.order.customerNo = val.customerNo
        this.order.pQty = val.pQty
        this.order.itemId_fk = val.itemId
      },
      gatheringFactory(val) {
        console.log(val)
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
          this.order.list.push(val)
        })
      },
      /**
       ***表格数据自定义求和
       **/
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价'
            return
          }
          if (index === 5 || index === 7 || index === 8) {
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
        let num5 = sums[5]
        let num7 = sums[7]
        sums[8] = num5 * num7
        this.order.customsAmount = sums[8]
        return sums
      },
      addOrder() {
        this.order.list.push({
          itemDetailId: '',
          custPartNo: '',
          useAge: '',
          partName: '',
          spec: '',
          quantity: '',
          unit: '',
          price: '',
          amount: '',
          currency: '',
          gncgJhrq: '',
          jsfs: '',
          vendorName: '',
          custOrderNos: '',
          cuDomentary: ''
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    padding: 10px 20px;
    .form-content{
      margin-top: 20px;
      .inputBox{
        width: 276px;
      }
    }
    .order-content{
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
