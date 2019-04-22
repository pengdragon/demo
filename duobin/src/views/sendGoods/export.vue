<template>
  <el-row>
    <div class="container-wrapper">
      <b2bSearch @searchEvent="searchEvent">
        <div slot="button" style="margin-bottom: 22px">
          <el-button size="small " type="primary"
                     @click="$router.push('/export/newSendGoods')">
            派货申请
          </el-button>
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
        <div slot="moreSearch">
          <!--<el-select v-model="searchOptions.status" placeholder="请选择订单状态">-->
          <!--<el-option label="已完成" value="已完成"></el-option>-->
          <!--<el-option label="未完成" value="未完成"></el-option>-->
          <!--</el-select>-->
        </div>
        <div slot="table">
          <tabTmp :tabData="orderListData"
                  :showSelection="true"
                  :tabHeight="'500px'"
                  :openDbClick="true"
                  @dbClickCell="dbClickCell"
                  @getSelectResult="getSelectResult"
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
  </el-row>
</template>

<script>
  import b2bSearch from '@/components/b2bSearch/index'
  import tabTmp from '@/components/tabTemplate'

  export default {
    data() {
      return {
        pageTotal: 1, // 分页总数
        searchOptions: { // 搜索项
          pageCount: 10,
          pageSize: 1,
          gatherSelcondition: '',
          startDate: '',
          endDate: '',
          status: ''
        },
        orderListData: [], // 列表数据
        tabTagData: [ // 表头数据
          {
            label: '订单号',
            prop: 'fusenOrder',
            width: ''
          },
          {
            label: '派货单号',
            prop: 'sendNo',
            width: ''
          },
          {
            label: '物流公司',
            prop: 'logisticsCompany',
            width: ''
          },
          {
            label: '预计派货时间',
            prop: 'fcDate',
            width: ''
          },
          {
            label: '送达公司',
            prop: 'sendCompany',
            width: '300px'
          },
          {
            label: '出货方式',
            prop: 'shipmentType',
            width: ''
          },
          {
            label: '状态',
            prop: 'status',
            width: ''
          },
          {
            label: '备注',
            prop: 'remarks',
            width: ''
          }
        ],
        getSelectResultArr: [] // 选中的列表项
      }
    },
    activated() {
      // 获取页面数据
      this.getPageData()
    },
    components: {
      b2bSearch,
      tabTmp
    },
    computed: {
      DetailBtnState() {
        return !(this.getSelectResultArr.length === 1)
      }
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
            this.getPageData()
          }).catch((err) => {
            console.log(err)
          })
        }).catch(() => {
        })
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
       * 获取选中项
       * */
      getSelectResult(arr) {
        this.getSelectResultArr = arr
      },
      /**
       * 获取派货单列表
       * */
      getPageData() {
        let json = JSON.parse(JSON.stringify(this.searchOptions))
        json.pageSize -= 1
        this.$axios.post('/api/export/logistics/sendgoods/list', json).then((res) => {
          // 列表数据赋值
          this.orderListData = res.data.list
          // 总数赋值
          this.pageTotal = res.data.total
        }).catch((error) => {
          console.log(error)
        })
      },
      dbClickCell(row) {
        this.$router.push({
          path: '/export/sendGoodsDetail',
          query: { id: row.id }
        })
      },
      /**
       * 查看订单详情
       * */
      check() {
        let id = this.getSelectResultArr[0].id
        this.$router.push({
          path: '/export/sendGoodsDetail',
          query: { id: id }
        })
      },
      /**
       * 删除订单
       * */
      deleteItem() {
        let id = this.getSelectResultArr[0].id
        this.$axios.post('/api/export/logistics/sendgoodsobject/delete', { id }).then((res) => {
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
       * 分页组件页面变化
       * */
      handleCurrentChange(val) {
        this.searchOptions.pageSize = val
        this.getPageData()
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
    /*min-height: 794px;*/
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
