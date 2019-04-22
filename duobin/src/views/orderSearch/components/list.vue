<template>
  <el-row>
    <div v-show="$route.path==='/import/orderSearch' || $route.path==='/export/orderSearch'" class="content-wrapper">
      <b2bSearch @searchEvent="searchEvent">
        <div slot="button" style="margin-bottom: 22px">
          <el-button type="primary" size="small" @click="lookForOrder" :disabled="selection.length!==1">查看</el-button>
          <el-button type="danger" size="small" @click="deleteOrder" :disabled="selection.length!==1">删除</el-button>
        </div>
        <div slot="moreSearch">
          <el-input style="width: 360px" placeholder="请输入内容"></el-input>
        </div>
      </b2bSearch>
      <div v-loading="loadState">
        <el-table height="650"
                  :data="orderData" border style="width: 100%"
                  @cell-dblclick="dbClickCell"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column label="富森订单号" align="center" prop="fusenOrder">
            <template slot-scope="scope">
              <span style="color: #1F9BD6;cursor: pointer" @click="dbOrder(scope.row)">{{scope.row.fusenOrder}}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单日期" align="center" prop="createDate"></el-table-column>
          <el-table-column label="订单状态" align="center" prop="status"></el-table-column>
          <el-table-column label="供应商" align="center" prop="supplier"> </el-table-column>
          <el-table-column label="物流状态" align="center" prop="logisticsStatus">
            <template slot-scope="scope">
              <span style="color: #1F9BD6;cursor: pointer" @click="dbLogistics(scope.row)">{{scope.row.logisticsStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单金额" align="center" prop="money"></el-table-column>
          <el-table-column label="备注" align="center" prop="remark"></el-table-column>
          <el-table-column label="订单确认" align="center" prop="confirm">
            <template slot-scope="scope">
              <span style="color: #1F9BD6">{{scope.row.confirm}}</span>
              <el-button size="mini" type="text" style="color: #85ce61">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="clearFloat" v-if="total">
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

    <el-dialog title="产品明细" :visible.sync="dialogVisible">
      <div v-loading="goodLoadState">
        <tabTmp :tabData="goodData"
                :tabTagData="goodTagData"
                :tabHeight="'400'">
        </tabTmp>
      </div>
    </el-dialog>

    <router-view></router-view>
  </el-row>
</template>

<script>
  import b2bSearch from '@/components/b2bSearch'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  import api from '@/utils/apiUtil'
  export default {
    data() {
      return {
        orderData: [
          {
            fusenOrder: '87654321',
            createDate: '2018-01-22 10:45',
            status: '待确认',
            supplier: '深圳市酷派科技有限公司',
            logisticsStatus: '深圳发货',
            money: '150万USD',
            remark: '',
            confirm: '订单确认书.doc'
          }
        ],
        loadState: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        dialogVisible: false,
        goodData: [
          {
            productName: '二极管',
            model: 'KV1221',
            brand: '雄光',
            unit: '个',
            amount: 2,
            recQty: 2,
            declareQty: 2,
            deliveryQty: 2,
            origin: '深圳'
          }
        ],
        goodTagData: [
          {
            label: '品名',
            prop: 'productName',
            width: ''
          },
          {
            label: '型号',
            prop: 'model',
            width: ''
          },
          {
            label: '品牌',
            prop: 'brand',
            width: ''
          },
          {
            label: '单位',
            prop: 'unit',
            width: '75'
          },
          {
            label: '订单数量',
            prop: 'amount',
            width: '85'
          },
          {
            label: '收货数量',
            prop: 'recQty',
            width: '85'
          },
          {
            label: '报关数量',
            prop: 'declareQty',
            width: '85'
          },
          {
            label: '发货数量',
            prop: 'deliveryQty',
            width: '85'
          },
          {
            label: '产地',
            prop: 'origin',
            width: ''
          }
        ],
        goodLoadState: false,
        selection: [],
        requestDara: {
          'pageSize': 0,
          'pageCount': 10,
          'startDate': '',
          'endDate': '',
          'clientId': '00087895-0000-0000-0000-0000AF0A35D3',
          'businessType': '1',
          'gatherSelcondition': '' }
      }
    },
    components: {
      b2bSearch,
      tabTmp
    },
    created() {
      this.getOrderList()
    },
    methods: {
      // 获取查询订单结果列表
      getOrderList() {
        this.loadState = true
        let jsonStr = JSON.stringify(this.requestDara)
        req.post('api/import/order/orderinfo/query', { jsonStr }).then((res) => {
          console.log(res)
          this.orderData = res.orderLst.list
          this.orderData.forEach((order) => {
            order.createDate = api.getTime(order.createDate)
          })
          this.total = res.orderLst.total
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      // 点击查询事件
      searchEvent(data) {
        console.log(data)
        if (data.date) {
          this.requestDara.startDate = data.date[0]
          this.requestDara.endDate = data.date[1]
          console.log(this.requestDara)
        } else {
          this.requestDara.startDate = ''
          this.requestDara.endDate = ''
        }
        this.requestDara.gatherSelcondition = data.registrar
        console.log(this.requestDara)
        this.getOrderList()
      },
      // 表格选中数组发生变化事件
      handleSelectionChange(selection) {
        this.selection = selection
      },
      // 当前显示页数改变事件
      handleCurrentChange(currentPage) {
        console.log(currentPage)
        this.requestDara.pageSize = currentPage - 1
        this.getOrderList()
      },
      // 双击查看订单详情
      dbClickCell(row) {
        console.log(row)
        this.$router.push({
          path: '/import/orderSearch/orderDetail',
          query: { id: row.orderId, status: row.status }
        })
      },
      // 表格多选框选中一条数据时查看其详情
      lookForOrder() {
        console.log(this.selection)
        this.$router.push({
          path: '/import/orderSearch/orderDetail',
          query: { id: this.selection[0].orderId, status: this.selection[0].status }
        })
      },
      // 点击订单号查看明细
      dbOrder(row) {
        console.log(row)
        this.dialogVisible = true
        this.goodLoadState = true
        req.get('api/import/order/orderinfo/querygoods', {
          params: {
            orderId: row.orderId
          }
        }).then((res) => {
          console.log(res)
          this.goodData = res.goodsLst
          this.goodLoadState = false
        }).catch((error) => {
          console.log(error)
        })
      },
      // 点击物流状态查看物流
      dbLogistics(row) {
        this.$router.push({
          path: '/import/orderSearch/logistics',
          query: { id: row.orderId }
        })
      },
      // 表格多选框选中一条数据时删除该订单
      deleteOrder() {
        console.log(this.selection)
        if (this.selection[0].status !== '保存') {
          alert('该订单不能删除')
          return
        }
        let orderId = this.selection[0].orderId
        console.log(orderId)
        req.get('api/import/order/orderinfo/remove', {
          params: {
            orderId
          }
        }).then((res) => {
          console.log(res)
        }).catch((error) => {
          console.log(error)
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
  }
</style>
