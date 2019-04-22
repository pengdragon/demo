<template>
  <div class="content-wrapper">
    <div class="content-wrapper2">
      <div class="title">
        <span>消息提醒</span>
      </div>
      <div class="remin-box">
        <span class="remin-text">香港收货提醒</span>
        <el-switch
          v-model="value"
          @change="changeFun"
        >
        </el-switch>
        <div class="remin-text2">香港收获时，系统会自动向您推送相关消息</div>
      </div>
      <div class="remin-box">
        <span class="remin-text">深圳发货提醒</span>
        <el-switch
          v-model="value2"
          @change="changeFun2"
        >
        </el-switch>
        <div class="remin-text2">深圳发货时，系统会自动向您推送相关消息</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: false,
        value2: false,
        dataAll: {
          isreceMage: '',
          isshipMage: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      changeFun() {
        if (this.value) {
          this.dataAll.isreceMage = '香港收货提醒'
        } else {
          this.dataAll.isreceMage = ''
        }
        this.$axios.post('/user-centre/saveremind', this.dataAll).then((res) => {

        }).catch((error) => {
          console.log(error)
        })
      },
      changeFun2() {
        if (this.value2) {
          this.dataAll.isshipMage = '深圳发货提醒'
        } else {
          this.dataAll.isshipMage = ''
        }
        this.$axios.post('/user-centre/saveremind', this.dataAll).then((res) => {

        }).catch((error) => {
          console.log(error)
        })
      },
      getList() {
        this.$axios.post('/user-centre/messageremind').then((res) => {
          if (res.data.isreceMage === '香港收货提醒') {
            this.value = true
            this.dataAll.isreceMage = '香港收货提醒'
          } else {
            this.value = false
          }
          if (res.data.isshipMage === '深圳发货提醒') {
            this.value2 = true
            this.dataAll.isshipMage = '深圳发货提醒'
          } else {
            this.value2 = false
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper {
    box-sizing: border-box;
    padding: 10px 22px 0;
    background: #f8f8f8;
    height: 100%;
  }

  .content-wrapper2 {
    background: white;
    border-radius: 5px;
    padding-bottom: 10px;
  }

  .remin-box {
    margin: 12px;
    margin-top: 30px;
    margin-left: 50px;
  }

  .remin-text {
    font-size: 14px;
    color: #333;
  }

  .remin-text2 {
    font-size: 12px;
    color: #999;
    margin-top: 9px;
  }

  .title {
    color: #333;
    font-size: 16px;
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid #f3f3f3;
    margin: 12px;
  }

  .title span {
    margin-left: 17px;
  }
</style>
