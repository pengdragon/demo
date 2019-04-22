<template>
  <div>
    <div class="login">

      <div class="log-rt">
        <div class="password-login" v-if='login'>
          <h1 class="title2">账户登陆</h1>
          <div class="input-box">
            <img src="../../img/zhanghaoguanli-21.png" alt="">
            <input type="text" placeholder="请输入用户名" class="login-input" v-model="loginForm.username">
          </div>
          <div class="input-box">
            <img src="../../img/mima-4.png" alt="" style=" top: 10px;">
            <input type="password" placeholder="请输入密码" class="login-input" v-model="loginForm.password">
          </div>
          <div class="remanber-password">


            <div>
              <button class="login-btn" @click="handleLogin()">登陆</button>
            </div>
          </div>
          <div class="button-img">
            <!-- <span class="img-text">
                <img src="../../img/button_yellow.png" alt="">

            </span> -->
            <img src="../../img/saomadenglv.png" alt="" class="img-size" @click="changeType()">
            <!-- <p>扫码登陆更安全</p> -->
          </div>
        </div>
        <div class="erwei-login" v-else>
          <h1 class="title">扫码登陆</h1>
           <img :src="imgUrl" alt="" class="wximg">


          <div class="button-img">
            <!-- <span class="img-text">
                <img src="../../img/button_yellow.png" alt="">

            </span> -->
            <img src="../../img/button_computer .png" alt="" class="img-size" @click="changeType()">
            <!-- <p>在这用户密码登陆</p> -->
          </div>
        </div>
      </div>
    </div>
    <div>
      <!-- <img src="" alt=""> -->
    </div>
    <div class="bg-one">
      <template>
        <el-carousel>
          <el-carousel-item v-for="item in imgList" :key="item">
            <img :src="item" alt="">
          </el-carousel-item>
        </el-carousel>
      </template>
    </div>
    <div class="content">
      <div class="content-1">
        <div>
          <img src="../../img/xiadan2.png" alt=""> <span class="img-text">下单</span>
        </div>
        <div class="content-text" style="margin-top:18px;">登陆即读取之前的信息</div>
        <div class="content-text">减少二次填写输入</div>
        <div class="content-text">一键导入订单明细和备品明细，方便快捷</div>
      </div>
      <div class="content-2">
        <img src="../../img/xiadan.png" alt="">
      </div>
    </div>
    <div class="content2">
      <div class="content2-1">
        <div>
          <img src="../../img/shouhuo2.png" alt=""> <span class="img-text">收货</span>
        </div>
        <div class="content-text" style="margin-top:18px;">可设置提货时间</div>
        <div class="content-text">可随时查看物流进度和设置备注</div>
        <div class="content-text">一键选择订单，可随时设置提货数量</div>
      </div>
      <div class="content2-2">
        <img src="../../img/shouhuo.png" alt="">
      </div>
    </div>
    <div class="content">
      <div class="content-1">
        <div>
          <img src="../../img/fahuo2.png" alt=""> <span class="img-text">发货</span>
        </div>
        <div class="content-text" style="margin-top:18px;">发货包括派货</div>
        <div class="content-text">派货可选择自提/送货/快递/物流</div>
        <div class="content-text">一键导入订单，设置派货数量，确定发货明细</div>
      </div>
      <div class="content-2">
        <img src="../../img/fahuo.png" alt="">
      </div>
    </div>
    <div class="content2">
      <div class="content2-1">
        <div>
          <img src="../../img/wuliu2.png" alt=""> <span class="img-text">物流</span>
        </div>
        <div class="content-text" style="margin-top:18px;">可实时了解订单动态</div>
        <div class="content-text">订单位置，可随时关注订单进程</div>
        <div class="content-text">输入订单号，可查看所有的物流轨迹</div>
      </div>
      <div class="content2-2">
        <img src="../../img/wuliu.png" alt="">
      </div>
    </div>
    <div class="content">
      <div class="content-1">
        <div>
          <img src="../../img/baobiao2.png" alt=""> <span class="img-text">报表</span>
        </div>
        <div class="content-text" style="margin-top:18px;">可查看本月业务量/未结汇金额/未开票总金额</div>
        <div class="content-text">可随时了解已关注订单的最新状态</div>
        <div class="content-text">可预览执行中订单的当前近况</div>
      </div>
      <div class="content-2">
        <img src="../../img/baobiao.png" alt="">
      </div>
    </div>
  </div>

</template>

