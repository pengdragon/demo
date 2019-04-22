<template>
  <el-row>
    <div class="content-wrapper">
      <search @searchEvent="searchEvent" :inputPlaceholder="'请输入富森项目号/内部项目号/国内采购单号'">
        <div slot="button" style="margin-bottom: 22px">
          <el-button type="primary" size="small" @click = "bomConfirm(1)" :disabled="bomdisabled">BOM确认</el-button>
          <el-button type="primary" size="small" @click = "bomConfirm(2)" :disabled="isdisabled">进口明细</el-button>
        </div>
      </search>
      <div v-loading="loadState">
        <el-table height="450"
                  :data="tabData" border style="width: 100%"
                  :showSelection="true"
                  @cell-dblclick="dbClickCell"
                  @selection-change="getSelectResult">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column label="BOM确认" align="center" width="120px">
            <template slot-scope="prop">
              <el-button type="success"
                         size="small" disabled
                         v-show="prop.row.bomState === null"
                         >待确认</el-button>
              <el-button type="danger"
                         size="small"
                         style="margin-left: 0!important;"
                         v-show="prop.row.bomState !== null" disabled
                         >已确认</el-button>
            </template>
          </el-table-column>
          <el-table-column label="富森项目号" align="center" width="120" prop="fsOrderNo"></el-table-column>
          <el-table-column label="项目平台" align="center" width="220" prop="parnetName"></el-table-column>
          <el-table-column label="内部项目号" align="center" width="120" prop="customerNo"></el-table-column>
          <el-table-column label="项目日期" align="center" width="220" prop="orderDate"></el-table-column>
          <el-table-column label="结算类型" align="center" width="120" prop="lastPay"></el-table-column>
          <el-table-column label="品名" align="center" width="120" prop="partName"></el-table-column>
          <el-table-column label="型号" align="center" width="120" prop="exportModel"></el-table-column>
          <el-table-column label="手机屏幕尺寸" align="center" width="120" prop="mobileScreenSize"></el-table-column>
          <el-table-column label="数量" align="center" width="120" prop="itemNum"></el-table-column>
          <el-table-column label="项目价" align="center" width="120" prop="itemPrice"></el-table-column>
        </el-table>
        <!--<tabTmp :tabData="tabData"-->
                <!--:tabHeight="'450px'"-->
                <!--:showIndex="false"-->
                <!--:openDbClick="true"-->
                <!--:showSelection="true"-->
                <!--@dbClickCell="dbClickCell"-->
                <!--@getSelectResult="getSelectResult"-->
                <!--:tabTagData="tabTagData">-->
        <!--</tabTmp>-->
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

    <el-dialog width="65%" :close-on-click-modal="false" :title="dialogTitleType" :visible.sync="dialogVisible">
      <div v-if=" bomId === 1">
        <tabTmp :tabData="bomData"
                :showIndex="false"
                :tableId = "'tab1'"
                :tabTagData="bomTagData">
        </tabTmp>
      </div>
      <div v-if=" bomId === 2">
        <tabTmp :tabData="detailData"
                :showIndex="false"
                :tableId = "'tab2'"
                :tabTagData="detailTagData">
        </tabTmp>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="bomStateConfirm" v-if=" bomId === 1">BOM确认</el-button>
        <el-button type="primary" @click="exportExcel('tab1', 'BOM确认明细')" v-if=" bomId === 1">导出</el-button>
        <el-button type="primary" @click="exportExcel('tab2', 'BOM进口明细')" v-if=" bomId === 2">导出</el-button>
        <el-button type="info" @click="dialogVisible = false">返回</el-button>
      </div>
    </el-dialog>

  </el-row>
</template>

