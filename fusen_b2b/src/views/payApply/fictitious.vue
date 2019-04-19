<template>
  <el-row>
    <div v-show="$route.path==='/fictitious/payApply'" class="container-wrapper">
      <search @searchEvent="searchEvent" :inputPlaceholder="'请输入订单号'">
        <div slot="button" style="margin-bottom: 22px">
          <el-button type="primary" size="small" @click="paymentRequest(5)" >进口货款申请</el-button>
          <el-button type="primary" size="small" @click="paymentRequest(6)" >国内采购付款申请申请</el-button>
          <el-button type="primary" size="small" @click="paymentRequest(7)" >加工费付款申请</el-button>
          <el-button type="primary" size="small" @click="check" :disabled="storager">编辑</el-button>
          <el-button type="warning" size="small" @click="retreat" :disabled="sendBack">退回</el-button>
          <el-button type="danger" size="small" @click="deleteItemHandle" :disabled="storager">删除</el-button>
        </div>
        <div slot="moreSearch">
        </div>
      </search>
      <div v-loading="loadState">
        <tabTmp :tabData="orderListData"
                :showSelection="true"
                :openDbClick="true"
                :tabHeight="'450px'"
                @dbClickCell="dbClickCell"
                @getSelectResult="getSelectResult"
                :tabTagData="tabTagData"></tabTmp>
      </div>
      <div class="clearFloat" v-if="pageTotal">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          background
          class="paginationContent"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>
    <router-view></router-view>
  </el-row>
</template>

