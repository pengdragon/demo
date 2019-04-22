<template>
  <el-row>
    <div v-show="$route.path==='/import/logistics/takeGoods' || $route.path==='/export/logistics/takeGoods'" class="container-wrapper">
      <b2bSearch @searchEvent="searchEvent">
        <div slot="button" style="margin-bottom: 22px">
          <el-button size="small " type="primary" @click="$router.push('/import/logistics/takeGoods/newTakeGoods')">新增</el-button>
          <el-button size="small"
                     type="primary"
                     @click="lookFor" :disabled="currentState">查看</el-button>
          <el-button size="small" type="danger" :disabled="currentState" @click="deleteHandle">删除</el-button>
        </div>
        <div slot="moreSearch">
        </div>
        <div slot="table">
          <tabTmp :tabData="tableData"
                  @cell-dblclick="dbClickCell"
                  :showSelection="true"
                  :tabHeight="'620px'"
                  @getSelectResult="getSelectResult"
                  :tabTagData="tabTagData">
          </tabTmp>
          <div class="clearFloat" v-if="pageTotal">
            <el-pagination
              @current-change="takeGoodsCurrentChange"
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
  import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        pageTotal: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [
          {
            rownum: 1,
            id: '',
            fsno: '987658',
            docno: '987446',
            docdate: '2018-02-15',
            yjthtime: '2018-03-15 9:00',
            deliverycompany: '深圳市顺丰科技股份有限公司',
            sumcartons: '335 箱',
            sumboard: '',
            status: '待提货',
            remark: ''
          }
        ],
        tabTagData: [
          {
            label: '富森订单号',
            prop: 'fsno',
            width: ''
          },
          {
            label: '提货单号',
            prop: 'docno',
            width: ''
          },
          {
            label: '提货单创建日期',
            prop: 'docdate',
            width: ''
          },
          {
            label: '预计提货时间',
            prop: 'yjthtime',
            width: ''
          },
          {
            label: '提货公司',
            prop: 'deliverycompany',
            width: '260px'
          },
          {
            label: '板数/箱数',
            prop: 'sumcartons',
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
        currentRow: null,
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
        sessionIds: '',
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
        value7: '',
        radio: '1',
        showUploadSuccess: true,
        hiddenState: false,
        gatherSelcondition: 'FA170708644',
        getSelectResultArr: [],
        pageData: {
          'sessionId': Cookies.get('sessionid'),
          'pageSize': 10,
          'pageIndex': 1,
          'totalPage': '',
          'docno': '',
          'date1': '',
          'date2': ''
        }
      }
    },
    created() {
      this.getPage()
      // req.get('api/import/logistics/getTestSessionId?custid=1249094f-b10c-4c05-be56-3ba246575cb0').then((res) => {
      //   console.log(res)
      //   this.sessionIds = res.data
      // }).catch((error) => {
      //   console.log(error)
      // })
    },
    methods: {
      dbClickCell(row) {
        console.log(row)
        // this.$router.push({
        //   path: '/import/logistics/takeGoods/takeGoodsDetail',
        //   query: { id: row.id, thno: row.thno }
        // })
      },
      searchEvent(val) {
        console.log(val)
        if (val.date) {
          this.pageData.date1 = val.date[0]
          this.pageData.date2 = val.date[1]
        } else {
          this.pageData.date1 = ''
          this.pageData.date1 = ''
        }
        this.pageData.docno = val.registrar
        this.getPage()
      },
      takeGoodsCurrentChange(val) {
        this.pageData.pageIndex = val - 1
        this.getPage()
      },
      lookFor() {
        let id = this.getSelectResultArr[0].id
        let thno = this.getSelectResultArr[0].docno
        this.$router.push({
          path: '/import/logistics/takeGoods/takeGoodsDetail',
          query: { id: id, thno: thno }
        })
      },
      getPage() {
        // console.log(this.pageData)
        this.pageData.pageIndex = this.currentPage
        req.post('api/import/logistics/queryTiHuoDanList', this.pageData).then((res) => {
          this.tableData = res.data.content
          this.pageTotal = parseInt(res.data.totalPage)
          // console.log(res)
        }).catch((error) => {
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
          // 获取ids
          let id = this.getSelectResultArr[0].id
          this.tableData.splice(index, 1)
          // 发送请求
          // todo 删除地址
          req.post('api/import/logistics/deleteTiHuoDan', {
            sessionId: Cookies.get('sessionid'),
            shpc002oid: id
          }).then((res) => {
            this.$notify({
              title: '成功',
              type: 'success',
              message: res.msg
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
      },
      handleCurrentChange(val) {
        this.currentRow = val
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
    computed: {
      currentState() {
        // console.log(this.getSelectResultArr)
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
