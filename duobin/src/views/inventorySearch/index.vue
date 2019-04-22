<template>
  <div class="container-wrapper">
    <el-row>
      <el-col class="form-content">
        <el-form :model="formData" inline size="medium" class="formFlexBox" :label-width="'90px'">
          <el-form-item class="dateGroup">
            <el-form-item label="订单日期：" class="formItem">
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
                    placeholder="请输入项目号">
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item class="search-button">
                <el-button type="primary">查询</el-button>
                <el-button type="primary">更多查询</el-button>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-col>
      <el-col class="tableView-wrapper">
        <!--<el-table
          :data="tableData"
          :border="true"
          class="orderTable"
          :row-style="{height:'30px'}"
          style="width: 100%;margin: 8px 0;">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60">
          </el-table-column>
          <el-table-column
            align="center"
            label="订单号">
            <template slot-scope="prop">
              <div>
                {{prop.row.orderNum}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单日期">
            <template slot-scope="prop">
              <div>
                {{prop.row.orderDay}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="品号">
            <template slot-scope="prop">
              <div>
                {{prop.row.productNum}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="型号">
            <template slot-scope="prop">
              <div>
                {{prop.row.model}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="品牌">
            <template slot-scope="prop">
              <div>
                {{prop.row.brand}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单数量">
            <template slot-scope="prop">
              <div>
                {{prop.row.orderAmount}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            property="money"
            align="center"
            label="剩余数量">
            <template slot-scope="prop">
              <div>
                {{prop.row.surplusAmount}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="单价">
            <template slot-scope="prop">
              <div>
                {{prop.row.price}}
              </div>
            </template>
          </el-table-column>
        </el-table>-->
        <tabTmp :tabData="queryData"
                :showSelection="true"
                :tabTagData="tabTagData">
        </tabTmp>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import req from '@/utils/req'
  import tabTmp from '@/components/tabTemplate'
  export default {
    data() {
      return {
        formData: {
          date: '',
          registrar: '',
          keyWord: ''
        },
        tabTagData: [
          {
            label: '订单号',
            prop: 'orderNum',
            width: ''
          },
          {
            label: '订单日期',
            prop: 'orderDay',
            width: ''
          },
          {
            label: '品名',
            prop: 'productNum',
            width: ''
          },
          {
            label: '型号',
            prop: 'model',
            width: ''
          },
          {
            label: '品牌',
            prop: 'brand',
            width: ''
          },
          {
            label: '订单数量',
            prop: 'orderAmount',
            width: ''
          },
          {
            label: '剩余数量',
            prop: 'surplusAmount',
            width: ''
          },
          {
            label: '单价',
            prop: 'price',
            width: ''
          }
        ],
        queryData: [
          {
            orderNum: '987658',
            orderDay: '2018-02-15',
            productNum: '二极管',
            model: 'TK9527',
            brand: '雄光',
            orderAmount: '1000',
            surplusAmount: '1000',
            price: '1000'
          },
          {
            orderNum: '987658',
            orderDay: '2018-02-15',
            productNum: '二极管',
            model: 'TK9527',
            brand: '雄光',
            orderAmount: '1000',
            surplusAmount: '1000',
            price: '1000'
          }
        ],
        radioValue: '',
        showMoreSearch: false
      }
    },
    methods: {
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
    }
  }
</script>

<style scoped lang="scss">
  .container-wrapper{
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 15px 20px 90px 20px;
    .formFlexBox{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-date-editor {
        .el-range-separator{
          padding: 0 2px !important;
        }
      }
      .dateGroup{
        flex: 55%;
        .radioGroup{
          vertical-align: top;
        }
      }
      .flexItem{
        flex: 40%;
        .rightFl{
          text-align: right;
          .tmpContent{
            position: relative;
            .inline-input{
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
      .search-button{
        position: relative;
        margin-right: 0;
        .absInput{
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
