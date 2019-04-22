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
          <el-select v-model="value" placeholder="请选择" class="selectNew" @change="changeSelectAll">
            <el-option
              v-for="item in formData.select"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
          registrar: '',
          select: [{
            value: '0',
            label: '暂存'
          }, {
            value: '1',
            label: '审核中'
          }, {
            value: '3',
            label: '已经审核'
          }, {
            value: '',
            label: '全部'
          }]
        },
        value: '',
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
        this.$emit('searchEvent', this.formData)
      },
      changeSelectAll(v) {
        console.log(v)
        this.$emit('searchSelect', v)
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
        flex: 54%;
        .radioGroup{
          vertical-align: top;
        }
        .el-date-editor{
          width: 260px;
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
              width: 260px;
              background: transparent;
            }
          }
        }
      }
      .search-input {
        width: 200px;
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
      width: 200px;
      text-align: right;
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
  .selectNew{
    .el-input{
      width: 110px;
    }
  }
</style>