<script>
  import search from '@/components/fictitiousSearch'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  export default {
    data() {
      return {
        storager: true,
        sendBack: true,
        itemId: [],
        busiType: '',
        formInline: {
          user: '',
          region: ''
        },
        tabTagData: [
          {
            label: '项目号',
            prop: 'fsOrderNo',
            width: '120px'
          },
          {
            label: '付款单号',
            prop: 'paymentOrderNo',
            width: '120px'
          },
          {
            label: '状态',
            prop: 'paymentStatus',
            width: ''
          },
          {
            label: '日期',
            prop: 'paymentDate',
            width: '120px'
          },
          {
            label: '收款公司',
            prop: 'collectionCompany',
            width: '220px'
          },
          {
            label: '付款类型',
            prop: 'busiType',
            width: ''
          },
          {
            label: '支付方式',
            prop: 'paymentMode',
            width: ''
          },
          {
            label: '付款金额',
            prop: 'paymentMoney',
            width: ''
          },
          {
            label: '付款币别',
            prop: 'currencyType',
            width: ''
          },
          {
            label: '税率',
            prop: 'tariffRate',
            width: ''
          },
          {
            label: '汇率',
            prop: 'exchangeRate',
            width: ''
          },
          {
            label: '备注',
            prop: 'summary',
            width: '220px'
          }
        ],
        orderListData: [
        ],
        currentRow: null,
        showOrderDetail: false,
        orderDtailData: [
          {
            productName: '',
            model: '',
            brand: '',
            unit: '',
            amount: '',
            recQty: '',
            declareQty: '',
            deliveryQty: '',
            origin: ''
          }
        ],
        requestDara: {
          pageSize: 1,
          pageCount: 10,
          startDate: '',
          endDate: '',
          orderStatus: '',
          gatherSelcondition: ''
        },
        loadState: false,
        orderStatus: '',
        accountId: '',
        pageTotal: 0,
        currentPage: 1,
        pageSize: 10,
        radio: '1',
        showUploadSuccess: true,
        hiddenState: false
      }
    },
    created() {
      this.getOrderList()
    },
    watch: {
      $route(to, from) {
        // this.getOrderList()
      }
    },
    methods: {
      // 订单列表查询
      getOrderList() {
        this.loadState = true
        let jsonStr = this.requestDara
        console.log(jsonStr)
        // console.log(typeof jsonStr)
        this.$axios.post('api/virtual/paymentOrder/itemList', jsonStr).then((res) => {
          this.orderListData = res.data.list
          res.data.list.forEach((item, index, arr) => {
            if (arr[index].paymentStatus === '0') {
              arr[index].paymentStatus = '暂存'
            } else if (arr[index].paymentStatus === '1' || arr[index].paymentStatus === 'SQTJ' || arr[index].paymentStatus === 'SQ') {
              arr[index].paymentStatus = '审核中'
            } else if (arr[index].paymentStatus === 'YSH' || arr[index].paymentStatus === 'YFK') {
              arr[index].orderStatus = '已审核'
            }
            if (arr[index].busiType === '5') {
              arr[index].busiType = '项目贷款'
            } else if (arr[index].busiType === '6') {
              arr[index].busiType = '国内采购'
            } else if (arr[index].busiType === '7') {
              arr[index].busiType = '加工费'
            }
            if (arr[index].paymentMode === '5') {
              arr[index].paymentMode = '电汇'
            } else if (arr[index].paymentMode === '6') {
              arr[index].paymentMode = '期票'
            } else if (arr[index].paymentMode === '7') {
              arr[index].paymentMode = '现票'
            }
          })
          this.pageTotal = res.data.total
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      // 判断编辑退回按钮状态
      getSelectResult(val) {
        if (val.length === 1) {
          let busiType = (val.busiType === '项目贷款' ? '5' : (val.busiType === '国内采购' ? '6' : '7'))
          this.busiType = busiType
          if (val[0].paymentStatus === '暂存') {
            this.storager = false
          } else {
            this.sendBack = false
          }
          this.itemId = val[0].accountId
          this.orderStatus = val[0].paymentStatus
        } else {
          this.storager = true
          this.sendBack = true
        }
      },
      paymentRequest(val) {
        this.$router.push({
          path: '/fictitious/payApply/payApplyDetail',
          query: { payType: val }
        })
      },
      dbClickCell(rows) {
        let busiType = (rows.busiType === '项目贷款' ? '5' : (rows.busiType === '国内采购' ? '6' : '7'))
        this.$router.push({
          path: '/fictitious/payApply/payApplyDetail',
          query: { id: rows.accountId, payType: busiType, status: rows.paymentStatus }
        })
      },
      // 编辑
      check() {
        this.$router.push({
          path: '/fictitious/payApply/payApplyDetail',
          query: { id: this.itemId, status: this.orderStatus, payType: this.busiType }
        })
      },
      /**
       * 删除某个订单
       * */
      deleteItemHandle() {
        this.$confirm('确实要删除该条目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const orderId = this.itemId
          this.$axios.delete('api/virtual/paymentOrder/deletePaymentOrder', {
            params: {
              orderId
            }
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            // 刷新页面
            this.getOrderList()
          }).catch((err) => {
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 退回
      retreat() {
        this.$confirm('确实要退回该订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          req.post('api/virtual/paymentOrder/returnPaymentOrder', {
            itemId: this.itemId
          }).then(() => {
            this.$notify({
              type: 'success',
              message: '成功退回订单'
            })
            this.getOrderList()
          }).catch((error) => {
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退回'
          })
        })
      },
      // 查询
      searchEvent(searchOption) {
        this.requestDara.startDate = searchOption.date[0]
        this.requestDara.endDate = searchOption.date[1]
        this.requestDara.gatherSelcondition = searchOption.registrar
        this.requestDara.orderStatus = searchOption.status
        this.getOrderList()
      },
      handleCurrentChange(currentPage) {
        this.requestDara.pageSize = currentPage
        this.getOrderList()
      },
      showSuccess() {
        console.log('成功')
        this.showUploadSuccess = !this.showUploadSuccess
      },
      hiddenHandle() {
        this.hiddenState = true
      },
      parseDate(time) {
        if (!time) { return }
        let res = time.split('.')[0].replace(/t/ig, ' ')
        return res
      },
      showDetail(orderNum) {
        this.showOrderDetail = !this.showOrderDetail
        // 点击订单号,查询明细
        req.get('/order/querygoods', {
          params: {
            orderId: '0007BC61-0000-0000-0000-0000B06AC6E4'
          }
        }).then((res) => {
          this.orderDtailData = res.goodsLst
        })
      }
    },
    components: {
      search,
      tabTmp
    }
  }
</script>

<style scoped lang="scss">
  .container-wrapper{
    box-sizing: border-box;
    padding: 10px 22px 0;
    .searchBtn-Content{
      position: relative;
      .searchOption{
        position: absolute;
        right: 380px;
        top: 0px;
      }
    }
    .clearFloat{
      .paginationContent{
        float: right;
        margin-top: 10px;
      }
    }
  }
</style>

<style lang="scss">
  .tableContent{
    /*table中标题样式*/
    .tabHead{
      th{
        background-color: #ECECEC;
      }
    }
    /*table中备注样式*/
    .remark-wrapper{
      padding: 0 !important;
      .cell{
        /*padding: 0;*/
        textarea[data-textreaStyle]{
          height: 100% !important;
          border: none;
        }
      }
    }
  }
</style>
