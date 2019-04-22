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
            :picker-options="pickershortcutKey">
          </el-date-picker>
        </el-form-item>
        <el-col class="flexItem">
          <el-col class="rightFl">
            <el-form-item>
              <div class="tmpContent" v-if="showTodoInput">
                <el-autocomplete
                  class="inline-input"
                  v-model="formData.registrar"
                  ref="enterInputA"
                  name="enterInputA"
                  :fetch-suggestions="todoListFun"
                  placeholder="请输入录入人"
                  @select="handleSelect">
                </el-autocomplete>
                <i class="el-icon-more moreIcon"></i>
              </div>
            </el-form-item>
            <el-form-item class="search-button">
              <el-button type="primary" @click="searchHandle">查询</el-button>
              <el-input v-if="showInput" v-model="formData.keyWord" ref="enterInputB" name="enterInputB" class="search-input absInput" placeholder="请输入商机单号/客户名称查询"></el-input>
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>
    </el-col>
    <el-col class="button-content">
      <!--放一个尺寸为medium的button-->
      <slot name="button"></slot>
    </el-col>
    <el-col class="table-content">
      <!--放一个table-->
      <slot name="table"></slot>
    </el-col>
  </el-row>
</template>

<script>
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
        radioValue: ''
      }
    },
    props: {
      todoList: {
        type: Array,
        default() {
          return []
        }
      },
      showTodoInput: {
        type: Boolean,
        default: true
      },
      showInput: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      let _this = this
      if (this.showTodoInput) {
        this.$refs.enterInputA.$el.querySelector('input[name]').onkeyup = (e) => {
          if (e.keyCode === 13) {
            _this.searchHandle()
          }
        }
      }
      if (this.showInput) {
        this.$refs.enterInputB.$el.querySelector('input[name]').onkeyup = (e) => {
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
          this.formData.date = [now, now]
        } else if (res === '本周') {
          let day = now.getDay()
          let oneDayLong = 24 * 60 * 60 * 1000
          let MondayTime = nowTime - (day - 1) * oneDayLong
          let SundayTime = nowTime + (7 - day) * oneDayLong
          let monday = new Date(MondayTime)
          let sunday = new Date(SundayTime)
          this.formData.date = [monday, sunday]
        } else {
          let nowMonth = now.getMonth()
          let nowYear = now.getYear()
          nowYear += (nowYear < 2000) ? 1900 : 0
          let monthStartDate = new Date(nowYear, nowMonth, 1)
          let monthEndDate = new Date(nowYear, nowMonth + 1, 1)
          let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
          monthStartDate = new Date(nowYear, nowMonth, 1)
          monthEndDate = new Date(nowYear, nowMonth, days)
          this.formData.date = [monthStartDate, monthEndDate]
        }
      },
      searchHandle() {
        this.$emit('searchEvent', this.formData)
      },
      todoListFun(queryString, cb) {
        let todoList = this.todoList
        let results = queryString ? todoList.filter((restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }) : todoList
        cb(results)
      },
      handleSelect(item) {
        // 输入框todolist的选中项
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
          .moreIcon{
            z-index: 2;
            position: absolute;
            right: 8px;
            top: 12px;
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
  height: 36px;
  margin-bottom: 12px;
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
