<template>
  <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
    <div id="discover" class="page">
      <header class="discover-header border-bottom">我的订单</header>
      <ul class="order">
        <li v-for="item in  tabsData" :key="index">
          <img :src="item.img" alt>
          <h3>{{item.name}}</h3>
          <div>￥{{item.price}}</div>
          <p>已付款</p>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      selectIndex: 0
    };
  },
  computed: {
    ...mapState({
      tabsData: state => state.order.orderList
    })
  },
  created() {},
  methods: {
    selectTabAction(index) {
      if (index == this.selectIndex) {
        return;
      }
      // 修改选中的下标
      this.selectIndex = index;
      // 获得id
      let { tabId } = this.tabsData[index];
      if (tabId == 7) {
        //请求晒单数据
      } else {
        // 请求数据
        this.$store.dispatch("discover/getDiscoverList", tabId);
      }
    }
  },
  created() {
    // 请求头部的tab数据
    // this.$store.dispatch("discover/getTabs");
    // 请求推荐列表数据
    // this.$store.dispatch("discover/getDiscoverList");
  }
};
</script>

<style lang="scss" scoped>
.order {
  position: absolute;
  top: 44px;
  li {
    display: flex;
    width: 375px;
    justify-content: space-around;
    align-items: center;
    img {
      width: 80px;
      height: 80px;
      border: 1px solid #eee;
    }
    h3 {
      width: 180px;
    }
    div {
      color: red;
    }
    p {
      color: #eee;
      height: 20px;
    }
  }
}
.discover-header {
  width: 100%;
  height: 44px;
  position: absolute;
  top: 0;
  left: 0;
  font-size: 16px;
  font-weight: bold;
  color: #b4282d;
  text-align: center;
  line-height: 44px;
}
</style>

