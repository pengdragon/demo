<template>
  <div class="container-wrapper">
    <el-row>
      <el-col class="form-content">
        <el-form :model="formData" inline size="medium" class="formFlexBox" :label-width="'90px'">
          <el-form-item class="dateGroup">
            <el-form-item label="收货时间：" class="formItem">
              <el-date-picker
                v-model="formData.date"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-col class="flexItem">
            <el-col class="rightFl">
              <el-form-item>
                <div class="tmpContent">
                  <el-input
                    class="inline-input"
                    ref="enterInputA"
                    name="enterInputA"
                    v-model="formData.registrar"
                    placeholder="请输入入库单和型号">
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item class="search-button">
                <el-button type="primary" @click="searchEvent()">查询</el-button>

              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-col>
      <el-col class="tableView-wrapper">
        <tabTmp :tabData="queryData"
                :openClick="true"

                :tabTagData="tabTagData">
        </tabTmp>
      </el-col>
    </el-row>
    <el-dialog title="入库明细" :visible.sync="showOrderDetail" class="choose">
      <tabTmp :tabData="queryDetail"
              :openClick="true"

      >
      </tabTmp>
    </el-dialog>
    <div style="margin-top:10px;float: right;" v-if="total">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        background
        class="paginationContent"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  // import req from '@/utils/req'
  import tabTmp from '@/components/tabTemplate'

  export default {
    data() {
      return {
        total: 0,
        currentPage: 1,
        pageSize: 20,
        showOrderDetail: false,
        formData: {
          date: '',
          registrar: '',
          keyWord: ''
        },
        tabTagData: [
          {
            label: '入库单号',
            prop: 'orderNo',
            width: ''
          },
          {
            label: '入库时间',
            prop: 'inDate',
            width: ''
          },
          {
            label: '型号',
            prop: 'model',
            width: ''
          },
          {
            label: '数量',
            prop: 'quantity',
            width: ''
          },
          {
            label: '箱数',
            prop: 'boxCount',
            width: ''
          },
          {
            label: '净重',
            prop: 'netWeight',
            width: ''
          },
          {
            label: '毛重',
            prop: 'grossWeight',
            width: ''
          },
          {
            label: '箱号',
            prop: 'boxNumber',
            width: ''
          },
          {
            label: '拆箱次数',
            prop: 'unboxNum',
            width: ''
          },
          {
            label: '品牌',
            prop: 'brand',
            width: ''
          },
          {
            label: '产地',
            prop: 'origin',
            width: ''
          }
        ],
        queryData: [],
        queryDetailTagData: [
          {
            label: '采购单号',
            prop: 'purchaseOrder',
            width: ''
          },
          {
            label: '品名',
            prop: 'productName',
            width: ''
          },
          {
            label: '规格型号',
            prop: 'specificationsModel',
            width: ''
          },
          {
            label: '数量',
            prop: 'number',
            width: ''
          },
          {
            label: '单价',
            prop: 'price',
            width: ''
          },
          {
            label: '单位',
            prop: 'unit',
            width: ''
          },
          {
            label: '箱数',
            prop: 'boxNum',
            width: ''
          },
          {
            label: '原箱号',
            prop: 'primaryBoxNum',
            width: ''
          },
          {
            label: '品牌',
            prop: 'brand',
            width: ''
          },
          {
            label: '产地',
            prop: 'productPrice',
            width: ''
          },
          {
            label: '净重',
            prop: 'netWeight',
            width: ''
          },
          {
            label: '毛重',
            prop: 'grossWeight',
            width: ''
          }
        ],
        queryDetail: [
          {
            purchaseOrder: '',
            productName: '',
            specificationsModel: '',
            number: '',
            price: '',
            unit: '',
            boxNum: '',
            primaryBoxNum: '',
            brand: '',
            productPrice: '',
            netWeight: '',
            grossWeight: ''
          }
        ],
        radioValue: '',
        showMoreSearch: false
      }
    },
    components: {
      tabTmp
    },
    mounted() {
      let _this = this
      // 回车事件触发搜索
      if (this.showTodoInput) {
        this.$refs.enterInputA.$el.querySelector('input[name]').onkeyup = (e) => {
          if (e.keyCode === 13) {
            _this.searchHandle()
          }
        }
      }
    },

    created() {
      let data = {
        pageSize: 0,
        pageCount: 20

      }
      this.$axios.post('/api/purchase/order/listStockinDetails', data)
        .then((response) => {
          this.queryData = response.data.list
          this.total = response.data.total
        })
    },
    methods: {
      // 列表查询
      searchEvent() {
        this.currentPage = 1
        let data = {
          pageSize: 0,
          pageCount: 20,
          startDate: this.formData.date[0],
          endDate: this.formData.date[1],
          gatherSelcondition: this.formData.registrar

        }
        this.$axios.post('/api/purchase/order/listStockinDetails', data)
          .then((response) => {
            this.queryData = response.data.list
            this.total = response.data.total
          })
      },
      handleCurrentChange(currentPage) {
        let data = {
          pageSize: currentPage - 1,
          pageCount: 20,
          gatherSelcondition: this.formData.registrar
        }
        this.$axios.post('/api/purchase/order/listStockinDetails', data)
          .then((response) => {
            this.queryData = response.data.list
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
    padding: 15px 20px 90px 20px;

    .formFlexBox {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .el-date-editor {
        .el-range-separator {
          padding: 0 2px !important;
        }
      }

      .dateGroup {
        flex: 55%;

        .radioGroup {
          vertical-align: top;
        }
      }

      .flexItem {
        flex: 40%;

        .rightFl {
          text-align: right;

          .tmpContent {
            position: relative;

            .inline-input {
              z-index: 5;
              width: 360px;
              background: transparent;
            }
          }
        }
      }

      .search-input {
        width: 360px;
      }

      .search-button {
        position: relative;
        margin-right: 0;

        .absInput {
          z-index: 10;
          position: absolute;
          right: 0;
          bottom: -58px;
        }
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

  .choose {
    .el-dialog {
      width: 74% !important;
    }

    .el-dialog__header {
      border-bottom: 1px solid #e0e0e0;
    }
  }
</style>
