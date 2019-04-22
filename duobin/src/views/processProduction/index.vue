<template>
  <el-row>
    <div v-show="$route.path==='/fictitious/production'" class="content-wrapper">
      <search @searchEvent="searchEvent" :inputPlaceholder="'查询加工单号/富森项目号/内部项目号'">
        <div slot="button" style="margin-bottom: 22px">
          <el-button type="primary" size="small" @click="$router.push('/fictitious/production/detail')" >新增</el-button>
          <el-button type="primary" size="small" @click="check" :disabled="storager">编辑</el-button>
          <el-button type="warning" size="small" @click="retreat" :disabled="sendBack">退回</el-button>
          <el-button type="danger" size="small" @click="deleteItemHandle" :disabled="storager">删除</el-button>
        </div>
      </search>
      <div v-loading="loadState">
        <tabTmp :tabData="tabData"
                tabMain="tabMain"
                :tabHeight="'450px'"
                :openDbClick="true"
                :showSelection="true"
                @dbClickCell="dbClickCell"
                @getSelectResult="getSelectResult"
                :tabTagData="tabTagData">
        </tabTmp>
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
  import tabTmp from '@/components/tabTemplate'
  import search from '@/components/fictitiousSearch'
  import req from '@/utils/req'
  export default {
    data() {
      return {
        storager: true,
        sendBack: true,
        itemId: [],
        tabData: [
          {
            orderNum: '87654321',
            date: '2018-01-22 10:45',
            orderStatus: '待确认',
            supplier: '34178599',
            logistics: '深圳发货',
            money: '150万USD',
            smart: '深圳市酷派科技有限公司',
            confirm: ''
          },
          {
            orderNum: '87654321',
            date: '2018-01-22 10:45',
            orderStatus: '待确认',
            supplier: '34178599',
            logistics: '深圳发货',
            money: '150万USD',
            smart: '深圳市酷派科技有限公司',
            confirm: '张三'
          },
          {
            orderNum: '87654321',
            date: '2018-01-22 10:45',
            orderStatus: '待确认',
            supplier: '34178599',
            logistics: '深圳发货',
            money: '150万USD',
            smart: '深圳市酷派科技有限公司',
            confirm: ''
          },
          {
            orderNum: '87654321',
            date: '2018-01-22 10:45',
            orderStatus: '待确认',
            supplier: '34178599',
            logistics: '深圳发货',
            money: '150万USD',
            smart: '深圳市酷派科技有限公司',
            confirm: ''
          }
        ],
        tabTagData: [
          {
            label: '加工单号',
            prop: 'fsMachineOrderNo',
            width: '120px'
          },
          {
            label: '订单状态',
            prop: 'orderStatus',
            width: '80px'
          },
          {
            label: '创建时间',
            prop: 'sysCreatedDate',
            width: '180px'
          },
          {
            label: '富森项目号',
            prop: 'fsOrderNo',
            width: '120px'
          },
          {
            label: '内部项目号',
            prop: 'customerNo',
            width: '120px'
          },
          {
            label: '加工型号',
            prop: 'jgSpce',
            width: '120px'
          },
          {
            label: '产品名称',
            prop: 'productName',
            width: '120px'
          },
          {
            label: '加工单价',
            prop: 'pPrice',
            width: '120px'
          },
          {
            label: '加工数量',
            prop: 'pQty',
            width: '120px'
          },
          {
            label: '订单金额',
            prop: 'customsAmount',
            width: '120px'
          },
          {
            label: '已付款金额',
            prop: 'payedAmt',
            width: '120px'
          },
          {
            label: '未付款金额',
            prop: 'noPayedAmt',
            width: '120px'
          },
          {
            label: '发票号码',
            prop: 'invoiceNumber',
            width: '120px'
          },
          {
            label: '收票数量（在里面）',
            prop: 'spQty',
            width: '150px'
          },
          {
            label: '已收发票金额',
            prop: 'recInvAmt',
            width: '120px'
          },
          {
            label: '税率',
            prop: 'taxRate',
            width: '120px'
          },
          {
            label: '未收发票金额',
            prop: 'noRecINVAmt',
            width: '120px'
          },
          {
            label: '备注',
            prop: 'remark',
            width: '180px'
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
        pageTotal: 0,
        currentPage: 1,
        pageSize: 10
      }
    },
    components: {
      search,
      tabTmp
    },
    created() {
      this.getOrderList()
    },
    watch: {
      $route() {
        // this.getOrderList()
      }
    },
    methods: {
      getOrderList() {
        this.loadState = true
        let jsonStr = this.requestDara
        // console.log(jsonStr)
        // console.log(typeof jsonStr)
        this.$axios.post('api/virtual/processingContract/itemList', jsonStr).then((res) => {
          this.tabData = res.data.list
          res.data.list.forEach((item, index, arr) => {
            if (arr[index].orderStatus === '0') {
              arr[index].orderStatus = '暂存'
            } else if (arr[index].orderStatus === '1' || arr[index].orderStatus === '2') {
              arr[index].orderStatus = '审核中'
            } else {
              arr[index].orderStatus = '已审核'
            }
          })
          this.pageTotal = res.data.total
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      handleCurrentChange(currentPage) {
        this.requestDara.pageSize = currentPage
        this.getOrderList()
      },
      // 判断编辑退回按钮状态
      getSelectResult(val) {
        if (val.length === 1) {
          if (val[0].orderStatus === '暂存') {
            this.storager = false
          } else if (val[0].orderStatus === '审核中') {
            this.sendBack = false
          }
          this.itemId = val[0].itemId
          this.orderStatus = val[0].orderStatus
        } else {
          this.storager = true
          this.sendBack = true
        }
      },
      // 查询
      searchEvent(searchOption) {
        this.requestDara.startDate = searchOption.date[0]
        this.requestDara.endDate = searchOption.date[1]
        this.requestDara.gatherSelcondition = searchOption.registrar
        this.requestDara.orderStatus = searchOption.status
        this.getOrderList()
      },
      getSearchData(searchOption, pageCurrent, showMsg = true) {
      },
      dbClickCell(rows) {
        console.log(rows)
        this.$router.push({
          path: '/fictitious/production/detail',
          query: { id: rows.itemId, status: rows.orderStatus }
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
          this.$axios.get('/api/import/order/orderinfo/remove', {
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
      check() {
        this.$router.push({
          path: '/fictitious/production/detail',
          query: { id: this.itemId, status: this.orderStatus }
        })
      },
      /**
       *  退回订单
       * */
      retreat() {
        this.$confirm('确实要退回该订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          req.post('api/virtual/order/returnItemOrder', {
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    padding: 10px 22px 0;
    .clearFloat{
      .paginationContent{
        float: right;
        margin-top: 10px;
      }
    }
    .searchBtn-Content{
      position: relative;
      .searchOption{
        position: absolute;
        right: 380px;
        top: 0px;
      }
    }
  }
</style>
