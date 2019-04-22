<template>
  <baseLyout>
    <div slot="top">
      <div class="content-wrapper">
        <div class="content-wrapper3">
          <div class="title">
            <span>修改密码</span>
          </div>
        </div>
        <div class="content-wrapper2 content-box">
          <div style="overflow: hidden;">
            <div class="input-box">
              <span class="change-rt">用户名</span>
              <el-input v-model="name"></el-input>
            </div>
            <div class="input-box">
              <span class="change-rt">原密码</span>
              <el-input v-model="oldpd" placeholder="请输入原密码" type="password"></el-input>
            </div>
            <div class="input-box">
              <span class="change-rt">新密码</span>
              <el-input v-model="newpd" placeholder="请输入新密码" type="password"></el-input>
            </div>
            <div class="input-box">
              <span class="change-rt">确认新密码</span>
              <el-input v-model="newpd2" placeholder="请输入新密码" type="password"></el-input>
            </div>
          </div>
          <div class="input-box2">
            <el-button type="success" size="medium" @click="sub()" :disabled="disabled">确认修改</el-button>
          </div>
        </div>
      </div>


    </div>
  </baseLyout>
</template>

<script>
  import Cookies from 'js-cookie'
  import baseLyout from '@/components/detailsBaseLayout'

  export default {
    data() {
      return {
        name: '',
        oldpd: '',
        newpd: '',
        newpd2: '',
        disabled: true
      }
    },
    created() {
      this.name = Cookies.get('name')
    },
    methods: {

      sub() {
        if (this.newpd === this.newpd2) {
          this.$axios.get('/user-centre/updatepassword?password=' + this.newpd + '&rawpassword=' + this.oldpd).then((res) => {

          }).catch((error) => {
            console.log(error)
          })
        } else {
          alert('两次密码不一致')
          return
        }
      },
      newpdFun() {
        console.log(this.newpd2)
      }
    },
    components: {
      baseLyout

    },
    watch: {
      'newpd2': {
        deep: true,
        handler: function(newVal, oldVal) {
          // code
          if (newVal) {
            this.disabled = false
          } else {
            this.disabled = true
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper {
    width: 100%;
    background: white;
    height: 300px;
    border-radius: 5px;
  }

  .content-wrapper2 {
    padding-top: 10px;
    width: 420px;

  }

  .change-rt {
    margin-right: 10px;
    font-size: 14px;
    color: #666;
  }

  .content-box {


    height: 200px;
  }

  .input-box {
    margin-bottom: 10px;
    float: right;
  }

  .input-box2 {
    position: relative;
    top: 10px;
    width: 135px;
    margin: 0 auto;
    height: 100px;

  }

  .title {
    color: #333;
    font-size: 16px;
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid #f3f3f3;
    margin: 8px;
  }

  .title span {
    margin-left: 12px;
  }
</style>
