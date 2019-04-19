<template>
  <el-row>
    <el-col class="search-content">
      <el-form :model="formData" inline size="medium" class="formFlexBox">
        <el-form-item class="dateGroup">
          <el-radio-group v-model="radioValue" @change="changeDate" class="radioGroup">
            <el-radio-button label="今天" ></el-radio-button>
            <el-radio-button label="本周"></el-radio-button>
            <el-radio-button label="本月"></el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickershortcutKey">
          </el-date-picker>
        </el-form-item>
        <el-col class="flexItem">
          <el-col class="rightFl">
            <el-form-item>
              <div class="tmpContent" v-if="showTodoInput">
                <el-input
                  class="inline-input"
                  v-model="formData.registrar"
                  ref="enterInputA"
                  name="enterInputA"
                  placeholder="请输入订单号">
                </el-input>
              </div>
            </el-form-item>
            <el-form-item class="search-button">
              <el-button type="primary" @click="searchHandle">查询</el-button>
              <el-button type="primary" @click="showMoreSearch = !showMoreSearch">更多查询</el-button>
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>
    </el-col>
    <el-col class="button-content">
      <!--放一个尺寸为medium的button-->
      <div>
          <el-button size="small"
                     type="primary"
                     v-if="showAdd"
                     @click="add">新增</el-button>
          <el-button size="small"
                     type="primary"
                     v-if="showCheck"
                     @click="lookFor" :disabled="currentState">查看</el-button>
          <el-button size="small" type="danger" v-if="showDel" :disabled="currentState" @click="deleteItem">删除</el-button>
      </div>
      <div class="moreSearch" v-show="showMoreSearch">
        <!--此处放置更多搜索条件-->
        <slot name="moreSearch"></slot>
      </div>
    </el-col>
    <el-col class="table-content">
      <el-table :data="tabData"
                ref="tabMain"
                @cell-click="getCellMsg"
                @cell-dblclick="dbGetCellMsg"
                @selection-change="getSelectChange"
                :style="{height:tabHeight,width:'100%'}"
                :height="tabHeight"
                :border="border">
        <el-table-column v-if="showSelection"
                         type="selection"
                         width="55" align="center"></el-table-column>
        <el-table-column v-if="showIndex"
                         type="index"
                         label="序号"
                         :class-name="showPointer?'showPointer':''"
                         align="center" width="60"></el-table-column>
        <el-table-column
          v-for="item in tabTagData"
          :key="item.label"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :class-name="showPointer?'showPointer':''"
          align="center">
          <template slot-scope="prop">
            <div v-if="emptyHandle">
              {{prop.row[item.prop]?prop.row[item.prop]:(parseInt(prop.row[item.prop])!==0)?'-':prop.row[item.prop]}}
            </div>
            <!--商机列表页面点击跳转-->
            <div v-else-if="item.openJump"
                 class="nameContent"
                 @click.stop="chanceDetailJump(prop.row)">
              {{prop.row[item.prop]}}
            </div>
            <div v-else>
              {{prop.row[item.prop]}}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="showHandle" label="操作" align="center">
          <template slot-scope="prop">
            <el-button type="text" size="small" @click.stop="deleteItem(prop.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col>
      <el-pagination
        @current-change="takeGoodsCurrentChange"
        background
        :page-size="pageSize"
        :current-page.sync="currentPage"
        class="paginationContent"
        layout="prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
      <!--</div>-->
    </el-col>
  </el-row>
</template>

