<template>
  <el-row>
    <div v-show="$route.path==='/import/logistics/sendGoods' || $route.path==='/export/logistics/sendGoods'" class="container-wrapper">
      <b2bSearch @searchEvent="searchEvent">
        <div slot="button" style="margin-bottom: 22px">
          <el-button size="small " type="primary" @click="$router.push('/import/logistics/sendGoods/newSendGoods')">新增</el-button>
          <el-button size="small" type="primary" :disabled="DetailBtnState" @click="check">查看</el-button>
          <el-button size="small" type="danger" :disabled="DetailBtnState" @click="deleteHandle">删除</el-button>
        </div>
        <div slot="moreSearch">
        </div>
        <div slot="table">
          <tabTmp :tabData="orderListData"
                  :showSelection="true"
                  :tabHeight="'620px'"
                  @getSelectResult="getSelectResult"
                  :tabTagData="tabTagData">
          </tabTmp>
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
      </b2bSearch>
    </div>
    <router-view></router-view>
  </el-row>
</template>

<script>
  import b2bSearch from '@/components/b2bSearch/index'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  import api from '@/utils/apiUtil'
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        currentRow: 1,
        showOrderDetail: false,
        orderDtailData: [
          {
            productName: '',
            model: '',
            brand: '',
            unit: '',
            amount: '',
            recQty: '',
            declareQty: '',
            deliveryQty: '',
            origin: ''
          }
        ],
        pickerOptions2: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        },
        pageTotal: 0,
        currentPage: 1,
        pageSize: 10,
        todoList: [],
        value7: '',
        radio: '1',
        showUploadSuccess: true,
        hiddenState: false,
        gatherSelcondition: 'FA170708644',
        orderListData: [
          {
            fusenOrder: '',
            sendNo: '',
            logisticsCompany: '',
            createDate: '',
            sendCompany: '',
            shipmentType: '',
            status: this.statusData,
            remark: ''
          }
        ],
        tabTagData: [ // 表头数据
          {
            label: '富森订单号',
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
            prop: 'createDate',
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
            prop: 'remark',
            width: ''
          }
        ],
        statusData: '待派货',
        getSelectResultArr: [],
        queryCondition: {
          'date': '',
          'registrar': ''
        },
        sendGoods: {
          'pageSize': '0',
          'pageCount': 10,
          'customId': '0009D375-0000-0000-0000-00004B1DC096',
          'startDate': '',
          'endDate': '',
          'gatherSelcondition': ''
        }
      }
    },
    methods: {
      searchEvent(val) {
        if (val.date) {
          this.sendGoods.startDate = val.date[0]
          this.sendGoods.startDate = val.date[1]
        } else {
          this.sendGoods.startDate = ''
          this.sendGoods.startDate = ''
        }
        // this.queryCondition = val
        this.sendGoods.gatherSelcondition = val.registrar
        this.sendGoodsList()
        // console.log(this.queryCondition.registrar)
      },
      getSelectResult(arr) {
        this.getSelectResultArr = arr
      },
      // 获取派货列表
      sendGoodsList() {
        let jsonStr = JSON.stringify(this.sendGoods)
        console.log(jsonStr)
        req.post('api/import/logistics/sendorder/list', { jsonStr }).then((res) => {
          // console.log(res)
          this.orderListData = res.data.list
          this.orderListData.forEach((order) => {
            order.createDate = api.getTime(order.planSendGoodDate)
          })
          this.pageTotal = res.data.total
          // this.sendGoods.pageSize = this.currentRow
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].status === '3') {
              this.orderListData[i].status = '待派货'
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      check() {
        let id = this.getSelectResultArr[0].id
        this.$router.push({
          path: '/import/logistics/sendGoods/sendGoodsDetail',
          query: { id: id }
        })
      },
      deleteHandle(index) {
        // 删除操作
        this.$confirm('此操作将删除选中项目,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 获取ids
          this.orderListData.splice(index, 1)
          let id = this.getSelectResultArr[0].id
          // 发送请求
          // todo 删除地址
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
      handleCurrentChange(val) {
        this.sendGoods.pageSize = val - 1
        this.sendGoodsList()
      },
      showSuccess() {
        console.log('成功')
        this.showUploadSuccess = !this.showUploadSuccess
      },
      hiddenHandle() {
        this.hiddenState = true
      },
      parseDate(time) {
        if (!time) { return }
        let res = time.split('.')[0].replace(/t/ig, ' ')
        return res
      }
    },
    components: {
      b2bSearch,
      tabTmp
    },
    created() {
      this.sendGoodsList()
    },
    computed: {
      DetailBtnState() {
        return !(this.getSelectResultArr.length === 1)
      }
    }
  }
</script>

<style scoped lang="scss">
  .container-wrapper{
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 15px 20px 0px 20px;
    /*min-height: 794px;*/
    .clearFloat{
      height: 72px;
      .paginationContent {
        float: right;
        margin: 20px 10px 20px 0;
      }
    }
    .form-content{
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 0;
      .pickerTag{
        vertical-align: top;
      }
      .orderInput{
        display: inline-block;
        width: 360px;
      }
      .searchButton{
        display: inline-block;
      }
      .moreButton{
        display: inline-block;
      }
    }
    .highText{
      color: #02B7DF;
      cursor: pointer;
      .hidden{
        display: none;
      }
    }
    .tableContent{
    }
  }
</style>

<style lang="scss">
  .tableContent{
  /*table中标题样式*/
  .tabHead{
  th{
    background-color: #ECECEC;
  }
  }
  /*table中备注样式*/
  .remark-wrapper{
    padding: 0 !important;
  .cell{
    padding: 0;
  textarea[data-textreaStyle]{
    height: 100% !important;
    border: none;
  }
  }
  }
  }
</style>
