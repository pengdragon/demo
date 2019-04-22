<template>
  <div>
    <!-- 提货申请 -->
    <div class="container-wrapper" v-show="$route.path==='/substitute/pickoutIndex'">
      <b2bSearch @searchEvent='searchEvent' @searchSelect="searchSelect">
        <div slot="button" style="margin-bottom: 22px">
          <el-button size="small" type="primary" @click="$router.push('/substitute/pickoutIndex/add')">新增</el-button>
          <el-button size="small" type="primary" @click="bjFunc()">编辑</el-button>
          <el-button size="small" type="primary" @click="thFunc()">退回</el-button>
          <el-button size="small" type="primary" @click="scFunc()">删除</el-button>

        </div>

        <div slot="table">
          <!-- <tabTmp :tabData="orderListData"
                  :tabHeight="'680px'"
                  :openClick="true"
                  :openDbClick="true"
                  @dbClickCell="dbClickCell"
                  :showSelection ="true"
                  :showIndex ="false"
                  :tabTagData="tabTagData"
                  @getSelectResult='getSelectResult'
                  >
          </tabTmp> -->
          <!-- @cell-dblclick="dbGetCellMsg" -->
          <el-table
            :data="orderListData"
            style="width: 100%;" border @selection-change="getSelectChange" @cell-dblclick="dbGetCellMsg">
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column align="center"
                             prop="fusenOrder"
                             label="富森入库订单号"
                             width="120">
            </el-table-column>
            <el-table-column align="center"
                             prop="pickGoodsNumber"
                             label="提货单号"
                             width="120">
            </el-table-column>
            <el-table-column align="center"
                             prop="status"
                             label="状态" :formatter="formatter">
            </el-table-column>
            <el-table-column align="center"
                             prop="createDate"
                             label="提货单创建日期"
            >
            </el-table-column>
            <el-table-column align="center"
                             prop="predictPickGoodsTime"
                             label="可提货时间"
            >
            </el-table-column>

            <el-table-column align="center"
                             prop="pickGoodsCompany"
                             label="供应商"
                             width="180">
            </el-table-column>
            <el-table-column align="center"
                             prop="sumCartons"
                             label="箱数"
            >
            </el-table-column>

            <el-table-column align="center"
                             prop="sumBoard"
                             label="板数"
            >
            </el-table-column>

          </el-table>
          <div style="margin-top:10px;float: right;" v-if="total">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              background
              class="paginationContent"
              :total="total">
            </el-pagination>
          </div>
        </div>

      </b2bSearch>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import b2bSearch from '@/components/b2bSearch/index'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'

  export default {
    data() {
      return {
        watchFunc: 0,
        listSelect: [],
        total: 0,
        currentPage: 1,
        pageSize: 20,
        formInline: {
          user: '',
          region: ''
        },
        tabTagData: [
          {
            label: '入库单号',
            prop: 'fusenOrder',
            width: ''
          }, {
            label: '内部订单号',
            prop: 'customOrder',
            width: ''
          }, {
            label: '状态',
            prop: 'status',
            width: ''
          }, {
            label: '总数量',
            prop: 'count',
            width: ''
          }, {
            label: '总金额',
            prop: 'money',
            width: ''
          }, {
            label: '币别',
            prop: 'settleType',
            width: ''
          }, {
            label: '供应商',
            prop: 'supplier',
            width: '340px'
          }, {
            label: '关注',
            prop: 'settleType',
            width: ''
          }
        ],
        orderListData: [],
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
      searchSelect(va) {
        let data = {
          pageSize: 0,
          pageCount: 20,
          status: va
        }
        this.$axios
          .post('/api/purchase/order/listPickApply', data)
          .then(response => {
            this.orderListData = response.data.list
            this.total = response.data.total
          })
      },
      dbGetCellMsg(row) {
        if (row.status === '0') {
          this.$router.push({ path: '/substitute/pickoutIndex/add?id=' + row.id })
        } else {
          this.$router.push({ path: '/substitute/pickoutIndex/detail?id=' + row.id })
        }
      },
      formatter(row, column) {
        if (row.status === '0') {
          return '暂存'
        }
        if (row.status === '1' || row.status === '2') {
          return '审核中'
        }
        if (parseInt(row.status) >= '3') {
          return '已审核'
        }

        return row.status
      },
      bjFunc() {
        if (this.listSelect[0].status === 0) {
          this.$router.push({ path: '/substitute/pickoutIndex/add?id=' + this.listSelect[0].id })
        } else {
          return
        }
      },
      // 列表退回
      thFunc() {
        if (this.listSelect[0].status !== 1) {
          return
        }
        let data = {
          operateType: 'RETURN', // RETURN退回,DELETE删除
          id: this.listSelect[0].id
        }
        this.$axios.post('/api/purchase/order/updatePickApply', data)
          .then((response) => {
            this.getList()
          })
      },
      // 列表删除
      scFunc() {
        if (this.listSelect[0].status !== 0) {
          return
        }
        let data = {
          operateType: 'DELETE', // RETURN退回,DELETE删除
          id: this.listSelect[0].id
        }

        this.$axios.post('/api/purchase/order/updatePickApply', data)
          .then((response) => {
            this.getList()
          })
      },
      // 列表选中
      getSelectChange(i) {
        console.log(i)
        this.listSelect = i
      },
      // 列表查询
      searchEvent(va) {
        this.currentPage = 1
        if (!va.date) {
          va.date = ''
        }
        console.log(va)

        let data = {
          pageSize: 0,
          pageCount: 20,
          startDate: va.date[0],
          endDate: va.date[1],
          gatherSelcondition: va.registrar

        }
        this.$axios.post('/api/purchase/order/listPickApply', data)
          .then((response) => {
            this.orderListData = response.data.list
            this.total = response.data.total
          })
      },
      handleCurrentChange(currentPage) {
        let data = {
          pageSize: currentPage - 1,
          pageCount: 20
        }
        this.$axios.post('/api/purchase/order/listPickApply', data)
          .then((response) => {
            this.orderListData = response.data.list
          })
      },
      // dbClickCell(row) {
      //   console.log(row)
      //   this.$router.push({ path: '/substitute/purchaseOrderList/detail' })
      // },
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
        if (!time) {
          return
        }
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
      },
      getList() {
        // 列表查询
        let data = {
          pageSize: 0,
          pageCount: 20

        }
        if (this.$route.path === '/substitute/pickoutIndex') {
          this.$axios.post('/api/purchase/order/listPickApply', data)
            .then((response) => {
              this.orderListData = response.data.list
              this.total = response.data.total
            })
        }
      }
    },
    components: {
      b2bSearch,
      tabTmp
    },
    created() {
      this.getList()
    },
    watch: {
      $route(v) {
        console.log(v)
        if (v.path === '/substitute/pickoutIndex') {
          // 列表查询
          let data = {
            pageSize: 0,
            pageCount: 20

          }
          if (this.watchFunc === 0) {
            this.$axios.post('/api/purchase/order/listPickApply', data)
              .then((response) => {
                this.orderListData = response.data.list
                this.total = response.data.total
              })
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .container-wrapper {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 15px 15px 90px 20px;
    min-height: 898px;

    .form-content {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 0;

      .pickerTag {
        vertical-align: top;
      }

      .orderInput {
        display: inline-block;
        width: 360px;
      }

      .searchButton {
        display: inline-block;
      }

      .moreButton {
        display: inline-block;
      }
    }

    .highText {
      color: #02B7DF;
      cursor: pointer;

      .hidden {
        display: none;
      }
    }

    .tableContent {

    }
  }
</style>

<style lang="scss">
  .tableContent {
    /*table中标题样式*/
    .tabHead {
      th {
        background-color: #ECECEC;
      }
    }

    /*table中备注样式*/
    .remark-wrapper {
      padding: 0 !important;

      .cell {
        padding: 0;

        textarea[data-textreaStyle] {
          height: 100% !important;
          border: none;
        }
      }
    }
  }
</style>