<script>
  import api from '@/utils/apiUtil'
  import req from '@/utils/req'
  import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        currentPage: 1,
        pageTotal: 0,
        pageSize: 10,
        pickershortcutKey: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                picker.$emit('pick', [start, end])
              }
            },
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
                console.log(picker)
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        },
        pageData: {
          'sessionId': Cookies.get('sessionid'),
          'pageSize': 10,
          'pageIndex': 1,
          'orderid': '',
          'tradedate1': '',
          'tradedate2': ''
        },
        tabData: [],
        formData: {
          date: '',
          registrar: '',
          keyWord: ''
        },
        radioValue: '',
        showMoreSearch: false,
        getSelectResultArr: []
      }
    },
    props: {
      todoList: {
        type: Array,
        default() {
          return []
        }
      },
      showAdd: {
        type: Boolean,
        default: false
      },
      showCheck: {
        type: Boolean,
        default: false
      },
      showDel: {
        type: Boolean,
        default: false
      },
      showTodoInput: {
        type: Boolean,
        default: true
      },
      tabTagData: {
        type: Array,
        required: true
      },
      showSelection: {
        type: Boolean,
        default: false
      },
      showIndex: {
        type: Boolean,
        default: true
      },
      showHandle: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: true
      },
      tabHeight: {
        type: [String, Number],
        default: 'auto'
      },
      showPointer: {
        type: Boolean,
        default: true
      },
      openClick: {
        type: Boolean,
        default: false
      },
      openDbClick: {
        type: Boolean,
        default: false
      },
      emptyHandle: {
        type: Boolean,
        default: false
      },
      listUrl: {
        type: String,
        required: true
      }
    },
    created() {
      this.getPage()
    },
    mounted() {
      this.$refs.tabMain.doLayout()
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
    computed: {
      currentState() {
        return !(this.getSelectResultArr.length === 1)
      }
    },
    methods: {
      add() {
        this.$emit('add', '')
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
      changeDate(res) {
        let now = new Date()
        let nowTime = now.getTime()
        if (res === '今天') {
          this.formData.date = [api.getDate(now), api.getDate(now)]
        } else if (res === '本周') {
          let day = now.getDay()
          let oneDayLong = 24 * 60 * 60 * 1000
          let MondayTime = nowTime - (day - 1) * oneDayLong
          let SundayTime = nowTime + (7 - day) * oneDayLong
          let monday = new Date(MondayTime)
          let sunday = new Date(SundayTime)
          this.formData.date = [api.getDate(monday), api.getDate(sunday)]
        } else {
          let nowMonth = now.getMonth()
          let nowYear = now.getYear()
          nowYear += (nowYear < 2000) ? 1900 : 0
          let monthStartDate = new Date(nowYear, nowMonth, 1)
          let monthEndDate = new Date(nowYear, nowMonth + 1, 1)
          let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
          monthStartDate = new Date(nowYear, nowMonth, 1)
          monthEndDate = new Date(nowYear, nowMonth, days)
          this.formData.date = [api.getDate(monthStartDate), api.getDate(monthEndDate)]
        }
      },
      searchHandle() {
        this.pageData.orderid = this.formData.registrar
        this.pageData.tradedate1 = this.formData.date[0]
        this.pageData.tradedate2 = this.formData.date[1]
        this.pageData.pageIndex = 1
        this.getPage()
        this.$emit('searchEvent', this.formData)
      },
      getPage() {
        // console.log(this.pageData)
        this.pageData.pageIndex = this.currentPage
        req.post(this.listUrl, this.pageData).then((res) => {
          console.log(res)
          this.tabData = res.data.content
          res.data.content.forEach((v) => {
            v.sys_created = api.getTime(v.sys_created)
          })
          this.pageTotal = parseInt(res.data.total)
        }).catch((error) => {
          console.log(error)
        })
      },
      getCellMsg(row, column, cell, event) { // 点击某一项,实现删除操作
        if (!this.openClick) { return }
        /*
        * @参数
        * row 代表该行数据
        * column 代表改列数据
        * cell 代表点击项的DOM
        * event 代表事件对象
        * */
        // 父组件需对本组件绑定clickCell事件
        this.$emit('clickCell', row)
      },
      dbGetCellMsg(row, column, cell, event) {
        if (!this.openDbClick) { return }
        this.$emit('dbClickCell', row)
      },
      // getSelectChange(selection) { // 获取选中项JSON
      //   if (!this.showSelection) { return }
      //   // 父组件需对本组件绑定getSelectResult事件
      //   this.$emit('getSelectResult', selection)
      // },
      getSelectChange(arr) {
        this.getSelectResultArr = arr
      },
      deleteItem(index) { // 获取对应项索引
        this.$confirm(`此操作将删除选中项目,是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 父组件需对本组件绑定deleteItem事件
          this.$emit('deleteItem', index)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      chanceDetailJump(row) {
        this.$emit('chanceDetailJump', row)
      }
    }
  }
</script>

<style scoped lang="scss">
  .paginationContent {
    float: right;
    margin: 10px 0;
  }
  .showPointer{
    cursor: pointer;
  }
  .nameContent{
    color: dodgerblue;
    &:hover{
       text-decoration: underline;
    }
  }
  .search-content{
    .formFlexBox{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .dateGroup{
        flex: 44%;
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
  .button-content{
    display: flex;
    justify-content: space-between;
    /*height: 36px;*/
    margin-bottom: 12px;
    .moreSearch{
      font-size: 15px;
      .el-input{
        display: inline-block;
        width: 20% !important;
      }
    }
  }
</style>
<style lang="scss">
  .moreSearch{
    font-size: 15px;
    width: 80%;
    .el-input{
      display: inline-block;
      width: 20% !important;
      float: right;
      margin-left: 10px;
    }
  }
  .tmpContent{
    .inline-input{
      input{
        background-color: transparent;
      }
    }
  }
</style>