<script>
  import search from '@/components/fictitiousSearch'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    data() {
      return {
        isdisabled: true,
        bomdisabled: true,
        dialogTitleType: '',
        tabData: [
          { bomState: '待确认' },
          { bomState: '已确认' }
        ],
        detailData: [],
        bomData: [],
        tabTagData: [
          {
            label: '项目号',
            prop: 'fsOrderNo',
            width: '120px'
          },
          {
            label: '项目平台',
            prop: 'parnetName',
            width: '120px'
          },
          {
            label: '内部项目号',
            prop: 'customerNo',
            width: '120px'
          },
          {
            label: '项目日期',
            prop: 'orderDate',
            width: '200px'
          },
          {
            label: 'BOM确认',
            prop: 'bomState',
            width: '120px'
          },
          {
            label: '结算类型',
            prop: 'lastPay',
            width: '80px'
          },
          {
            label: '品名',
            prop: 'partName',
            width: '200px'
          },
          {
            label: '型号',
            prop: 'exportModel',
            width: '120px'
          },
          {
            label: '手机屏幕尺寸',
            prop: 'mobileScreenSize',
            width: ''
          },
          {
            label: '项目数量',
            prop: 'itemNum',
            width: ''
          },
          {
            label: '项目价',
            prop: 'itemPrice',
            width: ''
          }
        ],
        bomTagData: [ // bom确认明细
          {
            label: '订单号',
            prop: 'itemOrderNo',
            width: '120px'
          },
          {
            label: '物料编码',
            prop: 'custPartNo',
            width: '120px'
          },
          {
            label: '物料名称',
            prop: 'partName',
            width: '300px'
          },
          {
            label: '配置及规格',
            prop: 'spec',
            width: '120px'
          },
          {
            label: '用量',
            prop: 'consumption',
            width: '120px'
          },
          {
            label: '采购数量',
            prop: 'quantity',
            width: '120px'
          },
          {
            label: '币别',
            prop: 'currency',
            width: '70px'
          },
          {
            label: '含税单价',
            prop: 'price',
            width: '120px'
          },
          {
            label: '总价',
            prop: 'totalPrice',
            width: '120px'
          },
          {
            label: '供应商',
            prop: 'supplie',
            width: '240px'
          },
          {
            label: '收票数量',
            prop: 'collectionTicketData',
            width: '80px'
          },
          {
            label: '收票金额',
            prop: 'collectionTicketAmount',
            width: '120px'
          }
        ],
        detailTagData: [
          {
            label: '订单号',
            prop: 'fsOrderNo',
            width: ''
          },
          {
            label: '订单日期',
            prop: 'orderDate',
            width: ''
          },
          {
            label: '订单状态',
            prop: 'orderStatus',
            width: ''
          },
          {
            label: '外贸合同号',
            prop: 'contractNo',
            width: ''
          },
          {
            label: '海关汇率',
            prop: 'customsRate',
            width: ''
          },
          {
            label: '订单币别',
            prop: 'orderCurrency',
            width: ''
          },
          {
            label: '品名',
            prop: 'partName',
            width: ''
          },
          {
            label: '型号',
            prop: 'spec',
            width: ''
          },
          {
            label: '单价',
            prop: 'price',
            width: ''
          },
          {
            label: '订单数量',
            prop: 'quantity',
            width: ''
          }
        ],
        requestDara: {
          pageSize: 1,
          pageCount: 10,
          startDate: '',
          endDate: '',
          orderStatus: '',
          gatherSelcondition: ''
        },
        bomId: 1,
        itemID: '',
        loadState: false,
        pageTotal: 0,
        currentPage: 1,
        pageSize: 10,
        showMoreSearch: false,
        confirmState: '',
        dialogVisible: false
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
      // 获取bom单据列表
      getOrderList() {
        this.loadState = true
        let jsonStr = this.requestDara
        // console.log(jsonStr)
        // console.log(typeof jsonStr)
        this.$axios.post('api/virtual/order/itemBomConfirmList', jsonStr).then((res) => {
          this.tabData = res.data.list
          this.pageTotal = res.data.total
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      // bom确认明细
      getOrderBom() {
        this.loadState = true
        let jsonStr = this.itemID
        // console.log(jsonStr)
        // console.log(typeof jsonStr)
        req.get('api/virtual/order/itemBomConfirmDetailsList', {
          params: {
            itemId: jsonStr
          }}
        ).then((res) => {
          this.bomData = res.data
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      getOrderBomImport() {
        this.loadState = true
        let jsonStr = this.itemID
        // console.log(jsonStr)
        // console.log(typeof jsonStr)
        req.get('api/virtual/order/itemBomImportDetailsList', {
          params: {
            itemId: jsonStr
          }
        }).then((res) => {
          this.detailData = res.data
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      // bom明细和订单明细弹窗
      bomConfirm(val) {
        this.bomId = val
        this.dialogVisible = true
        if (val === 1) { // 等于1的时候打开bom确认明细 否则打开bom进口明细
          this.dialogTitleType = 'BOM确认明细'
          this.getOrderBom()
        } else {
          this.dialogTitleType = '进口明细'
          this.getOrderBomImport()
        }
      },
      // 更新bom确认状态
      bomStateConfirm() {
        let itemID = this.itemID
        req.post('api/virtual/order/updateBomState',
          { itemId: itemID }
        ).then(() => {
          this.$notify({
            type: 'success',
            message: '确认成功'
          })
          this.dialogVisible = false
          this.loadState = false
          this.getOrderList()
        }).catch((error) => {
          console.log(error)
        })
      },
      handleCurrentChange(currentPage) {
        this.requestDara.pageSize = currentPage
        this.getOrderList()
      },
      getSelectResult(selectArr) {
        if (selectArr.length === 1) {
          this.isdisabled = false
          this.itemID = selectArr[0].itemId
          if (selectArr[0].bomState === null) {
            this.bomdisabled = false
          } else {
            this.bomdisabled = true
          }
        } else {
          this.isdisabled = true
          this.bomdisabled = true
          this.itemID = ''
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
      // 导出
      exportExcel(val, name) {
        /* generate workbook object from table */
        let vaLId = '#' + val
        let wb = XLSX.utils.table_to_book(document.querySelector(vaLId))
        /* get binary string as output */
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '' + name + '.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') { console.log(e, wbout) }
        }
        return wbout
      },
      getSearchData(searchOption, pageCurrent, showMsg = true) {
      },
      dbClickCell(rows) {
        console.log(rows)
        this.dialogVisible = true
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
    .more-input{
      float: right;
      margin-bottom: 8px;
    }
  }
</style>
