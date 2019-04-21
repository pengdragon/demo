<template>
  <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
    <div id="cart" class="page">
      <router-view></router-view>
      <header class="cart-header border-bottom">购物车</header>

      <scroller class="cart-content">
        <van-swipe-cell v-for="(item,index) in cartList" :key="item.id" :right-width="65">
          <van-cell-group class="cart-item">
            <input type="checkbox" :checked="item.selected" @input="selectItem($event, item,index)">
            <img :src="item.img">
            <div class="item-content">
              <h3>{{item.name}}</h3>
              <p>{{item.price}}</p>
            </div>
            <div class="item-handler">
              <van-stepper disable-input :value="item.count" @input="handleInput($event, item)"/>
            </div>
          </van-cell-group>
          <!-- <span slot="right" @click="handleRemove(item)">删除</span> -->
        </van-swipe-cell>
      </scroller>

      <van-submit-bar class="border-top" :price="count" button-text="提交订单" @submit="onSubmit">
        <!-- <van-checkbox v-model="checked">全选</van-checkbox> -->
        <!-- <span slot="tip">
          你的收货地址不支持同城送,
          <span>修改地址</span>
        </span>-->
      </van-submit-bar>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import { SwipeCell, CellGroup, Cell, Stepper, SubmitBar } from "vant";
export default {
  data() {
    return {
      order: [],
      newArr: [],
      test: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]
    };
  },
  components: {
    [SwipeCell.name]: SwipeCell,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Stepper.name]: Stepper,
    [SubmitBar.name]: SubmitBar
  },
  computed: {
    ...mapState({
      cartList: state => state.cart.cartList
    }),
    count() {
      let tmp = 0;
      this.cartList.forEach(item => {
        if (item.selected) {
          tmp += item.price * item.count;
        }
      });
      //价格单位为：分
      return tmp * 100;
    }
  },

  methods: {
    handleInput(count, item) {
      if (count == 0) {
        return;
      }
      //修改购物车中的商品数据
      this.$store.commit("cart/setCount", {
        item,
        count
      });
    },
    selectItem(ev, obj, index) {
      //选中商品的点击事件
      // 将勾选中的数据提取出来
      console.log(index);
      console.log(ev.target.checked);
      if (ev.target.checked) {
        this.cartList[index].selected = true;
      }
      if (!ev.target.checked) {
        this.cartList[index].selected = false;
      }

      // if (ev.target.checked) {
      //   this.order.push(obj);
      // }
      // if (!ev.target.checked) {
      //   var length = this.order.length;
      //   for (var i = 0; i < length; i++) {
      //     if (this.order[i].count == obj.count) {
      //       console.log("删除前", this.order);
      //       this.order.splice(i, 1);
      //       console.log("删除后", this.order);
      //     }
      //   }
      // }
      console.log(obj);
      //console.log(ev.target.checked); //true  false
      //console.log(obj.selected);
      this.$store.commit("cart/selectGoods", obj);
    },
    handleRemove(item) {
      //从购物车中删除商品
      this.$store.commit("cart/removeGoods", item);
    },
    onSubmit() {
      //结算点击事件
      this.order = this.cartList.filter(item => {
        return item.selected;
      });
      console.log(this.order);
      console.log(666);
      this.$router.push({ path: "/cart/addresseidt" });
    }
  },
  created() {
    var arr = this.test.filter(item => {
      return item.id !== 1;
    });
    console.log(arr);
    if (localStorage.getItem("userToken")) {
      this.$store.dispatch("cart/getGoods");
    }
  }
};
</script>

<style lang="scss">
#cart .cart-header {
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
#cart .cart-content {
  width: 100%;
  position: absolute;
  top: 44px;
  bottom: 50px;
  left: 0;
  overflow: hidden;
  .cart-item {
    display: flex;
    padding: 10px;
    img {
      width: 80px;
      height: 80px;
    }
    .item-content {
      flex: 1;
    }
    .item-handler {
      flex: 1;
    }
  }
}
#cart .van-submit-bar {
  position: absolute;
}
#cart .van-submit-bar .van-button {
  background: #b4282d;
}
.van-button--danger {
  border: none;
}
#cart .van-submit-bar__price {
  color: #b4282d;
}
</style>

