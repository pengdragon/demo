<template>
  <el-row>
    <div v-show="$route.path==='/fictitious/exportOrder'" class="content-wrapper">
      <search @searchEvent="searchEvent" :inputPlaceholder="'查询出口单号/富森项目号'">
        <div slot="button" style="margin-bottom: 22px">
          <el-button type="primary" size="small" @click="$router.push('/fictitious/exportOrder/detail')" >新增</el-button>
          <el-button type="primary" size="small" @click="check" :disabled="storager">编辑</el-button>
          <el-button type="warning" size="small" @click="retreat" :disabled="sendBack">退回</el-button>
          <el-button type="danger" size="small" @click="deleteItemHandle" :disabled="storager">删除</el-button>
        </div>
      </search>
      <!--文件上传弹框-->
      <uploadCmp :showDialog="showUpload"
                 :uploadClose="true"
                 :acceptType="'.doc'"
                 :downloadModelUrl="'https://test.fusen.net.cn/file/download/5c81efc0ea1c9c6cabd31f7a'"
                 @closeHandle="handleChange"></uploadCmp>
      <div v-loading="loadState">
        <el-table height="450"
                  :data="tabData" border style="width: 100%"
                  @cell-dblclick="dbClickCell"
                  @selection-change="getSelectResult">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column label="出口订单" align="center" width="120" prop="fsExportOrderNo"></el-table-column>
          <el-table-column label="订单状态" align="center" prop="orderStatus"></el-table-column>
          <el-table-column label="订单日期" align="center" width="120" prop="orderDate"> </el-table-column>
          <el-table-column label="币别" align="center" width="120" prop="orderCurrency"></el-table-column>
          <el-table-column label="订单金额" align="center" width="120" prop="customsAmount"></el-table-column>
          <el-table-column label="平台" align="center" width="220" prop="invHead"></el-table-column>
          <el-table-column label="物流状态" align="center" prop="logisticsStatus">
            <template slot-scope="scope">
              <span style="color: #1F9BD6;cursor: pointer" @click="clickLogistics(scope.row)">{{scope.row.logisticsStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报关日期" align="center" width="120" prop="cstDate"></el-table-column>
          <el-table-column label="车次号" align="center" width="120" prop="ysTruckNo"></el-table-column>
          <el-table-column label="订单确认" align="center" width="180" prop="orderAcknowledge">
            <template slot-scope="prop">
              <el-button type="success"
                         size="small"
                         @click="addAttention(prop.row)"
                         v-show="prop.row.affirmStatus === null"
              >待确认</el-button>
              <el-button type="danger"
                         size="small"
                         v-show="prop.row.affirmStatus !== null">
                <a class="link-type" :href=" 'https://test.fusen.net.cn/file/download/'+ prop.row.affirmStatus " target='_blank'>查看确认书 </a></el-button>
            </template>
          </el-table-column>
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
  import tabTmp from '@/components/tabTemplate'
  import search from '@/components/fictitiousSearch'
  import uploadCmp from '@/components/uploadCmp'
  import req from '@/utils/req'
  export default {
    data() {
      return {
        storager: true,
        sendBack: true,
        orderId: '',
        showUpload: false, // 文件上传弹框
        itemId: [],
        fileList: {},
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
      tabTmp,
      uploadCmp
    },
    created() {
      this.getOrderList()
    },
    watch: {
      $route() {
        this.getOrderList()
      }
    },
    methods: {
      getOrderList() {
        this.loadState = true
        let jsonStr = this.requestDara
        // console.log(jsonStr)
        // console.log(typeof jsonStr)
        this.$axios.post('api/virtual/exportOrder/itemList', jsonStr).then((res) => {
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
      // 点击物流状态查看物流
      clickLogistics(row) {
        this.$router.push({
          path: '/export/logistics',
          query: { id: row.orderId }
        })
      },
      /**
       * 添加订单确认
       * */
      addAttention(row) {
        this.orderId = row.itemId
        this.showUpload = true
      },
      /**
       * 获取导入的数据
       * */
      handleChange(file) {
        this.showUpload = false
        if (file.response) {
          this.fileList.orderId = this.orderId
          this.fileList.fileName = file.raw.name
          this.fileList.fileType = file.raw.name.split('.')[1]
          this.fileList.fileId = file.response.fileId
        }
        this.$axios.post('api/import/order/orderinfo/customorderaffirm', this.fileList).then(() => {
          this.$notify({
            type: 'success',
            message: '确认成功'
          })
          this.getOrderList()
        }).catch((error) => {
          console.log(error)
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
      getSearchData(searchOption, pageCurrent, showMsg = true) {
      },
      dbClickCell(rows) {
        console.log(rows)
        this.$router.push({
          path: '/fictitious/exportOrder/detail',
          query: { id: rows.itemId, status: rows.orderStatus }
        })
      },
      check() {
        this.$router.push({
          path: '/fictitious/exportOrder/detail',
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
