<template>
  <el-row>
    <div v-show="$route.path==='/import/payApply'" class="container-wrapper">
      <b2bSearch>
        <div slot="button" style="margin-bottom: 22px">
          <el-button size="small" type="primary" @click="$router.push('/import/payApply/payApplyDetail')">新增</el-button>
        </div>
        <div slot="moreSearch">
        </div>
      </b2bSearch>
      <el-table
        :data="orderListData"
        @current-change="handleCurrentChange"
        @cell-dblclick="dbClickCell"
        class="tableContent"
        header-row-class-name="tabHead"
        :border="true"
        :row-style="{height:'30px'}"
        @click="showDetail"
        style="width: 99.5%">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60px">
        </el-table-column>
        <el-table-column
          align="center"
          label="富森订单号">
          <template slot-scope="prop">
            {{prop.row.fusenOrder}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="240px"
          label="收款公司">
          <template slot-scope="prop">
            {{parseDate(prop.row.collectCompany)}}
          </template>
        </el-table-column>
        <el-table-column
          property="status"
          align="center"
          label="付款金额">
          <template slot-scope="prop">
            {{prop.row.payMoney}}
          </template>
        </el-table-column>
        <el-table-column
          property="supplier"
          align="center"
          label="预计付款时间">
          <template slot-scope="prop">
            {{prop.row.payTime}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="prop">
            {{prop.row.status}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="备注" class-name="remark-wrapper">
          <template slot-scope="prop">
            {{prop.row.remark}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <router-view></router-view>
  </el-row>
</template>

<script>
  import b2bSearch from '@/components/b2bSearch/index'
  import req from '@/utils/req'
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        orderListData: [
          {
            fusenOrder: '987658',
            collectCompany: '深圳市顺丰科技股份有限公司',
            payMoney: '100000 RMB',
            payTime: '2018-03-15',
            status: '已付款',
            remark: ''
          },
          {
            fusenOrder: '987658',
            collectCompany: '深圳市顺丰科技股份有限公司',
            payMoney: '100000 RMB',
            payTime: '2018-03-15',
            status: '待付款',
            remark: ''
          }
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
        pickerOptions2: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        },
        value7: '',
        radio: '1',
        showUploadSuccess: true,
        hiddenState: false,
        gatherSelcondition: 'FA170708644'
      }
    },
    methods: {
      dbClickCell() {
        this.$router.push({
          path: '/import/payApply/payApplyDetail'
        })
      },
      onSelect() {
        // 订单查询
        let gatherSelcondition = this.gatherSelcondition
        req.post('/order/query', {
          'pageSize': 0,
          'pageCount': 20,
          'clientId': '00087895-0000-0000-0000-0000AF0A35D3',
          'businessType': '1',
          'gatherSelcondition': gatherSelcondition
        }).then((res) => {
          this.$message({
            showClose: true,
            message: '查询成功',
            type: 'success'
          })
          this.orderListData = res.orderLst.list
        })
      },
      handleCurrentChange(val) {
        this.currentRow = val
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
      b2bSearch
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  .container-wrapper{
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 15px 15px 90px 20px;
    min-height: 898px;
    .form-content{
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 0;
      .pickerTag{
        vertical-align: top;
      }
      .orderInput{
        display: inline-block;
        width: 360px;
      }
      .searchButton{
        display: inline-block;
      }
      .moreButton{
        display: inline-block;
      }
    }
    .highText{
      color: #02B7DF;
      cursor: pointer;
      .hidden{
        display: none;
      }
    }
    .tableContent{
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
