<template>
  <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
    <div id="address">
      <van-address-edit
        show-set-default="true"
        :area-list="areaList"
        show-postal
        show-delete
        show-search-result
        :search-result="searchResult"
        @save="btnSaveHandle"
        @delete="onDelete"
        @change-detail="onChangeDetail"
      />
    </div>
  </transition>
</template>

<script>
console.log("组件加载了");
import { AddressEdit } from "vant";

export default {
  components: {
    [AddressEdit.name]: AddressEdit
  },
  data() {
    return {
      areaList: {
        province_list: {
          110000: "福建省",
          120000: "天津市"
        },
        city_list: {
          110100: "莆田市",
          110200: "县",
          120100: "天津市",
          120200: "县"
        },
        county_list: {
          110101: "城厢区",
          110102: "福利区",
          110105: "仙游区"
        }
      },
      searchResult: []
    };
  },

  methods: {
    btnSaveHandle({ name, tel, addressDetail }) {
      // Toast("save");
      this.$router.push({
        path: "/cart/order",
        query: { name, tel, addressDetail }
      });
    },
    onDelete() {
      Toast("delete");
    },
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [
          {
            name: "福建莆田",
            address: "城厢区莆田学院"
          }
        ];
      } else {
        this.searchResult = [];
      }
    }
  }
};
</script>

<style scoped>
#address {
  width: 100%;
  height: 667px;
  z-index: 1001;
  background: white;
  position: relative;
}
</style>
