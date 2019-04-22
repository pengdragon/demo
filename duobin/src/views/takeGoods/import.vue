<template>
  <mSearchLayout @searchEvent="searchEvent"
                 :statusList="statusList"
                 :placeholder="'请输入订单号/提货单号'">
    <div slot="button">
      <el-button size="small"
                 type="primary"
                 @click="$router.push('/import/takeGoods/newTakeGoods')">
        新增提货申请
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
    <div slot="table" v-loading="loadState">
      <tabTmp :tabData="tableData"
              :openDbClick="true"
              @dbClickCell="dbClickCell"
              :showSelection="true"
              :tabHeight="'485px'"
              :border="false"
              @getSelectResult="getSelectResult"
              :tabTagData="tabTagData">
      </tabTmp>
    </div>
    <div slot="page"
         v-if="pageTotal">
      <el-pagination
        @current-change="takeGoodsCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
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
  export default {
    data() {
      return {
        pageTotal: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        tabTagData: [
          {
            label: '富森订单号',
            prop: 'fsno',
            width: '120px'
          },
          {
            label: '提货单号',
            prop: 'docno',
            width: '120px'
          },
          {
            label: '状态',
            prop: 'status',
            width: '120px'
          },
          {
            label: '提货单创建日期',
            prop: 'docdate',
            width: '140px'
          },
          {
            label: '预计提货时间',
            prop: 'yjthtime',
            width: '160px'
          },
          {
            label: '供应商',
            prop: 'deliverycompany',
            width: ''
          },
          {
            label: '板数/箱数',
            prop: 'sumcartons',
            width: '120px'
          }
        ],
        getSelectResultArr: [],
        pageData: {
          'sessionId': Cookies.get('sessionid'),
          'pageSize': 10,
          'pageIndex': 1,
          'totalPage': '',
          'docno': '',
          'date1': '',
          'date2': ''
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
          if (this.getSelectResultArr[0].statusValue !== '1') {
            this.$notify({
              title: '警告',
              message: '该订单不能退回',
              type: 'warning'
            })
            return
          }
          let params = {
            busiCode: 2,
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
            this.getPage()
          }).catch((err) => {
            console.log(err)
          })
        }).catch(() => {
        })
      },
      dbClickCell(row) {
        this.$router.push({
          path: '/import/takeGoods/takeGoodsDetail',
          query: { id: row.id, thno: row.docno, status: row.status }
        })
      },
      searchEvent(val) {
        if (val.date) {
          this.pageData.date1 = val.date[0]
          this.pageData.date2 = val.date[1]
        } else {
          this.pageData.date1 = ''
          this.pageData.date1 = ''
        }
        this.pageData.docno = val.registrar
        this.pageData.searchStatus = val.status
        this.getPage()
      },
      takeGoodsCurrentChange(val) {
        this.pageData.pageIndex = val - 1
        this.getPage()
      },
      lookFor() {
        let id = this.getSelectResultArr[0].id
        let thno = this.getSelectResultArr[0].docno
        let status = this.getSelectResultArr[0].status
        this.$router.push({
          path: '/import/takeGoods/takeGoodsDetail',
          query: { id: id, thno: thno, status: status }
        })
      },
      getPage() {
        this.pageData.pageIndex = this.currentPage
        this.loadState = true
        req.post('api/import/logistics/queryTiHuoDanList', this.pageData).then((res) => {
          this.loadState = false
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
          let id = this.getSelectResultArr[0].id
          this.tableData.splice(index, 1)
          // 发送请求
          req.post('api/import/logistics/deleteTiHuoDan', {
            sessionId: Cookies.get('sessionid'),
            shpc002oid: id
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
    },
    computed: {
      currentState() {
        return !(this.getSelectResultArr.length === 1)
      }
    }
  }
</script>

<style scoped lang="scss">
  .content{
    width: 100%;
    height: 100%;
  }
</style>
