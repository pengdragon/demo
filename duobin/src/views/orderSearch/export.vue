<template>
  <div style="height: 100%;">
    <div v-show="$route.path==='/export/orderSearch'" class="content-wrapper">
      <b2bSearch @searchEvent="searchEvent">
        <div slot="button" style="margin-bottom: 22px" >
          <el-button type="primary"
                     size="small"
                     @click="$router.push('/export/placeOrder')">出口下单</el-button>
          <el-button type="danger"
                     size="small"
                     @click="sendBack"
                     :disabled="backBtnState">退回</el-button>
          <el-button type="danger"
                     size="small"
                     @click="deleteItemHandle"
                     :disabled="deleteBtnState">删除</el-button>
        </div>
        <div slot="moreSearch">
          <el-select v-model="requestData.searchStatus" placeholder="请选择订单状态">
            <el-option label="下单" value="下单"></el-option>
            <el-option label="受理中" value="受理中"></el-option>
            <el-option label="待确认" value="待确认"></el-option>
            <el-option label="部分发货" value="部分发货"></el-option>
            <el-option label="已发货" value="已发货"></el-option>
            <el-option label="部分报关" value="部分报关"></el-option>
            <el-option label="部分收货" value="部分收货"></el-option>
            <el-option label="已收货" value="已收货"></el-option>
          </el-select>
        </div>
      </b2bSearch>
      <div v-loading="loadState">
        <el-table height="650"
                  :data="orderData" border style="width: 100%"
                  @cell-dblclick="dbClickCell"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="55" align="center"></el-table-column>
          <el-table-column label="订单关注" align="center" width="120px">
            <template slot-scope="prop">
              <el-button type="primary"
                         size="small"
                         v-if="prop.row.followStatus === 'unfollow'"
                         @click="addFollowStatus(prop.row)">点击关注</el-button>
              <el-button type="primary"
                         size="small"
                         v-else="prop.row.followStatus === 'follow'"
                         @click="cancelFollowStatus(prop.row)">取消关注</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column label="富森订单号" align="center" prop="fusenOrder">
            <template slot-scope="scope">
              <span style="color: #1F9BD6;cursor: pointer" @click="clickOrderNumber(scope.row)">{{scope.row.fusenOrder}}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单日期" align="center" prop="createDate"></el-table-column>
          <el-table-column label="订单状态" align="center" prop="status"></el-table-column>
          <el-table-column label="报关日期" align="center" prop="declDate"></el-table-column>
          <el-table-column label="订单金额(原币)" align="center" prop="cstamte"></el-table-column>
          <el-table-column label="物流状态" align="center" prop="logisticsStatus">
            <template slot-scope="scope">
              <span style="color: #1F9BD6;cursor: pointer" @click="clickLogistics(scope.row)">{{scope.row.logisticsStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column label="总数量" align="center" prop="quality"></el-table-column>
          <el-table-column label="总箱数" align="center" prop="originalPacNum"></el-table-column>
          <el-table-column label="备注" align="center" prop="remark">
            <template slot-scope="prop">
              <div class="textShow">
                {{prop.row.remark}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单确认" align="center" prop="confirm" width="140px">
            <template slot-scope="scope">
              <div style="color: #1F9BD6"
                   v-if="parseInt(scope.row.statusValue) >= 3 && parseInt(scope.row.affirmStatus) === 1">已确认(<a target="_blank" style="color: blue;text-decoration : underline; " :href="scope.row.comfirmbookUrl">点击查看</a>)</div>
              <el-button @click="showConfimDialog(scope.row)"
                         type="primary"
                         size="small"
                         v-else-if="parseInt(scope.row.statusValue) >= 3 && parseInt(scope.row.affirmStatus) !== 1">订单确认</el-button>
              <div style="color: #85ce61" v-else>待审核</div>
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

    <!--订单确认弹框-->
    <el-dialog title="订单确认" :visible.sync="confimDialgState" width="400px">
      <div style="width: 100%;text-align: center;">
        <div style="color: #2177C7;margin-bottom: 10px;">
          订单号: {{currentConfimOrderData.fusenOrder}}
        </div>
        <div>
          是否确认该订单?
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small"
                   :loading="closeConfimBtnState"
                   @click="orderConfimHandle">确认</el-button>
        <el-button :loading="closeConfimBtnState" size="small" @click="closeConfimDialog">取消</el-button>
      </div>
    </el-dialog>

    <router-view></router-view>
  </div>
</template>

<script>
  import b2bSearch from '@/components/b2bSearch'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  import api from '@/utils/apiUtil'
  import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        orderData: [
          // {
          //   fusenOrder: '87654321',
          //   createDate: '2018-01-22 10:45',
          //   status: '待确认',
          //   supplier: '深圳市酷派科技有限公司',
          //   logisticsStatus: '深圳发货',
          //   money: '150万USD',
          //   remark: '',
          //   confirm: '订单确认书.doc'
          // }
        ],
        loadState: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        dialogVisible: false,
        goodData: [
          // {
          //   productName: '二极管',
          //   model: 'KV1221',
          //   brand: '雄光',
          //   unit: '个',
          //   amount: 2,
          //   recQty: 2,
          //   declareQty: 2,
          //   deliveryQty: 2,
          //   origin: '深圳'
          // }
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
            prop: 'quality',
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
            prop: 'preSendQty',
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
        requestData: {
          'pageSize': 0,
          'pageCount': 10,
          'startDate': '',
          'endDate': '',
          'clientId': '00087895-0000-0000-0000-0000AF0A35D3',
          'gatherSelcondition': '',
          searchStatus: ''
        },
        confimDialgState: false, // 订单确认弹框
        closeConfimBtnState: false, // 订单确认按钮状态
        currentConfimOrderData: {} // 当前订单确认的订单数据
      }
    },
    components: {
      b2bSearch,
      tabTmp
    },
    computed: {
      /**
       * 删除按钮状态
       * */
      deleteBtnState() {
        return this.selection.length !== 1
      },
      /**
       * 退回按钮状态
       * */
      backBtnState() {
        return this.selection.length !== 1
      }
    },
    activated() {
      this.getOrderList()
    },
    methods: {
      sendBack() {
        this.$confirm('此操作将退回选中项目,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.selection[0].statusValue !== '1') {
            this.$notify({
              title: '警告',
              message: '该订单不能退回',
              type: 'warning'
            })
            return
          }
          const params = {
            busiCode: 1,
            id: this.selection[0].orderId
          }
          this.$axios.get('/api/import/order/sendback', {
            params
          }).then((res) => {
            this.$notify({
              title: '成功',
              message: '退回成功',
              type: 'success'
            })
            this.getOrderList()
          }).catch((err) => {
            console.log(err)
          })
        }).catch(() => {
        })
      },
      /**
       * 添加订单关注
       * */
      addFollowStatus(row) {
        this.$axios.post(`/api/import/order/setFoucusItem?orderId=${row.orderId}`).then(() => {
          this.$notify({
            type: 'success',
            message: '关注成功'
          })
          this.$set(row, 'followStatus', 'follow')
        }).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 取消订单关注
       * */
      cancelFollowStatus(row) {
        this.$axios.post(`/api/import/order/setFoucusItem?orderId=${row.orderId}`).then(() => {
          this.$notify({
            type: 'success',
            message: '取消关注成功'
          })
          this.$set(row, 'followStatus', 'unfollow')
        }).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 点击取消
       * */
      closeConfimDialog() {
        this.confimDialgState = false
      },
      /**
       * 订单确认操作
       * */
      orderConfimHandle() {
        this.closeConfimBtnState = true
        const id = this.currentConfimOrderData.orderId
        this.$axios.get('/api/import/order/orderinfo/customorderaffirm', {
          params: {
            id
          }
        }).then((res) => {
          if (res.result === 'success') {
            this.$notify({
              type: 'success',
              message: '订单确认成功',
              title: '成功'
            })
            // 关闭弹框
            this.closeConfimDialog()
            // 重新拉取数据
            this.getOrderList()
          }
          this.closeConfimBtnState = false
        }).catch((err) => {
          this.closeConfimBtnState = false
          this.$message({
            type: 'warning',
            message: '订单确认失败, 请重试'
          })
          console.log(err)
        })
      },
      /**
       * 打开确认按钮
       * */
      showConfimDialog(row) {
        this.currentConfimOrderData = row
        this.confimDialgState = true
      },
      /**
       * 删除某个订单惭怍
       * */
      deleteItemHandle() {
        const orderId = this.selection[0].orderId
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
      },
      // 获取查询订单结果列表
      getOrderList() {
        this.loadState = true
        let jsonStr = JSON.stringify(this.requestData)
        req.post('api/export/order/orderinfo/list', { jsonStr }).then((res) => {
          this.orderData = res.data.list
          this.orderData.forEach((order) => {
            order.createDate = api.getTime(order.createDate)
          })
          // 遍历生成订单确认书接口
          this.orderData.forEach((val) => {
            if (Number(val.statusValue) >= 2) {
              let baseUrl = window.g.baseUrl
              val.comfirmbookUrl = `${baseUrl}api/import/order/jasper/educe?fsno=${val.fusenOrder}&sessionid=${Cookies.get('sessionid')}`
            }
          })
          this.total = res.data.total
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      // 点击查询事件
      searchEvent(data) {
        if (data.date) {
          this.requestData.startDate = data.date[0]
          this.requestData.endDate = data.date[1]
        } else {
          this.requestData.startDate = ''
          this.requestData.endDate = ''
        }
        this.requestData.gatherSelcondition = data.registrar
        this.getOrderList()
      },
      // 表格选中数组发生变化事件
      handleSelectionChange(selection) {
        this.selection = selection
      },
      // 当前显示页数改变事件
      handleCurrentChange(currentPage) {
        this.requestData.pageSize = currentPage - 1
        this.getOrderList()
      },
      // 双击查看订单详情
      dbClickCell(row) {
        this.$router.push({
          path: '/export/orderDetail',
          query: { id: row.orderId }
        })
      },
      // 表格多选框选中一条数据时查看其详情
      lookForOrder() {
        this.$router.push({
          path: '/export/orderDetail',
          query: { id: this.selection[0].orderId }
        })
      },
      // 点击订单号查看明细
      clickOrderNumber(row) {
        this.dialogVisible = true
        this.goodLoadState = true
        req.get('api/export/order/goodsinfo/list', {
          params: {
            id: row.orderId
          }
        }).then((res) => {
          this.goodData = res.data
          this.goodLoadState = false
        }).catch((error) => {
          console.log(error)
        })
      },
      // 点击物流状态查看物流
      clickLogistics(row) {
        this.$router.push({
          path: '/export/logistics',
          query: { id: row.orderId }
        })
      },
      // 表格多选框选中一条数据时删除该订单
      deleteOrder() {
        if (this.selection[0].status !== '保存') {
          alert('该订单不能删除')
          return
        }
        let orderId = this.selection[0].orderId
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
  .button-content{
    height: auto !important;
  }
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
  .textShow {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
