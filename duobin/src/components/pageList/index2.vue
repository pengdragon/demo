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
                  placeholder="请输入项目号">
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
        <slot name="button">
          <el-button v-if="showAdd" @click="addClick">新增</el-button>
          <el-button v-if="showCheck" @click="showCheck">查看</el-button>
          <el-button v-if="showDel" @click="showDel">删除</el-button>
        </slot>
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
  </el-row>
</template>

<script>
  import api from '@/utils/apiUtil'
  export default {
    data() {
      return {
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
        formData: {
          date: '',
          registrar: '',
          keyWord: ''
        },
        radioValue: '',
        showMoreSearch: false
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
      tabData: {
        type: Array,
        required: true
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
      }
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
    methods: {
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
      getSelectChange(selection) { // 获取选中项JSON
        if (!this.showSelection) { return }
        // 父组件需对本组件绑定getSelectResult事件
        this.$emit('getSelectResult', selection)
      },
      deleteItem(index) { // 获取对应项索引
        this.$confirm(`是否删除序号为 ${index + 1} 的项目?`, '提示', {
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
      },
      addClick() {
        this.$emit('addClick', '')
      },
      showCheck() {
        this.$emit('showCheck', '')
      },
      showDel() {
        this.$emit('showDel', '')
      },
      searchHandle() {
        this.$emit('searchEvent', this.formData)
      }
    }
  }
</script>

<style scoped lang="scss">
  .search-content{
  .formFlexBox{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
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
  .button-content{
    display: flex;
    justify-content: space-between;
    height: 36px;
    margin-bottom: 12px;
  .moreSearch{
    font-size: 15px;
  }
  }
</style>
<style lang="scss">
  .tmpContent{
  .inline-input{
  input{
    background-color: transparent;
  }
  }
  }
</style>
