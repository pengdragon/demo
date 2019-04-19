<template>
  <div class="content-wrapper">
    <Navbar></Navbar>
    <div class="content">
      <img src="/src/assets/img/registerBG.jpg" class="img" alt="">
      <div class="form-wrapper">
        <div class="backLogin" @click="$router.push('/login')">返回登录页面</div>
        <div class="loginTitle">注册账号</div>
        <el-form class="form-content">
          <el-form-item>
            <el-input placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item>
              <el-input placeholder="请输入短信验证码" class="checkInput"></el-input>
              <el-button class="checkMsg" type="primary">短信验证码</el-button>
          </el-form-item>
          <el-form-item>
            <el-input type="password" placeholder="设置密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" placeholder="确认密码"></el-input>
          </el-form-item>
          <el-button type="primary" class="resisterBtn">注册</el-button>
          <div class="bottomAgreement">
            <el-checkbox v-model="checked">
              我已阅读并同意
              <span style="color: #498CF8;">《富森服务协议》</span>
            </el-checkbox>
            <span style="color: #498CF8;">已有账号登录</span>
          </div>
        </el-form>
      </div>
    </div>
    <loginFooter></loginFooter>
  </div>
</template>

<script>
  // todo 未添加验证及验证码倒秒
  import { Navbar, loginFooter } from '../login/components'
  export default {
    data() {
      return {
        checked: ''
      }
    },
    components: {
      Navbar,
      loginFooter
    }
  }
</script>

<style scoped lang="scss">
.content-wrapper{
  width: 100%;
  .content{
    position: relative;
    width: 100%;
    font-size: 0;
    .img{
      width: 100%;
      height: 760px;
    }
    .form-wrapper{
      position: absolute;
      top: 15vh;
      right: 300px;
      width: 450px;
      background: #fff;
      .backLogin{
        margin: 15px 0 0 20px;
        font-size: 14px;
        color: #999999;
        cursor: pointer;
        &:hover{
          color: #498CF8;
        }
      }
      .loginTitle{
        width: 100px;
        margin: 20px auto 40px;
        font-size: 18px;
        color: #498CF8;
      }
      .form-content{
        padding: 0 60px;
      }
      .checkInput{
        width: 213px;
      }
      .checkMsg{}
      .resisterBtn{
        width: 100%;
      }
    }
    .bottomAgreement{
      margin: 15px 0 20px;
    }
  }
}
</style>

