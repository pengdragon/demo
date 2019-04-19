<template>
  <div class="content-wrapper">
    <div class="search-content">
      <!--头部信息-->
      <div class="top" v-show="$slots.top">
        <slot name="top"></slot>
      </div>
      <div class="flexBox">
        <!--快捷键-->
        <div class="radioGroup">
          <div class="item"
               :class="{active: dateTag === tags[0]}"
               @click="changeDate(tags[0])">今天</div>
          <div class="item"
               :class="{active: dateTag === tags[1]}"
               @click="changeDate(tags[1])">本周</div>
          <div class="item"
               :class="{active: dateTag === tags[2]}"
               @click="changeDate(tags[2])">本月</div>
        </div>
        <!--时间选择器-->
        <div class="datePick-content">
          <el-date-picker
            v-model="formData.date"
            class="datePick"
            type="daterange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickershortcutKey">
          </el-date-picker>
          <i class="bf el-icon-date"></i>
          <i class="af el-icon-date"></i>
        </div>
        <!--搜索框-->
        <div class="search-container">
          <el-input class="search-input"
                    v-model="formData.registrar"
                    @keydown.native.13="searchHandle"
                    :placeholder="placeholder">
          </el-input>
          <div class="searchIcon"
               @click="searchHandle">
            <i class="search el-icon-search"></i>
          </div>
        </div>
        <!--状态-->
        <div class="statusItem" v-show="statusList.length">
          状态:
          <el-select v-model="formData.status"
                     class="selectItem"
                     placeholder="选择">
            <el-option
              v-for="item in statusList"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <!--内容-->
    <div class="container-content">
      <!--button-->
      <div class="button-content" v-show="$slots.button">
        <slot name="button"></slot>
      </div>
      <!--table-->
      <div class="table-content" v-show="$slots.table">
        <slot name="table"></slot>
      </div>
      <!--分页-->
      <div class="page" v-show="$slots.page">
        <slot name="page"></slot>
      </div>
    </div>
  </div>
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
        formData: { // 搜索数据
          date: '',
          registrar: '',
          status: ''
        },
        dateTag: '', // 当前的时间索引
        tags: [ // 当前时间的类型标签, 主要是为了去除魔术字符串
          Symbol('今天'),
          Symbol('本周'),
          Symbol('本月')
        ]
      }
    },
    props: {
      /**
       * 搜索框占位符内容
       * */
      placeholder: {
        type: String,
        default: '请输入订单号查询'
      },
      /**
       * 状态列表
       * */
      statusList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      changeDate(res) {
        this.dateTag = res
        let tags = this.tags
        let now = new Date()
        let nowTime = now.getTime()
        if (res === tags[0]) {
          this.formData.date = [api.getDate(now), api.getDate(now)]
        } else if (res === tags[1]) {
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
  .content-wrapper{
    height: 100%;
    width: 100%;
    overflow-y: auto;
    padding: 30px 22px 10px 22px;
    background-color: #F8F8F8;
    /*搜索主体*/
    .search-content{
      width: 100%;
      padding: 22px 25px;
      border-radius: 5px;
      background-color: #fff;
      .top{}
      .flexBox{
        height: 36px;
        font-size: 14px;
        .radioGroup{
          float: left;
          height: 36px;
          display: flex;
          width: 180px;
          cursor: pointer;
          .item{
            box-sizing: border-box;
            height: 36px;
            line-height: 36px;
            width: 60px;
            text-align: center;
            border: 1px solid #EDEDED;
            &.active{
              border: 1px solid #F68C04;
              color: #F68C04;
            }
            &:first-child{
              border-radius: 5px 0 0 5px;
            }
            &:last-child{
              border-radius: 0 5px 5px 0;
            }
          }
        }
      }
    }
    /*内容主体*/
    .container-content{
      width: 100%;
      padding: 22px 25px;
      margin-top: 20px;
      border-radius: 5px;
      background-color: #fff;
      .button-content{
        margin-bottom: 22px;
      }
      .page{
        text-align: right;
        margin-top: 50px;
        margin-bottom: 13px;
      }
    }
  }
</style>
<style lang="scss">
  .flexBox{
    /*时间选择器样式*/
    .datePick-content{
      float: left;
      position: relative;
      height: 36px;
      width: 350px;
      .datePick{
        height: 36px;
        border: none;
        .el-range-input{
          box-sizing: border-box;
          height: 36px;
          width: 128px;
          color: #333;
          border-bottom: 1px solid #ececec;
        }
        .el-input__icon.el-range__icon.el-icon-date{
          display: none;
        }
      }
      .bf{
        position: absolute;
        left: 117px;
        top: 11px;
        color: #C5C5C5;
      }
      .af{
        position: absolute;
        right: 74px;
        top: 11px;
        color: #C5C5C5;
      }
    }
    /*状态选择器*/
    .statusItem{
      float: right;
      height: 36px;
      line-height: 36px;
      .selectItem{
        width: 100px;
        height: 36px;
        .el-input,.el-input__inner{
          box-sizing: border-box;
          width: 100px;
          height: 36px;
          color: #333;
          font-size: 14px;
        }
      }
    }
    /*搜索框*/
    .search-container{
      float: right;
      position: relative;
      height: 36px;
      width: 302px;
      margin-left: 20px;
      font-size: 0;
      .search-input{
        vertical-align: top;
        display: inline-block;
        height: 36px;
        width: 262px;
        .el-input__inner{
          height: 36px;
          border-radius: 4px 0 0 4px;
          border-right: 0;
        }
      }
      .searchIcon{
        display: inline-block;
        width: 40px;
        height: 36px;
        text-align: center;
        background: #F6890A;
        cursor: pointer;
        .search{
          display: inline-block;
          margin-top: 8px;
          color: #fff;
          font-size: 20px;
        }
      }
    }
  }
</style>
