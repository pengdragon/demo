<template>
  <div class="content-wrapper">
    <div class="logo-wrapper">
      <div class="logo-box">
        <img :src="require('@/assets/img/logo.png')" alt="富森LOGO" class="logo">
      </div>
    </div>
    <div class="company-msg">
      <img :src="avatar ? baseUrl + avatar : require('@/assets/img/testAvatr.png')"
           class="avatar"/>
      <div class="msg">
        <div class="tel">13356464678</div>
        <div class="companyName">{{name || cookieName}}</div>
      </div>
    </div>
    <el-popover
      placement="bottom"
      width="168"
      trigger="hover">
      <div class="complaint-detail">
        <div class="people">
          客服顾问: 强森
        </div>
        <div class="people-msg">
          客服热线:
          <div class="tel">
            <img :src="require('@/assets/img/telIcon.png')"
                 class="tel-icon">
            0755-89898988
          </div>
        </div>
      </div>
      <div slot="reference"
           class="complaint">
        <img :src="require('@/assets/img/link.png')"
             class="linkIcon">
        <span class="complaint-text">
          投诉建议
        </span>
      </div>
    </el-popover>
    <div class="closeIcon-wrapper" @click="logout">
      <img :src="require('@/assets/img/tuichu.png')"
           class="closeIcon"/>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import Cookies from 'js-cookie'
  export default {
    components: {
      Breadcrumb,
      Hamburger
    },
    data() {
      return {
        sites: [],
        activeIndex: 0,
        baseUrl: window.g.baseUrl,
        cookieName: Cookies.get('name')
      }
    },
    computed: {
      top() {
        return -this.activeIndex * 15 + 'px'
      },
      ...mapGetters([
        'sidebar',
        'avatar',
        'loginDate',
        'name',
        'company'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        Cookies.remove('sessionid')
        Cookies.remove('userName')
        this.$router.push('/login')
        // this.$store.dispatch('LogOut').then(() => {
        //   location.reload() // 为了重新实例化vue-router对象 避免bug
        // })
      }
    },
    mounted() {
      setInterval(_ => {
        if (this.activeIndex < this.sites.length) {
          this.activeIndex += 1
        } else {
          this.activeIndex = 0
        }
      }, 2000)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .content-wrapper{
    position: relative;
    width: 100%;
    height: 70px;
    background-color: #232F40;
    font-family: "Microsoft YaHei";
    /*图片*/
    .logo-wrapper{
      transition: all 1s linear;
      height: 69px;
      width: 208px;
      .logo-box{
        z-index: 1000;
        transition: all 1s linear;
        position: fixed;
        left: 0;
        top: 0;
        box-sizing: border-box;
        width: 208px;
        height: 69px;
        padding: 16px 26.5px 0;
        .logo{
          transition: all 1s linear;
          display: inline-block;
          width: 155px;
          height: 38px;
          margin: 0 auto;
        }
      }
    }
    /*头像等信息*/
    .company-msg{
      position: absolute;
      right: 270px;
      top: 18px;
      display: flex;
      align-items: center;
      height: 47px;
      .avatar{
        height: 47px;
        width: 47px;
        border-radius: 50%;
      }
      .msg{
        height: 47px;
        margin-left: 9px;
        color: #fff;
        .companyName{
          position: relative;
          height: 15px;
          line-height: 15px;
          font-size: 12px;
          padding-left: 10px;
          &:after{
            content: '';
            display: block;
            position: absolute;
            left: 0;
            top: 5px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #02DC92;
          }
        }
        .tel{
          height: 14px;
          margin-top: 7px;
          margin-bottom: 5px;
          font-size: 14px;
        }
      }
    }
    /*投诉*/
    .complaint{
      position: absolute;
      right: 82px;
      top: 29px;
      height: 26px;
      font-size: 14px;
      color: #B2BECA;
      cursor: pointer;
      .linkIcon{
        display: inline-block;
        width: 26px;
        height: 24px;
        margin-right: 5px;
        vertical-align: top;
      }
      .complaint-text{
        display: inline-block;
        box-sizing: border-box;
        height: 26px;
        padding-top: 6px;
      }
      &:after{
        content: '';
        display: block;
        position: absolute;
        right: -20px;
        top: 1px;
        height: 23px;
        border-right: 1px solid #B2BECA;
      }
    }
    /*退出*/
    .closeIcon-wrapper{
      position: absolute;
      right: 20px;
      top: 28px;
      padding: 2px;
      cursor: pointer;
      .closeIcon{
        width: 22px;
        height: 22px;
      }
    }
  }
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>
<style lang="scss">
  /*溢出样式*/
  .complaint-detail{
    padding: 7px 2px;
    cursor: pointer;
    font-size: 14px;
    .people{
      width: 100%;
      padding-bottom: 9px;
      border-bottom: 1px solid #F2F2F2;
    }
    .people-msg{
      padding-top: 9px;
      .tel{
        margin-top: 7px;
        font-size: 12px;
        color: #333;
        .tel-icon{
          width: 16px;
          height: 16px;
          margin-left: 5px;
          vertical-align: middle;
        }
      }
    }
  }
</style>

