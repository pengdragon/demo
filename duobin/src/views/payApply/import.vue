<template>
  <mSearchLayout @searchEvent="searchEvent"
                 :statusList="statusList"
                 :placeholder="'请输入订单号/提货单号'">
    <div slot="button">
      <el-button size="small"
                 type="primary"
                 @click="newOrder">
        新增付款申请
      </el-button>
      <el-button size="small"
                 @click="lookFor"
                 :disabled="currentState">编辑</el-button>
      <el-button size="small"
                 :disabled="currentState"
                 @click="deleteHandle">删除</el-button>
      <el-button size="small"
                 @click="sendBack"
                 :disabled="currentState">退回</el-button>
    </div>
    <div slot="table">
      <tabTmp :tabData="tableData"
              v-loading="loadState"
              :openDbClick="true"
              @dbClickCell="dbClickCell"
              :showSelection="true"
              tabHeight="485px"
              :border="false"
              @getSelectResult="getSelectResult"
              :tabTagData="tagData">
      </tabTmp>
    </div>
    <div slot="page"
         v-if="pageTotal">
      <el-pagination
        @current-change="takeGoodsCurrentChange"
        :current-page.sync="pageData.pageIndex"
        :page-size="pageData.pageSize"
        layout="total,prev, pager, next, jumper"
        background
        :total="pageTotal">
      </el-pagination>
    </div>
  </mSearchLayout>
</template>

<script>
  import mSearchLayout from '@/components/mSearchLayout'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  import api from '@/utils/apiUtil'
  import Cookies from 'js-cookie'
  import _ from 'lodash'
  export default {
    data() {
      return {
        tagData: [
          {
            label: '付款单号',
            prop: 'bankserialno',
            width: '120px'
          },
          {
            label: '富森订单号',
            prop: 'orderids',
            width: ''
          },
          {
            label: '收款公司',
            prop: 'u_033',
            width: '240px'
          },
          {
            label: '付款金额',
            prop: 'foreignmoney',
            width: '140px'
          },
          {
            label: '币别',
            prop: 'currencytype',
            width: '140px'
          },
          {
            label: '付款单提交时间',
            prop: 'sys_created',
            width: ''
          },
          {
            label: '状态',
            prop: 'recstatus2',
            width: ''
          }
        ],
        pageTotal: 0,
        tableData: [],
        getSelectResultArr: [],
        pageData: {
          'sessionId': Cookies.get('sessionid'),
          'pageSize': 10,
          'pageIndex': 1,
          'orderId': '',
          tradedate1: '',
          tradedate2: ''
        },
        loadState: false,
        statusList: [
          { label: '全部', value: '' },
          { label: '暂存', value: '0' },
          { label: '审核中', value: '1' },
          { label: '已审核', value: '2' }
        ]
      }
    },
    computed: {
      currentState() {
        return !(this.getSelectResultArr.length === 1)
      }
    },
    activated() {
      this.getPage()
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
          if (this.getSelectResultArr[0].recstatus !== '1') {
            this.$notify({
              title: '警告',
              message: '该订单不能退回',
              type: 'warning'
            })
            return
          }
          let params = {
            busiCode: 4,
            id: this.getSelectResultArr[0].caccountoid
          }
          this.$axios.get('/api/import/order/sendback', {
            params
          }).then((res) => {
            this.$notify({
              title: '成功',
              message: '退回成功',
              type: 'success'
            })
            this.getPage()
          }).catch((err) => {
            console.log(err)
          })
        }).catch(() => {
        })
      },
      /**
       * 新增订单
       * */
      newOrder() {
        this.$router.push({
          path: '/import/payApply/newPayApply'
        })
      },
      dbClickCell(row) {
        this.$router.push({
          path: '/import/payApply/payApplyDetail',
          query: { caccountoid: row.caccountoid, status: row.recstatus }
        })
      },
      searchEvent(val) {
        if (val.date) {
          this.pageData.tradedate1 = val.date[0]
          this.pageData.tradedate2 = val.date[1]
        } else {
          this.pageData.tradedate1 = ''
          this.pageData.tradedate2 = ''
        }
        this.pageData.searchStatus = val.status
        this.pageData.orderId = val.registrar
        this.getPage()
      },
      takeGoodsCurrentChange(val) {
        this.getPage()
      },
      lookFor() {
        let caccountoid = this.getSelectResultArr[0].caccountoid
        this.$router.push({
          path: '/import/payApply/payApplyDetail',
          query: { caccountoid }
        })
      },
      getPage() {
        this.loadState = true
        let json = _.clone(this.pageData)
        json.pageIndex -= 1
        req.post('import/finance/getCAccountList', json).then((res) => {
          this.loadState = false
          if (!res.data) { return }
          this.tableData = res.data.content
          this.pageTotal = parseInt(res.data.total)
          res.data.content.forEach((v) => {
            if (v.remark && v.remark.length >= 11) {
              let str = v.remark
              let strLen = str.substring(0, 11)
              v.remark = str.replace(str, strLen + '...')
            }
            v.docdate = api.getDate(v.docdate)
          })
        }).catch((error) => {
          this.loadState = false
          console.log(error)
        })
      },
      getSelectResult(arr) {
        this.getSelectResultArr = arr
      },
      deleteHandle(index) {
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
          let id = this.getSelectResultArr[0].caccountoid
          this.tableData.splice(index, 1)
          // 发送请求
          req.post('/import/finance/delCAccountSub', {
            sessionId: Cookies.get('sessionid'),
            caccountsuboid: id
          }).then((res) => {
            this.$notify({
              title: '成功',
              type: 'success',
              message: res.result
            })
            // 刷新页面
            this.getPage()
          }).catch((error) => {
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    components: {
      mSearchLayout,
      tabTmp
    }
  }
</script>

<style scoped>
  .container-wrapper{
    box-sizing: border-box;
    padding: 10px 22px 0;
  }
</style>
