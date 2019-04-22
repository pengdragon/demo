<template>
  <el-row>
    <div v-show="$route.path==='/fictitious/orderTrack/workTrack'" class="content-wrapper">
      <search @searchEvent="searchEvent" :inputPlaceholder="'请输入富森项目号/内部项目号/国内采购单号'">
        <div slot="button" style="margin-bottom: 22px">
          <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
        </div>
      </search>
      <div v-loading="loadState">
        <el-table height="450"
                  :data="tabData" border style="width: 100%"
                  @selection-change="getSelectResult" id="rebateSetTable">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column label="富森项目号" align="center" width="120" prop="fsOrderNo"></el-table-column>
          <el-table-column label="内部项目号" align="center" width="120" prop="customerNo"></el-table-column>
          <el-table-column label="国内采购单号" align="center" width="120" prop="fsPurchaseOrderNo"></el-table-column>
          <el-table-column label="订单状态" align="center" width="80" prop="orderStatus"></el-table-column>
          <el-table-column label="订单日期" align="center" width="200" prop="orderDate"></el-table-column>
          <el-table-column label="供应商" align="center" width="120" prop="vendorName"></el-table-column>
          <el-table-column label="客户物料" align="center" width="240" prop="custPartNo"> </el-table-column>
          <el-table-column label="品名" align="center" width="120" prop="partName"></el-table-column>
          <el-table-column label="规格型号" align="center" width="240" prop="spec"></el-table-column>
          <el-table-column label="单价" align="center" width="120" prop="price"></el-table-column>
          <el-table-column label="数量" align="center" width="120" prop="quantity"></el-table-column>
          <el-table-column label="金额" align="center" width="120" prop="amount"></el-table-column>
          <el-table-column label="发票号码" align="center" width="120" prop="invoiceNumber"></el-table-column>
          <el-table-column label="开票数量" align="center" width="120" prop="openTicketNum"></el-table-column>
          <el-table-column label="已收发票金额" align="center" width="120" prop="recInvoiceAmount"></el-table-column>
          <el-table-column label="税率" align="center" width="120" prop="rate"></el-table-column>
          <el-table-column label="未收发票金额" align="center" width="120" prop="noRecInvoiceAmount"></el-table-column>
          <el-table-column label="PO号" align="center" width="120" prop="poNo"></el-table-column>
          <el-table-column label="项目平台" align="center" width="120" prop="projectPlatform"></el-table-column>
        </el-table>
      </div>
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
    <router-view></router-view>
  </el-row>
</template>

<script>
  import tabTmp from '@/components/tabTemplate'
  import search from '@/components/fictitiousSearch'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    data() {
      return {
        storager: true,
        sendBack: true,
        tabData: [
        ],
        requestDara: {
          pageSize: 1,
          pageCount: 10,
          startDate: '',
          endDate: '',
          orderStatus: '',
          gatherSelcondition: ''
        },
        loadState: false,
        pageTotal: 0,
        currentPage: 1,
        pageSize: 10
      }
    },
    components: {
      search,
      tabTmp
    },
    created() {
      this.getOrderList()
    },
    watch: {
      $route(to, from) {
        this.activeRouter = to.fullPath
      }
    },
    methods: {
      getOrderList() {
        this.loadState = true
        let jsonStr = this.requestDara
        // console.log(jsonStr)
        // console.log(typeof jsonStr)
        this.$axios.post('api/virtual/domesticProcure/domPurchaseReceiptList', jsonStr).then((res) => {
          this.tabData = res.data.list
          res.data.list.forEach((item, index, arr) => {
            if (arr[index].orderStatus === '0') {
              arr[index].orderStatus = '暂存'
            } else if (arr[index].orderStatus === '1') {
              arr[index].orderStatus = '审核中'
            } else if (arr[index].orderStatus === '2') {
              arr[index].orderStatus = '已审核'
            }
          })
          this.pageTotal = res.data.total
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      handleCurrentChange(currentPage) {
        this.requestDara.pageSize = currentPage
        this.getOrderList()
      },
      // 判断编辑退回按钮状态
      getSelectResult(val) {
        if (val === 1) {
          if (val[0].orderStatus === '暂存') {
            this.storager = false
          } else if (val[0].orderStatus === '审核中') {
            this.sendBack = false
          }
          this.itemId = val[0].itemId
          this.orderStatus = val[0].orderStatus
        }
      },
      // 查询
      searchEvent(searchOption) {
        this.requestDara.startDate = searchOption.date[0]
        this.requestDara.endDate = searchOption.date[1]
        this.requestDara.gatherSelcondition = searchOption.registrar
        this.requestDara.orderStatus = searchOption.status
        this.getOrderList()
      },
      exportExcel() {
        /* generate workbook object from table */
        let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'))
        /* get binary string as output */
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '国内采购跟踪表.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') { console.log(e, wbout) }
        }
        return wbout
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
    .searchBtn-Content{
      position: relative;
      .searchOption{
        position: absolute;
        right: 380px;
        top: 0px;
      }
    }
  }
</style>
