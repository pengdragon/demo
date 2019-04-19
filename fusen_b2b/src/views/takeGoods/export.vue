<template>
  <el-row>
    <div class="container-wrapper">
      <b2bSearch @searchEvent="searchEvent">
        <div slot="button" style="margin-bottom: 22px">
          <el-button size="small "
                     type="primary"
                     @click="$router.push('/export/newTakeGoods')">新增提货</el-button>
          <el-button size="small"
                     type="primary"
                     @click="lookFor"
                     :disabled="currentState">查看</el-button>
          <el-button size="small"
                     type="danger"
                     @click="sendBack"
                     :disabled="currentState">退回</el-button>
          <el-button size="small"
                     type="danger"
                     :disabled="deleteState"
                     @click="deleteHandle">删除</el-button>
        </div>
        <div slot="moreSearch">
          <!--<el-select v-model="pageData.searchStatus" placeholder="请选择订单状态">-->
            <!--<el-option label="已完成" value="已完成"></el-option>-->
            <!--<el-option label="未完成" value="未完成"></el-option>-->
          <!--</el-select>-->
        </div>

        <div slot="table">
          <tabTmp :tabData="tableData"
                  @dbClickCell="dbClickCell"
                  :openDbClick="true"
                  :showSelection="true"
                  :tabHeight="'620px'"
                  @getSelectResult="getSelectResult"
                  :tabTagData="tabTagData">
          </tabTmp>
          <div class="clearFloat" v-if="pageTotal">
            <el-pagination
              @current-change="takeGoodsCurrentChange"
              :current-page.sync="pageData.pageSize"
              :page-size="pageData.pageCount"
              layout="prev, pager, next, jumper"
              background
              class="paginationContent"
              :total="pageTotal">
            </el-pagination>
          </div>
        </div>
      </b2bSearch>
    </div>
  </el-row>
</template>

<script>
  import b2bSearch from '@/components/b2bSearch/index'
  import tabTmp from '@/components/tabTemplate'
  export default {
    data() {
      return {
        pageTotal: 0, // 总页数
        tableData: [],
        tabTagData: [
          {
            label: '提货单号',
            prop: 'pickGoodsNumber',
            width: ''
          },
          {
            label: '订单号',
            prop: 'orderNumber',
            width: ''
          },
          {
            label: '提货单创建日期',
            prop: 'createDate',
            width: ''
          },
          {
            label: '预计提货时间',
            prop: 'predictPickGoodsTime',
            width: ''
          },
          {
            label: '提货公司',
            prop: 'pickGoodsCompany',
            width: ''
          },
          {
            label: '板数',
            prop: 'sumBoard',
            width: ''
          },
          {
            label: '箱数',
            prop: 'sumCartons',
            width: ''
          },
          {
            label: '状态',
            prop: 'status',
            width: ''
          },
          {
            label: '备注',
            prop: 'remark',
            width: ''
          }
        ],
        getSelectResultArr: [],
        pageData: {
          pageSize: 1,
          pageCount: 10,
          gatherSelcondition: '',
          startDate: '',
          endDate: '',
          status: '' // 搜索状态
        }
      }
    },
    activated() {
      this.getPageData()
    },
    methods: {
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
          const params = {
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
            this.getPageData()
          }).catch((err) => {
            console.log(err)
          })
        }).catch(() => {
        })
      },
      /**
       * 双击跳转详情
       * */
      dbClickCell(row) {
        this.$router.push({
          path: '/export/takeGoodsDetail',
          query: { id: row.id, pickingType: row.pickingType }
        })
      },
      /**
       * 查询事件
       * */
      searchEvent(val) {
        if (val.date) {
          this.pageData.startDate = val.date[0]
          this.pageData.endDate = val.date[1]
        } else if (val.date === null) {
          this.pageData.startDate = ''
          this.pageData.endDate = ''
        }
        this.pageData.gatherSelcondition = val.registrar
        this.getPageData()
      },
      /**
       * 分页组件页面切换事件
       * */
      takeGoodsCurrentChange(val) {
        this.pageData.pageSize = val
        this.getPageData()
      },
      /**
       * 查看订单详情
       * */
      lookFor() {
        let id = this.getSelectResultArr[0].id
        let pickingtype = this.getSelectResultArr[0].pickingType
        this.$router.push({
          path: '/export/takeGoodsDetail',
          query: { id, pickingtype }
        })
      },
      /**
       * 获取页面数据
       * */
      getPageData() {
        let jsonData = JSON.parse(JSON.stringify(this.pageData))
        jsonData.pageSize -= 1
        this.$axios.post('/api/export/logistics/pickingorder/list', jsonData).then((res) => {
          if (Array.isArray(res.data.list)) {
            this.tableData = res.data.list
          }
          this.pageTotal = parseInt(res.data.total)
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 列表中选中项数组
       * */
      getSelectResult(arr) {
        this.getSelectResultArr = arr
      },
      /**
       * 列表删除操作
       * */
      deleteHandle(index) {
        this.$confirm('此操作将删除选中项目,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 获取ids
          let id = this.getSelectResultArr[0].id
          let type = this.getSelectResultArr[0].pickingType
          // 发送请求
          this.$axios.post('/api/export/logistics/pickingorder/delete', {
            id,
            type
          }).then((res) => {
            this.$notify({
              title: '成功',
              type: 'success',
              message: res.msg
            })
            // 刷新页面
            this.getPageData()
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
      b2bSearch,
      tabTmp
    },
    computed: {
      currentState() {
        return !(this.getSelectResultArr.length === 1)
      },
      deleteState() {
        return !(this.getSelectResultArr.length === 1)
      }
    }
  }
</script>

<style scoped lang="scss">
  .container-wrapper {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 15px 20px 0px 20px;
    .clearFloat {
      height: 72px;
      .paginationContent {
        float: right;
        margin: 20px 10px 20px 0;
      }
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
