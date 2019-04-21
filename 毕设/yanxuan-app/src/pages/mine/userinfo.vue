<template>
  <div class="personal">
    <div class="userinfo">
      <div class="user">
        <div class="left">
          <img src="http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png" alt>
        </div>
        <div class="right">
          <p>{{userName}}</p>
          <span>普通用户</span>
        </div>
      </div>
      <div class="erweima">
        <img
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553506107860&di=02c22073bf8c58a066a4cac2ca0ee0a0&imgtype=0&src=http%3A%2F%2Fcli.clewm.net%2Ffile%2F2014%2F12%2F10%2F10febbdfabe543c7dd27d74fb4f411f3.png"
          alt
        >
      </div>
    </div>
    <div class="tool">
      <div class="order child" @click="myOrderAction">我的订单</div>
      <div class="order child" @click="btnCloseAction">退出当前用户</div>
      <div class="order child" @click="noFindAction">售后服务</div>
      <div class="order child" @click="noFindAction">邀请返利</div>
      <div class="order child" @click="noFindAction">优惠券</div>
      <div class="order child" @click="noFindAction">我的红包</div>
      <div class="order child" @click="noFindAction">优先购</div>
      <div class="order child" @click="noFindAction">礼品卡</div>
      <div class="order child" @click="noFindAction">积分中心</div>
      <div class="order child" @click="noFindAction">会员俱乐部</div>
      <div class="order child" @click="noFindAction">地址管理</div>
      <div class="order child" @click="noFindAction">账号安全</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
console.log(mapState);
export default {
  data() {
    return {
      userName: ""
    };
  },
  methods: {
    myOrderAction() {
      this.$router.push({ path: "/discover" });
    },
    btnCloseAction() {
      console.log(7);
      localStorage.removeItem("userToken");
      // document.location.reload();
      this.$router.push({ path: "/home" });
    },
    noFindAction() {
      this.$router.push({ path: "/mine/noFind" });
    }
  },
  created() {
    this.userName = localStorage.getItem("username");
  }
};
</script>

<style scoped>
.tool {
  display: flex;
  flex-wrap: wrap;
}
.tool .order {
  width: 125px;
  height: 100px;
  border-bottom: 1px solid #eee;
  text-align: center;
  line-height: 100px;
}
.tool .child:nth-child(2n) {
  box-sizing: border-box;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}
.userinfo {
  display: flex;
  flex-direction: row;
  height: 130px;
  background: pink;
  box-sizing: border-box;
}
.erweima {
  width: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
}
.erweima img {
  height: 70px;
  width: 70px;
}
.user {
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.left {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 30px;
}
.left img {
  height: 70px;
  width: 70px;
}
.right {
  margin-left: 10px;
  flex: 1;
}
.right p {
  margin-bottom: 10px;
}
</style>


