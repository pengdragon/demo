<template>
  <el-row>
    <div v-show="$route.path==='/fictitious/setupObject'" class="content-wrapper">
      <search @searchEvent="searchEvent" :inputPlaceholder="'请输入订单号'">
        <div slot="button" style="margin-bottom: 22px">
          <el-button type="primary" size="small" @click="$router.push('/fictitious/setupObject/addObject')" >新增</el-button>
          <el-button type="primary" size="small" @click="check" :disabled="storager">编辑</el-button>
          <el-button type="warning" size="small" @click="retreat()" :disabled="sendBack">退回</el-button>
          <el-button type="danger" size="small" @click="deleteItemHandle()" :disabled="storager">删除</el-button>
        </div>
      </search>
      <div v-loading="loadState">
        <el-table height="450"
                  :data="tabData" border style="width: 100%"
                  :showSelection="true"
                  @cell-dblclick="dbClickCell"
                  @selection-change="getSelectResult">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column label="订单关注" align="center" width="120px">
            <template slot-scope="prop">
              <el-button type="success"
                         size="small"
                         class="followBtn"
                         v-show="prop.row.focuStatus ==='unfollow'"
                         @click="addAttention(prop.row)">点击关注</el-button>
              <el-button type="danger"
                         size="small"
                         class="followBtn"
                         v-show="prop.row.focuStatus ==='follow'"
                         @click="cancelAttention(prop.row)">取消关注</el-button>
            </template>
          </el-table-column>
          <el-table-column label="富森项目号" align="center" width="120" prop="fsOrderNo"></el-table-column>
          <el-table-column label="订单状态" align="center" prop="orderStatus"></el-table-column>
          <el-table-column label="内部项目号" align="center" width="120" prop="customerNo"> </el-table-column>
          <el-table-column label="项目日期" align="center" width="120" prop="orderDate"> </el-table-column>
          <el-table-column label="项目平台" align="center" width="120" prop="parnetName"> </el-table-column>
          <el-table-column label="品名" align="center" width="120" prop="partName"> </el-table-column>
          <el-table-column label="出口型号" align="center" width="120" prop="exportModel"> </el-table-column>
          <el-table-column label="项目单价" align="center" width="120" prop="itemPrice"> </el-table-column>
          <el-table-column label="项目数量" align="center" width="120" prop="itemNum"> </el-table-column>
          <el-table-column label="金额" align="center" width="120" prop="customerNo"> </el-table-column>
          <el-table-column label="订单币别" align="center" width="120" prop="orderCurrency"> </el-table-column>
          <el-table-column label="手机屏幕尺寸（寸）" align="center" width="120" prop="mobileScreenSize"> </el-table-column>
          <el-table-column label="整机或套料" align="center" width="120" prop="totalOrPart"> </el-table-column>
          <el-table-column label="尾款方式" align="center" width="120" prop="lastPay"> </el-table-column>
          <el-table-column label="付款类型" align="center" width="120" prop="settleType"> </el-table-column>
        </el-table>
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
        tabData: [
        ],
        requestDara: {
          pageSize: 1,
          pageCount: 10,
          startDate: '',
          endDate: '',
          orderStatus: '',
          gatherSelcondition: ''
        },
        selection: [],
        multipleSelection: [],
        orderStatus: '',
        itemId: '',
        loadState: false,
        pageTotal: 0,
        currentPage: 1,
        pageSize: 10,
        activeRouter: ''
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
        this.getOrderList()
      }
    },
    methods: {
      // 订单列表查询
      getOrderList() {
        this.loadState = true
        let jsonStr = this.requestDara
        // console.log(jsonStr)
        // console.log(typeof jsonStr)
        this.$axios.post('api/virtual/order/itemList', jsonStr).then((res) => {
          this.tabData = res.data.list
          res.data.list.forEach((item, index, arr) => {
            if (arr[index].orderStatus === '0') {
              arr[index].orderStatus = '暂存'
            } else if (arr[index].orderStatus === '1' || arr[index].orderStatus === '2') {
              arr[index].orderStatus = '审核中'
            } else {
              arr[index].orderStatus = '已审核'
            }
            if (arr[index].settleType === '3') {
              arr[index].settleType = '部分垫资'
            } else if (arr[index].settleType === '2') {
              arr[index].settleType = '非垫资'
            } else if (arr[index].settleType === '1') {
              arr[index].settleType = '垫资'
            }
          })
          this.pageTotal = res.data.total
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      /**
       * 添加订单关注
       * */
      addAttention(row) {
        req.post('api/import/order/setFoucusItem', {
          orderId: row.itemId
        }).then(() => {
          this.$notify({
            type: 'success',
            message: '关注成功'
          })
          this.$set(row, 'focuStatus', 'follow')
        }).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 取消订单关注
       * */
      cancelAttention(row) {
        req.post('api/import/order/setFoucusItem', {
          orderId: row.itemId
        }).then(() => {
          this.$notify({
            type: 'success',
            message: '取消关注成功'
          })
          this.$set(row, 'focuStatus', 'unfollow')
        }).catch((err) => {
          console.log(err)
        })
      },
      handleCurrentChange(currentPage) {
        this.requestDara.pageSize = currentPage
        this.getOrderList()
      },
      // 判断编辑退回按钮状态
      getSelectResult(val) {
        this.selection = val
        if (val.length === 1) {
          if (val[0].orderStatus === '暂存') {
            this.storager = false
          } else {
            this.sendBack = false
          }
          this.itemId = val[0].itemId
          this.orderStatus = val[0].orderStatus
        } else {
          this.storager = true
          this.sendBack = true
        }
      },
      /**
       * 删除某个订单
       * */
      deleteItemHandle() {
        this.$confirm('确实要删除该订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const orderId = this.selection[0].itemId
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
            message: '已删除'
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
      getSearchData(searchOption, pageCurrent, showMsg = true) {
      },
      check() {
        this.$router.push({
          path: '/fictitious/setupObject/addObject',
          query: { id: this.itemId, status: this.orderStatus }
        })
      },
      // 退回
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
      },
      dbClickCell(rows) {
        console.log(rows)
        this.$router.push({
          path: '/fictitious/setupObject/addObject',
          query: { id: rows.itemId, status: rows.orderStatus }
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
  .followBtn {
    margin-left: 0!important;
  }
</style>
