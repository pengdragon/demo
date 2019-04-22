<template>
  <div class="content">
    <mSearchLayout @searchEvent="searchEvent"
                   :statusList="statusList"
                   placeholder="请输入订单号/派货单号">
      <div slot="button">
        <el-button size="small" type="primary" @click="$router.push('/import/sendGoods/newSendGoods')">新增</el-button>
        <el-button size="small" :disabled="DetailBtnState" @click="check">查看</el-button>
        <el-button size="small"
                   @click="sendBack"
                   :disabled="DetailBtnState">退回</el-button>
        <el-button size="small" :disabled="DetailBtnState" @click="deleteHandle">删除</el-button>
      </div>
      <div slot="table">
        <tabTmp :tabData="orderListData"
                :openDbClick="true"
                @dbClickCell="dbClickCell"
                :showSelection="true"
                :tabHeight="'500px'"
                :border="false"
                @getSelectResult="getSelectResult"
                :tabTagData="tabTagData">
        </tabTmp>
      </div>
      <div slot="page">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="sendGoods.pageSize"
          :page-size="sendGoods.pageCount"
          layout="total, prev, pager, next, jumper"
          background
          :total="pageTotal">
        </el-pagination>
      </div>
    </mSearchLayout>
  </div>
</template>

<script>
  import mSearchLayout from '@/components/mSearchLayout'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  import api from '@/utils/apiUtil'

  export default {
    data() {
      return {
        tabTagData: [ // 表头数据
          {
            label: '富森订单号',
            prop: 'fusenOrder',
            width: '120px'
          },
          {
            label: '派货单号',
            prop: 'sendNo',
            width: '120px'
          },
          {
            label: '状态',
            prop: 'status',
            width: '120px'
          },
          {
            label: '物流公司',
            prop: 'logisticsCompany',
            width: ''
          },
          {
            label: '预计派货时间',
            prop: 'fcDate',
            width: '160px'
          },
          {
            label: '送达公司',
            prop: 'sendCompany',
            width: ''
          },
          {
            label: '出货方式',
            prop: 'shipmentType',
            width: '120px'
          }
        ],
        pageTotal: 0, // 全部订单总页数
        orderListData: [], // 全部订单数据
        getSelectResultArr: [], // 获取全部选中订单列表
        sendGoods: { // 全部订单搜索项目
          pageSize: 1,
          pageCount: 10,
          startDate: '',
          endDate: '',
          gatherSelcondition: ''
        },
        statusList: [
          { label: '全部', value: '' },
          { label: '暂存', value: '0' },
          { label: '审核中', value: '1' },
          { label: '已审核', value: '3' }
        ]
      }
    },
    components: {
      mSearchLayout,
      tabTmp
    },
    activated() {
      this.sendGoodsList()
    },
    computed: {
      /**
       * 全部订单按钮状态
       * */
      DetailBtnState() {
        return !(this.getSelectResultArr.length === 1)
      }
    },
    methods: {
      /**
       * 退回
       * */
      sendBack() {
        this.$confirm('此操作将退回选中项目,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.getSelectResultArr[0].statusValue !== '1') {
            this.$notify({
              title: '警告',
              message: '该订单不能退回',
              type: 'warning'
            })
            return
          }
          let params = {
            busiCode: 3,
            id: this.getSelectResultArr[0].id
          }
          this.$axios.get('/api/import/order/sendback', {
            params
          }).then((res) => {
            this.$notify({
              title: '成功',
              message: '退回成功',
              type: 'success'
            })
            this.sendGoodsList()
          }).catch((err) => {
            console.log(err)
          })
        }).catch(() => {
        })
      },
      dbClickCell(row) {
        this.$router.push({
          path: '/import/sendGoods/sendGoodsDetail',
          query: { id: row.id, status: row.status }
        })
      },
      /**
       * 搜索事件
       * */
      searchEvent(val) {
        // 全部订单
        if (val.date) {
          this.sendGoods.startDate = val.date[0]
          this.sendGoods.endDate = val.date[1]
        } else {
          this.sendGoods.startDate = ''
          this.sendGoods.startDate = ''
        }
        this.sendGoods.searchStatus = val.status
        this.sendGoods.gatherSelcondition = val.registrar
        this.sendGoodsList()
      },
      getSelectResult(arr) {
        this.getSelectResultArr = arr
      },
      /**
       * 获取全部订单列表
       * */
      sendGoodsList() {
        let jsonStr = JSON.parse(JSON.stringify(this.sendGoods))
        jsonStr.pageSize -= 1
        jsonStr = JSON.stringify(jsonStr)
        req.post('api/import/logistics/sendorder/list', { jsonStr }).then((res) => {
          this.orderListData = res.data.list
          res.data.list.forEach((v) => {
            v.fcDate = api.getTime(v.fcDate)
          })
          this.pageTotal = res.data.total
        }).catch((error) => {
          console.log(error)
        })
      },
      check() {
        let id, status
        id = this.getSelectResultArr[0].id
        status = this.getSelectResultArr[0].status
        this.$router.push({
          path: '/import/sendGoods/sendGoodsDetail',
          query: { id: id, status: status }
        })
      },
      deleteHandle(index) {
        // 删除操作
        this.$confirm('此操作将删除选中项目,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.getSelectResultArr[0].status !== '保存') {
            this.$notify({
              title: '警告',
              message: '该订单不能删除',
              type: 'warning'
            })
            return
          }
          // 获取ids
          let id
          this.orderListData.splice(index, 1)
          id = this.getSelectResultArr[0].id
          // 发送请求
          req.get('api/import/logistics/sendorder/delete', {
            params: {
              id: id
            }
          }).then((res) => {
            console.log(res)
            this.$notify({
              title: '删除成功',
              type: 'success',
              message: res.msg
            })
            // 刷新页面
            this.sendGoodsList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      /**
       * 当前页改变事件
       * */
      handleCurrentChange(val) {
        this.sendGoods.pageSize = val
        this.sendGoodsList()
      }
    }
  }
</script>

<style scoped lang="scss">
  .content{
    width: 100%;
    height: 100%;;
  }
</style>
<style lang="scss">
  .inputNumber{
    width: 127px;
    height: 28px;
    .el-input__inner{
      height: 28px;
      border-radius: 0;
      font-size: 12px;
      padding: 0 27px;
    }
    .el-input-number__increase,.el-input-number__decrease{
      box-sizing: border-box;
      width: 27px;
      height: 26px;
      color: #858585;
      background: #fff;
    }
  }
</style>
