<template>
  <div class="content-wrapper">
    <el-row>
      <el-col :span="20">
        <div class="order-content">
          <div class="title">项目跟踪详情</div>
          <el-table :data="oederDetail" border style="width: 100%">
            <el-table-column label="项目信息" width="300">
              <template slot-scope="scope">
                <p>项目号：{{scope.row.fsOrderNo}}</p>
                <p>内部项目号：{{scope.row.customerNo}}</p>
                <p>项目日期：{{scope.row.orderDate}}</p>
                <p>项目平台：{{scope.row.outDate}}</p>
              </template>
            </el-table-column>
            <el-table-column label="基本信息"  width="300">
              <template slot-scope="scope">
                <p>项目数量：{{scope.row.itemNum}}</p>
                <p>出口数量：{{scope.row.exportedQuantity}}</p>
                <p>内销数量：{{scope.row.domesticQuantity}}</p>
              </template>
            </el-table-column>
            <el-table-column label="收货信息">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="12">
                    <p>品名：{{scope.row.partName}}</p>
                    <p>手机屏幕尺寸：{{scope.row.mobileScreenSize}}</p>
                    <p>BOM确认：{{scope.row.bomState}}</p>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>

          <el-tabs style="margin-top: 20px" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="进口物料跟踪" name="first">
              <tabTmp :tabData="imMaterialData"
                      :showIndex="false"
                      :tabTagData="imMaterialTagData">
              </tabTmp>
            </el-tab-pane>
            <el-tab-pane label="进口订单" name="second">
              <tabTmp :tabData="imOrderData"
                      :showIndex="false"
                      :tabTagData="imOrderTagData">
              </tabTmp>
            </el-tab-pane>
            <!--<el-tab-pane label="国内采购" name="third">-->
              <!--<tabTmp :tabData="domPurchaseData"-->
                      <!--:showIndex="false"-->
                      <!--:tabTagData="domPurchaseTagData">-->
              <!--</tabTmp>-->
            <!--</el-tab-pane>-->
            <el-tab-pane label="委托加工" name="fourth">
              <tabTmp :tabData="processData"
                      :showIndex="false"
                      :tabTagData="processTagData">
              </tabTmp>
            </el-tab-pane>
            <el-tab-pane label="出口" name="five">
              <tabTmp :tabData="exOrderData"
                      :showIndex="false"
                      :tabTagData="exOrderTagData">
              </tabTmp>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  export default {
    data() {
      return {
        oederDetail: [
          {}
        ],
        requestDara: {
          pageSize: 1,
          pageCount: 10,
          startDate: '',
          endDate: '',
          orderStatus: '',
          gatherSelcondition: ''
        },
        fileList: [
          {
            name: '提货授权书.doc',
            url: ''
          },
          {
            name: '提货授权书2.doc',
            url: ''
          }
        ],
        activeName: 'first',
        itemId: '',
        imMaterialData: [],
        imMaterialTagData: [
          {
            label: '料号',
            prop: 'custPartNo',
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
            width: '280px'
          },
          {
            label: '数量',
            prop: 'quantity',
            width: ''
          },
          {
            label: '成交单位',
            prop: 'unit',
            width: ''
          },
          {
            label: '单价',
            prop: 'price',
            width: ''
          },
          {
            label: '供应商',
            prop: 'supplier',
            width: ''
          },
          {
            label: '采购员',
            prop: 'buyer',
            width: ''
          },
          {
            label: '用量',
            prop: 'consumption',
            width: ''
          },
          {
            label: '币别',
            prop: 'currency',
            width: ''
          },
          {
            label: '已下单数量',
            prop: 'placedQuantity',
            width: ''
          },
          {
            label: '已进口数量',
            prop: 'importOrderQuantity',
            width: ''
          }
        ],
        imOrderData: [],
        imOrderTagData: [
          {
            label: '订单号',
            prop: 'fsOrderNo',
            width: ''
          },
          {
            label: '订单状态',
            prop: 'orderStatus',
            width: ''
          },
          {
            label: '订单日期',
            prop: 'orderDate',
            width: ''
          },
          {
            label: '报关日期',
            prop: 'declarationDate',
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
          },
          {
            label: '报关数量',
            prop: 'declareQuantity',
            width: ''
          }
        ],
        processData: [],
        processTagData: [
          {
            label: '加工单号',
            prop: 'fsOrderNo',
            width: ''
          },
          {
            label: '加工单日期',
            prop: 'orderDate',
            width: ''
          },
          {
            label: '加工厂',
            prop: 'processingFactory',
            width: ''
          },
          {
            label: '加工型号',
            prop: 'processingModel',
            width: ''
          },
          {
            label: '加工名称',
            prop: 'productName',
            width: ''
          },
          {
            label: '加工数量',
            prop: 'processingQuantity',
            width: ''
          },
          {
            label: '加工单价',
            prop: 'processingPrice',
            width: ''
          },
          {
            label: '加工金额',
            prop: 'processingAmount',
            width: ''
          },
          {
            label: '已付款金额',
            prop: 'payedAmount',
            width: ''
          }
        ],
        exOrderData: [],
        exOrderTagData: [
          {
            label: '订单号',
            prop: 'fsOrderNo',
            width: ''
          },
          {
            label: '外贸合同号',
            prop: 'contractNo',
            width: ''
          },
          {
            label: '订单日期',
            prop: 'orderDate',
            width: ''
          },
          {
            label: '品名',
            prop: 'partName',
            width: ''
          },
          {
            label: '品牌',
            prop: 'brand',
            width: ''
          },
          {
            label: '报关型号',
            prop: 'declarationSpcec',
            width: ''
          },
          {
            label: '配件',
            prop: 'parts',
            width: ''
          },
          {
            label: '报关单价',
            prop: 'price',
            width: ''
          },
          {
            label: '订单数量',
            prop: 'quantity',
            width: ''
          },
          {
            label: '报关金额',
            prop: 'declareAmount',
            width: ''
          },
          {
            label: '报关箱数',
            prop: 'declareBoxes',
            width: ''
          },
          {
            label: '报关重量',
            prop: 'declareWeight',
            width: ''
          }
        ]
      }
    },
    components: {
      tabTmp
    },
    created() {
      this.getOrderList()
      this.getMaterial()
      this.getTrackImport()
      this.getTrackMachine()
      this.getExport()
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      },
      deleteOrder(order, index) {
        console.log(order)
        this.oederDetail.splice(index, 1)
      },
      /**
       * 获取项目跟踪详情
       */
      getOrderList() {
        this.requestDara.gatherSelcondition = this.$route.query.orderNo
        let jsonStr = this.requestDara
        // console.log(jsonStr)
        // console.log(typeof jsonStr)
        this.$axios.post('api/virtual/order/itemTrackList', jsonStr).then((res) => {
          this.oederDetail = res.data.list
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 获取进口物料跟踪
       */
      getMaterial() {
        req.get('api/virtual/order/itemTrackMaterialList', {
          params: {
            itemId: this.$route.query.id
          }}
        ).then((res) => {
          this.imMaterialData = res.data
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      /**
       * 获取出进口订单
       */
      getTrackImport() {
        req.get('api/virtual/order/itemTrackImportList', {
          params: {
            itemId: this.$route.query.id
          }}
        ).then((res) => {
          this.imOrderData = res.data
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      /**
       * 获取加工订单
       */
      getTrackMachine() {
        req.get('api/virtual/order/itemTrackMachineList', {
          params: {
            itemId: this.$route.query.id
          }}
        ).then((res) => {
          this.processData = res.data
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      /**
       * 获取出口订单
       */
      getExport() {
        req.get('api/virtual/order/itemTrackExportList', {
          params: {
            itemId: this.$route.query.id
          }}
        ).then((res) => {
          this.exOrderData = res.data
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    padding: 10px 20px;
    min-width: 1310px;
    .order-content{
      width: 1110px;
      .order-status{
        width: 100%;
        height: 40px;
      }
      .title{
        border-left: 3px solid #1F9BD6;
        margin: 20px 0;
        padding-left: 20px;
        color: #1F9BD6;
      }
    }
    .status-item{
      position: relative;
      float: left;
      margin-left: 10px;
      width: 130px;
      height: 40px;
      border-radius: 5px;
      /*border: 1px solid rgb(196,196,196);*/
      background: rgb(196,196,196);
      text-align: center;
      line-height: 40px;
      color: white;
      .triangle{
        position: absolute;
        top: 10px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-left: 10px solid white;
        border-bottom: 10px solid transparent;
      }
      .triangle-right{
        right: -10px;
        border-left: 10px solid rgb(196,196,196);
      }
      .triangle-left{
        left: 0px;
      }
    }
    .complete{
      background: #1F9BD6 !important;
      .triangle-right{
        right: -10px;
        border-left: 10px solid #1F9BD6;
      }
    }
    .upload-file{
      /*width: 500px;*/
      margin-bottom: 20px;
    }
    .el-upload__tip{
      display: inline-block;
      margin-left: 20px;
      color: rgb(178,178,178)
    }
  }
</style>
<style lang="scss">
  .table-main{
    .cell{
      .el-input{
        input{
          text-align: center;
          border: none;
          background-color: transparent;
        }
      }
      .el-input__inner{
        padding: 0;
      }
      .el-textarea{
        textarea{
          text-align: center;
          border: none;
          background-color: transparent;
        }
      }
    }
    tbody{
      td{
        padding: 0;
      }
    }
  }
</style>