<script>
  import { Navbar, loginContent, loginFooter } from './components'
  import Cookies from 'js-cookie'

  export default {
    name: 'login',
    components: {
      Navbar,
      loginContent,
      loginFooter
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else {
          callback()
        }
      }
      return {
        imgList: [
          require('../../img/one.jpg'), require('../../img/four.gif'),
          require('../../img/two.jpg'), require('../../img/three.gif')
        ],
        login: true,
        isActive: true,
        username: '',
        passworld: '',
        imgUrl: '',
        uuId: '',
        result: '',
        sTin: '',
        remanberNum: '',
        remanberList: [],
        uuId2: '',
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }]
        },
        loading: false,
        pwdType: 'password'
      }
    },
    created() {
      this.uuId = this.uuid()

      this.time1()
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        // 获取表单数据

        this.loading = true
        this.$store.dispatch('LoginByUsername', this.loginForm).then((res) => {
          this.loading = false
          // if (res && res.status === 'error') {
          //   this.$message({
          //     type: 'warning',
          //     message: res.msg
          //   })
          //   return
          // }
          let permission = Cookies.get('permission')
          if (permission === 'A') {
            this.$router.push({ path: '/import/' })
          }
          if (permission === 'B') {
            this.$router.push({ path: '/export/' })
          }
          if (permission === 'C') {
            this.$router.push({ path: '/substitute/' })
          }
          if (permission === 'E') {
            this.$router.push({ path: '/fictitious/' })
          }
          if (permission === 'A,B,C,E') {
            this.$router.push({ path: '/import/' })
          }
        }).catch((err) => {
          this.loading = false
          console.log(err)
        })
      },
      time1() {
        if (!this.imgUrl) {
          this.$axios.get('/WX/callback/wxLoginQrcode?eventkey=forlogin_' + this.uuId)
            .then((response) => {
              if (!this.imgUrl) {
                this.imgUrl = response.qrcodeUrl
                this.uuId2 = response.eventkey
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      },
      time2() {
        this.sTin = setInterval(() => {
          this.$axios.get('/WX/callback/wxGetLoginResult?eventkey=' + this.uuId2)
            .then((response) => {
              this.result = response.data.result
            })
            .catch((error) => {
              console.log(error)
            })

          if (this.result.sessionId) {
            clearInterval(this.sTin)
            // clearInterval(this.sTot )
          }
        }, 2000)
      },
      async wxEwma() {
        await this.time1()
        await this.time2()
      },

      changeType() {
        if (this.login) {
          this.login = false
          this.isActive = false

          if (this.login === false) {
            this.wxEwma()
          }
        } else {
          this.login = true
          this.isActive = true
          clearInterval(this.sTin)
          //    clearInterval(this.sTot )
        }
      },

      uuid() {
        var s = []
        var hexDigits = '0123456789abcdef'
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = '4'
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
        s[8] = s[13] = s[18] = s[23] = '-'

        var uuid = s.join('')
        return uuid
      }
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  .input-box {
    position: relative;
  }

  .input-box img {
    position: absolute;
    left: 10px;
    top: 8px;
  }

  input {
    outline: none;
    background: #f5f6f7;
  }

  .content {
    height: 586px;
  }

  .content-1 {
    position: relative;
    top: 200px;
    margin-left: 105px;
    font-size: 14px;
    color: #777;
    float: left;
  }

  .content-2 {
    float: right;
    margin-right: 63px;
    position: relative;
    top: 40px;
  }

  .content2-1 {
    position: relative;
    top: 200px;
    margin-right: 105px;
    font-size: 14px;
    color: #777;
    float: right;
  }

  .content2-2 {
    float: left;
    margin-left: 63px;
    position: relative;
    top: 40px;
  }

  .content-text {
    margin-top: 7px;
  }

  .img-text {
    font-size: 17px;
    color: #555;
    position: relative;
    top: -30px;
    left: 10px;
  }

  .content2 {
    height: 586px;
    background: #f5f6f7;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;

    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }


  #login_container {
    width: 284px;
    position: absolute;

    margin: auto;

    top: 241px;
    left: 0;
    bottom: 0;
    z-index: 999;
  }

  .img-size {
    margin: 8px;
    cursor: pointer;
  }

  .img-text {

    img {
      position: relative;
      top: -40px;
    }

  }

  .button-img {
    position: absolute;
    top: 0;
    right: 0;

    p {
      position: relative;
      top: -71px;
      right: -38px;
      font-size: 14px;
      color: #df9d20;
      width: 120px;
    }
  }

  #box {
    position: relative;

    background-position: center;
    background-size: cover;
    position: relative;
    overflow: hidden;
  }

  .login {

    height: 380px;
    width: 350px;
    background: white;
    border-radius: 10px;
    position: absolute;

    margin: auto;
    top: 74px;

    right: 14rem;
    z-index: 999;
  }

  .log-lf img {
    height: 335px;
    position: relative;
    top: 28px;
    left: 46px;
  }

  .log-lf {
    float: left;
    width: 40%;
  }

  .log-rt {

  }

  .password-login {
    margin-left: 26px;
  }


  .title {
    margin-top: 27px;
    font-size: 22px;
    color: #333;
    margin-bottom: 60px;
    padding-left: 26px;
  }
  .title2 {
    margin-top: 27px;
    font-size: 22px;
    color: #333;
    margin-bottom: 80px;

  }
  .login-input {
    height: 38px;
    width: 300px;
    display: block;

    font-size: 18px;
    border: none;

    border-radius: 20px;
    margin-top: 20px;
    padding-left: 32px;

  }

  .remanber-password {

  }

  .forget-possword {
    color: #439fdd;
    margin-left: 20px;
    float: right;
  }

  .ivu-checkbox-wrapper {
    font-size: 14px !important;
  }

  .re-margin {
    margin-left: 10px;
  }

  .login-btn {
    height: 38px;
    width: 300px;
    border-radius: 34px;
    background: #0a9ffe;
    border: none;
    color: white;
    font-size: 17px;

    margin-top: 40px;
    outline: none;
    cursor: pointer;
  }

  .display {
    display: none;
  }

  .wximg {
    height: 200px;
    width: 200px;
    display: block;
    margin: 0 auto;
  }

  .logo-inmg {
    position: relative;
    top: 30px;
    left: 40px;
    height: 34px;
  }
</style>

<style>
  .el-carousel__container {
    height: 550px !important;
  }

  .el-carousel__container img {
    height: 550px;
  }
</style>
