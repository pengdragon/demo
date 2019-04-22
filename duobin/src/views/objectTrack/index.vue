<template>
  <el-row>
    <div v-show="$route.path==='/fictitious/orderTrack/objectTrack'" class="content-wrapper">
      <search @searchEvent="searchEvent" :inputPlaceholder="'查询订单号/内部项目号'">
        <div slot="button" style="margin-bottom: 22px">
          <el-button type="primary" size="small" @click="check" >编辑</el-button>
        </div>
      </search>
      <div v-loading="loadState">
        <tabTmp :tabData="tabData"
                tabMain="tabMain"
                :tabHeight="'450px'"
                :openDbClick="true"
                :showHandle="true"
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
  // import req from '@/utils/req'
  export default {
    data() {
      return {
        storager: true,
        sendBack: true,
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
            label: '项目平台',
            prop: 'parnetName',
            width: '120px'
          },
          {
            label: '项目日期',
            prop: 'orderDate',
            width: '180px'
          },
          {
            label: '尾款方式',
            prop: 'lastPay',
            width: '120px'
          },
          {
            label: 'BOM确认',
            prop: 'bomState',
            width: '120px'
          },
          {
            label: '品名',
            prop: 'partName',
            width: '120px'
          },
          {
            label: '型号',
            prop: 'exportModel',
            width: ''
          },
          {
            label: '手机屏幕尺寸',
            prop: 'mobileScreenSize',
            width: '120px'
          },
          {
            label: '项目单价',
            prop: 'itemPrice',
            width: '120px'
          },
          {
            label: '项目数量',
            prop: 'itemNum',
            width: '120px'
          },
          {
            label: '项目金额',
            prop: 'customsAmount',
            width: '120px'
          },
          {
            label: '内销数量',
            prop: 'domesticQuantity',
            width: ''
          },
          {
            label: '已出口数量',
            prop: 'exportedQuantity',
            width: '120px'
          },
          {
            label: '未出口数量',
            prop: 'unexportedQuantity',
            width: '120px'
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
      $route(to, from) {
        this.activeRouter = to.fullPath
      }
    },
    methods: {
      getOrderList() {
        this.loadState = true
        let jsonStr = this.requestDara
        // console.log(jsonStr)
        // console.log(typeof jsonStr)
        this.$axios.post('api/virtual/order/itemTrackList', jsonStr).then((res) => {
          this.tabData = res.data.list
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
        if (val[0].orderStatus === '暂存') {
          this.storager = false
        } else if (val[0].orderStatus === '审核中') {
          this.sendBack = false
        }
        this.itemId = val[0].itemId
        this.orderStatus = val[0].orderStatus
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
          path: '/fictitious/orderTrack/objectTrack/detail',
          query: { id: rows.itemId, status: rows.orderStatus, orderNo: rows.fsOrderNo }
        })
      },
      check() {
        this.$router.push({
          path: '/fictitious/orderTrack/objectTrack/detail',
          query: { id: this.itemId, status: this.orderStatus }
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
