<template>
  <el-row>
    <div class="container-wrapper" v-show="$route.path==='/substitute/outDictateList'">
      <b2bSearch @searchEvent='searchEvent' @searchSelect="searchSelect">
        <div slot="button" style="margin-bottom: 22px">
          <el-button size="small" type="primary"
                     @click="$router.push('/substitute/outDictateList/newOutDictate?outwarehouseType='+'IMPORT')">新增进口指令
          </el-button>
          <el-button size="small" type="primary"
                     @click="$router.push('/substitute/outDictateList/newOutDictate?outwarehouseType=' +'Local')">
            新增香港交货指令
          </el-button>
          <el-button size="small" type="primary" @click="bjFunc()">编辑</el-button>
          <el-button size="small" type="primary" @click="thFunc()">退回</el-button>
          <el-button size="small" type="primary" @click="scFunc()">删除</el-button>
        </div>

        <div slot="table">
          <!-- <tabTmp :tabData="orderListData"
          :tabHeight="'680px'"
                  @getSelectResult="getSelectResult"
                  :tabTagData="tabTagData" :showIndex ="false" :showSelection ="true">
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
                             label="出库单号"
                             width="120">
            </el-table-column>
            <el-table-column align="center"
                             prop="customOrder"
                             label="内部订单号"
                             width="120">
            </el-table-column>
            <el-table-column align="center"
                             prop="createDate"
                             label="创建日期">
            </el-table-column>
            <el-table-column align="center"
                             prop="status"
                             label="状态"
                             :formatter="formatter"
            >
            </el-table-column>
            <el-table-column align="center" :formatter="formatter2"
                             prop="outwarehouseType"
                             label="出库类型"
            >
            </el-table-column>

            <el-table-column align="center"
                             prop="count"
                             label="总数量"
                             width="180">
            </el-table-column>
            <el-table-column align="center"
                             prop="currency"
                             label="币别"
            >
            </el-table-column>
            <el-table-column align="center"
                             prop="money"
                             label="总金额"
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
  </el-row>

</template>

<script>
  import b2bSearch from '@/components/b2bSearch/index'
  import tabTmp from '@/components/tabTemplate'
  // import req from '@/utils/req'
  export default {
    data() {
      return {
        listSelect: '',
        total: 0,
        currentPage: 1,
        pageSize: 20,
        formInline: {
          user: '',
          region: ''
        },
        tabTagData: [ // 付款明细表头数据

        ],
        currentRow: null,
        showOrderDetail: false,
        orderListData: [],
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
          .post('/api/purchase/order/listOutWarehouseApply', data)
          .then(response => {
            this.orderListData = response.data.list
            this.total = response.data.total
          })
      },
      dbGetCellMsg(row) {
        if (row.status === '0') {
          this.$router.push({ path: '/substitute/outDictateList/newOutDictate?id=' + row.orderId })
        } else {
          this.$router.push({ path: '/substitute/outDictateList/detail?id=' + row.orderId })
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
      formatter2(row, column) {
        if (row.outwarehouseType === 'IMPORT') {
          return '进口订单'
        } else {
          return '香港交货'
        }
      },
      bjFunc() {
        if (this.listSelect[0].status === '0') {
          this.$router.push({ path: '/substitute/outDictateList/newOutDictate?id=' + this.listSelect[0].orderId })
        }
      },
      // 列表退回
      thFunc() {
        if (this.listSelect[0].status === 1) {
          let data = {
            operateType: 'RETURN', // RETURN退回,DELETE删除
            orderId: this.listSelect[0].orderId
          }
          this.$axios.post('/api/purchase/order/backOrDeleteOutWarehouse', data)
            .then((response) => {
              this.getList()
            })
        } else {
          return
        }
      },
      // 列表删除
      scFunc() {
        if (this.listSelect[0].status === 0) {
          let data = {
            operateType: 'DELETE', // RETURN退回,DELETE删除
            orderId: this.listSelect[0].orderId
          }

          this.$axios.post('/api/purchase/order/backOrDeleteOutWarehouse', data)
            .then((response) => {
              this.getList()
            })
        } else {
          return
        }
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
        this.$axios.post('/api/purchase/order/listOutWarehouseApply', data)
          .then((response) => {
            this.orderListData = response.data.list
            this.total = response.data.total
          })
      },
      getSelectChange(i) {
        console.log(i)
        this.listSelect = i
      },
      handleCurrentChange(currentPage) {
        let data = {
          pageSize: currentPage - 1,
          pageCount: 20
        }
        this.$axios.post('/api/purchase/order/listOutWarehouseApply', data)
          .then((response) => {
            this.orderListData = response.data.list
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
      getList() {
        // 列表查询
        let data = {
          pageSize: 0,
          pageCount: 20

        }
        if (this.$route.path === '/substitute/outDictateList') {
          this.$axios.post('/api/purchase/order/listOutWarehouseApply', data)
            .then((response) => {
              if (response.data) {
                this.orderListData = response.data.list
                this.total = response.data.total
              }
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
    }, watch: {
      $route(v) {
        console.log()
        if (v.path === '/substitute/outDictateList') {
          // 列表查询
          let data = {
            pageSize: 0,
            pageCount: 20

          }
          if (this.$route.path === '/substitute/outDictateList') {
            this.$axios.post('/api/purchase/order/listOutWarehouseApply', data)
              .then((response) => {
                if (response.data) {
                  this.orderListData = response.data.list
                  this.total = response.data.total
                }
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
