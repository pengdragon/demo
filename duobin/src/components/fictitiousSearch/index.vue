<template>
  <el-row>
    <el-col class="search-content search-content-box">
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
        <el-form-item label="项目状态" class="flexSelect">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="暂存" value="0"></el-option>
            <el-option label="审核中" value="1"></el-option>
            <el-option label="已审核" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-col class="flexItem">
          <el-col class="rightFl">
            <el-form-item>
              <div class="tmpContent searchInput" v-if="showTodoInput">
                <el-input
                  class="inline-input"
                  v-model="formData.registrar"
                  ref="enterInputA"
                  name="enterInputA"
                  :placeholder="inputPlaceholder">
                </el-input>
              </div>
            </el-form-item>
            <el-form-item class="search-button">
              <el-button type="primary" @click="searchHandle">查询</el-button>
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>
    </el-col>
    <el-col class="button-content">
      <!--放一个尺寸为medium的button-->
      <div>
        <slot name="button"></slot>
      </div>
      <div class="moreSearch">
        <!--此处放置更多搜索条件-->
        <slot name="moreSearch"></slot>
      </div>
    </el-col>
    <el-col class="table-content">
      <!--放一个table-->
      <slot name="table"></slot>
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
          status: '',
          registrar: ''
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
      inputPlaceholder: {
        type: String,
        required: false
      },
      showTodoInput: {
        type: Boolean,
        default: true
      }
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
    methods: {
      changeDate(res) {
        let now = new Date()
        let nowTime = now.getTime()
        var nextDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        if (res === '今天') {
          this.formData.date = [api.getDate(now), api.getDate(nextDate)]
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
        flex: 49%;
        .radioGroup{
          vertical-align: top;
        }
      }
      .flexItem{
        flex: 27%;
        .rightFl{
          text-align: right;
          .tmpContent{
            position: relative;
            .inline-input{
              z-index: 5;
              width: 250px;
              background: transparent;
            }
          }
        }
      }
      .search-input {
        width: 260px;
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
  @media screen and (max-width: 1366px) {
    .search-content-box{
      .radioGroup{
        .el-radio-button__inner{padding:10px }
      }
      .flexSelect{
        .el-form-item__content{
          width: 170px}
      }
      .searchInput{
        .inline-input{
          width: 220px !important;}
      }
    }
  }
</style>
<style lang="scss">
  .flexSelect{
    flex: 20%;
    .el-form-item__content{
      .el-input{width: 170px}
  }
  }
</style>
