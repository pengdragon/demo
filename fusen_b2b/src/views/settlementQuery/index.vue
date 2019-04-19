<template>
  <div>
    <div class="container-wrapper" v-show="$route.path==='/export/pay/settlementQuery'">
      <el-row>
        <el-col>
          <b2bSearch>
            <div slot="button" style="display: none!important;"></div>
            <div slot="moreSearch">
            </div>
          </b2bSearch>
        </el-col>
        <el-col class="tabs-wrapper">
          <el-tabs class="tabs">
            <el-tab-pane label="待结汇查询">
              <el-button type="primary" class="settlement">结汇</el-button>
              <el-table
                :data="waitQuery"
                class="tableContent"
                header-row-class-name="tabHead"
                :border="true"
                :row-style="{height:'30px'}"
                @click="showDetail"
                style="width: 100%">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
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
                  label="报关日期">
                  <template slot-scope="prop">
                    {{parseDate(prop.row.date)}}
                  </template>
                </el-table-column>
                <el-table-column
                  property="status"
                  align="center"
                  label="报关金额">
                  <template slot-scope="prop">
                    {{prop.row.amount}}
                  </template>
                </el-table-column>
                <el-table-column
                  property="supplier"
                  align="center"
                  label="货款">
                  <template slot-scope="prop">
                    {{prop.row.loan}}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="结汇汇率">
                  <template slot-scope="prop">
                    {{prop.row.rate}}
                  </template>
                </el-table-column>
                <el-table-column
                  property="money"
                  align="center"
                  label="可结汇金额">
                  <template slot-scope="prop">
                    {{prop.row.rateMoney}}
                  </template>
                </el-table-column>
                <el-table-column
                  property="money"
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
            </el-tab-pane>
            <el-tab-pane label="已结汇查询" class="actionContent">
              <el-table
                :data="orderListData"
                @cell-click="cellDblclick"
                class="tableContent"
                header-row-class-name="tabHead"
                :border="true"
                :row-style="{height:'30px'}"
                @click="showDetail"
                style="width: 100%">
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
                  label="报关日期">
                  <template slot-scope="prop">
                    {{parseDate(prop.row.date)}}
                  </template>
                </el-table-column>
                <el-table-column
                  property="status"
                  align="center"
                  label="报关金额">
                  <template slot-scope="prop">
                    {{prop.row.amount}}
                  </template>
                </el-table-column>
                <el-table-column
                  property="supplier"
                  align="center"
                  label="货款">
                  <template slot-scope="prop">
                    {{prop.row.loan}}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="结汇汇率">
                  <template slot-scope="prop">
                    {{prop.row.rate}}
                  </template>
                </el-table-column>
                <el-table-column
                  property="money"
                  align="center"
                  label="可结汇金额">
                  <template slot-scope="prop">
                    {{prop.row.rateMoney}}
                  </template>
                </el-table-column>
                <el-table-column
                  property="money"
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
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
    <router-view></router-view>
  </div>

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
        waitQuery: [
          {
            fusenOrder: '987658',
            date: '2018-03-15 9:00',
            amount: '50000 港币',
            loan: '100000 港币',
            rate: '0.8314',
            rateMoney: '634510元',
            status: '',
            remark: ''
          }
        ],
        orderListData: [
          {
            fusenOrder: '987658',
            date: '2018-03-15 9:00',
            amount: '50000 港币',
            loan: '100000 港币',
            rate: '0.8314',
            rateMoney: '41570 元',
            status: '已申请',
            remark: ''
          },
          {
            fusenOrder: '987658',
            date: '2018-03-15 9:00',
            amount: '50000 港币',
            loan: '100000 港币',
            rate: '0.8314',
            rateMoney: '41570 元',
            status: '审核中',
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
      cellDblclick() {
        this.$router.push({
          path: '/export/pay/settlementQuery/settlementDetail'
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
    .tabs-wrapper{
      margin-top: -60px;
      position: relative;
      .settlement{
        float: right;
        margin-bottom: 8px;
      }
    }
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
    padding: 0;
  textarea[data-textreaStyle]{
    height: 100% !important;
    border: none;
  }
  }
  }
  }
</style>
