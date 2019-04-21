<template>
  <div class="order">
    <!-- 弹窗背景层 -->
    <div id="popLayer"></div>
    <!-- 弹窗 -->
    <div id="popBox">
      <div class="close">
        <a href="javascript:void(0)" @click="closeBox()">关闭</a>
      </div>
      <div class="content">付款成功</div>
    </div>
    <van-address-list
      @add="immediateBuyAction"
      add-button-text="立即付款"
      v-model="chosenAddressId"
      :list="list"
    />
    <div class="orderList">
      <van-cell-group class="cart_item" v-for="(item,index) in order" :key="index">
        <img :src="item.img">
        <div class="item-content">
          <h3>{{item.name}}</h3>
          <p>￥{{item.price}}</p>
        </div>
      </van-cell-group>
      <!-- <el-button type="text" @click="open">点击打开 Message Box</el-button> -->
    </div>
  </div>
</template>

<script>
import { AddressList, SwipeCell, CellGroup } from "vant";
export default {
  components: {
    [AddressList.name]: AddressList,
    [SwipeCell.name]: SwipeCell,
    [CellGroup.name]: CellGroup
  },
  data() {
    return {
      chosenAddressId: "1",
      list: [],
      order: []
    };
  },
  methods: {
    /*点击弹出按钮*/
    popBox() {
      var popBox = document.getElementById("popBox");
      var popLayer = document.getElementById("popLayer");
      popBox.style.display = "block";
      popLayer.style.display = "block";
    },

    /*点击关闭按钮*/
    closeBox() {
      var popBox = document.getElementById("popBox");
      var popLayer = document.getElementById("popLayer");
      popBox.style.display = "none";
      popLayer.style.display = "none";
      this.$router.push({ path: "/discover" });
    },
    immediateBuyAction() {
      this.popBox();
      console.log(this.order);
      //   this.$alert("这是一段内容", "标题名称", {
      //     confirmButtonText: "确定",
      //     callback: action => {
      //       this.$message({
      //         type: "info",
      //         message: `action: ${action}`
      //       });
      //     }
      //   });
      this.$store.commit("order/addGoods", this.order);
    }
  },
  created() {
    console.log("父级数据", this.$parent);
    this.order = this.$parent.order;
    console.log("query", this.$route.query);
    this.list.push({
      id: "1",
      name: this.$route.query.name,
      tel: this.$route.query.tel,
      address: this.$route.query.addressDetail
    });
  }
};
</script>

<style scoped>
.order {
  position: relative;
  top: 0px;
  left: 0px;
  height: 618px;
  z-index: 102;
  background: white;
}
.orderList {
  position: absolute;
  left: 0;
  top: 66px;
  border: 1 solid #eee;
}
.cart_item {
  display: flex;
  padding: 10px;
}
img {
  width: 80px;
  height: 80px;
}
.item-content {
  flex: 1;
}
/*背景层*/
#popLayer {
  display: none;
  background-color: #b3b3b3;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  -moz-opacity: 0.8;
  opacity: 0.8;
  filter: alpha(opacity=80); /* 只支持IE6、7、8、9 */
}

/*弹出层*/
#popBox {
  display: none;
  background-color: #ffffff;
  z-index: 11;
  width: 200px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#popBox .close {
  text-align: right;
  margin-right: 5px;
  background-color: #f8f8f8;
}

/*关闭按钮*/
#popBox .close a {
  text-decoration: none;
  color: #2d2c3b;
}
#popBox .content {
  text-align: center;
  line-height: 200px;
}
</style>
