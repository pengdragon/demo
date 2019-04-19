<template>
  <div>
    <div class="container-wrapper">
      <b2bSearch @searchEvent="searchEvent">
        <div slot="button" style="margin-bottom: 22px">
          <el-button size="small" type="primary" @click="$router.push('/export/newPad')">新增垫资付款</el-button>
          <el-button size="small" type="primary"
                     :disabled="DetailBtnState"
                     @click="check">编辑
          </el-button>
          <el-button size="small" type="danger"
                     @click="sendBack"
                     :disabled="DetailBtnState">退回
          </el-button>
          <el-button size="small" type="danger"
                     :disabled="DetailBtnState"
                     @click="deleteItem">删除
          </el-button>
        </div>
        <div slot="table">
          <tabTmp :tabData="orderListData"
                  :showSelection="true"
                  :tabHeight="'500px'"
                  :openDbClick="true"
                  @dbClickCell="dbClickCell"
                  @getSelectResult="getSelectResult"
                  v-loading="loadingTabState"
                  :tabTagData="tabTagData">
          </tabTmp>
          <div class="clearFloat" v-if="pageTotal">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="searchOptions.pageSize"
              :page-size="searchOptions.pageCount"
              layout="prev, pager, next, jumper"
              background
              class="paginationContent"
              :total="pageTotal">
            </el-pagination>
          </div>
        </div>
      </b2bSearch>
    </div>
  </div>
</template>

<script>
  import b2bSearch from '@/components/b2bSearch/index'
  import tabTmp from '@/components/tabTemplate'

  export default {
    data() {
      return {
        orderListData: [ // 列表数据
          // {
          //   id: '1',
          //   orderNumber: '', // 订单号
          //   predictGatheringTime: '', //预计收款时间
          //   gatheringCompany: '', // 收款公司
          //   paymentAmount: '', // 收款金额
          //   gatheringBank: '', // 收款银行
          //   createTime: '', // 收款时间
          //   status: '', // 状态
          //   remarks: '' // 备注
          // }
        ],
        tabTagData: [ // 表头数据
          {
            label: '内部项目号',
            prop: 'orderNumber',
            width: ''
          },
          {
            label: '付款单号',
            prop: 'paymentNumber',
            width: ''
          },
          {
            label: '收款公司',
            prop: 'gatheringCompany',
            width: ''
          },
          {
            label: '付款金额(原币)',
            prop: 'paymentAmount',
            width: ''
          },
          {
            label: '币别',
            prop: 'currency',
            width: ''
          },
          {
            label: '创建时间',
            prop: 'createTime',
            width: ''
          },
          {
            label: '状态',
            prop: 'status',
            width: ''
          }
        ],
        getSelectResultArr: [], // 选中的列表项
        pageTotal: 0, // 分页总数
        searchOptions: { // 搜索选项
          pageSize: 1,
          pageCount: 10,
          gatherSelcondition: '',
          startDate: '',
          endDate: '',
          status: ''
        },
        loadingTabState: false // 列表加载状态
      }
    },
    computed: {
      DetailBtnState() {
        return !(this.getSelectResultArr.length === 1)
      }
    },
    components: {
      b2bSearch,
      tabTmp
    },
    activated() {
      // 获取页面数据
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
            busiCode: 5,
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
       * 删除订单
       * */
      deleteItem() {
        let id = this.getSelectResultArr[0].id
        this.$axios.post('api/export/finance/matcapitalpaymentobject/delete', { id }).then((res) => {
          // 提示
          this.$notify({
            type: 'success',
            title: '成功',
            message: '删除成功'
          })
          // 重新拉取数据
          this.getPageData()
        }).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 查看订单详情
       * */
      check() {
        let id = this.getSelectResultArr[0].id
        this.$router.push({
          path: '/export/padPayDetail',
          query: { id: id }
        })
      },
      /**
       * 双击跳转
       * */
      dbClickCell(row) {
        this.$router.push({
          path: '/export/padPayDetail',
          query: { id: row.id }
        })
      },
      /**
       * 获取选中项
       * */
      getSelectResult(arr) {
        this.getSelectResultArr = arr
      },
      /**
       * 分页组件改变当前页
       * */
      handleCurrentChange(val) {
        this.searchOptions.pageSize = val
        this.getPageData()
      },
      /**
       * 搜索事件
       * */
      searchEvent(val) {
        if (val.date) {
          this.searchOptions.startDate = val.date[0]
          this.searchOptions.endDate = val.date[1]
        } else {
          this.searchOptions.startDate = ''
          this.searchOptions.endDate = ''
        }
        this.searchOptions.gatherSelcondition = val.registrar
        this.getPageData()
      },
      /**
       * 获取页面数据
       * */
      getPageData() {
        this.loadingTabState = true
        let json = JSON.parse(JSON.stringify(this.searchOptions))
        json.pageSize -= 1
        this.$axios.post('api/export/finance/payment/list', json).then((res) => {
          // 获取页面数据
          this.orderListData = res.data.list
          // 获取分页总数
          this.pageTotal = res.data.total
          this.loadingTabState = false
        }).catch((err) => {
          this.loadingTabState = false
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .container-wrapper {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 15px 15px 0 20px;
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
