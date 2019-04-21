<template>
  <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
    <div>
      <div id="category" class="page">
        <!-- 头部 -->
        <cg-header/>
        <div class="category-content">
          <!-- 侧边栏 -->
          <cg-menu/>
          <!-- 列表 -->
          <cg-menu-list/>
        </div>
      </div>
      <router-view/>
    </div>
  </transition>
</template>

<script>
import cgHeader from "@components/category/cg-header";
import cgMenu from "@components/category/cg-menu";
import cgMenuList from "@components/category/cg-menu-list";
export default {
  components: {
    cgHeader,
    cgMenu,
    cgMenuList
  }
};
</script>

<style lang="scss" scoped>
.category-content {
  width: 100%;
  position: absolute;
  top: 44px;
  left: 0;
  bottom: 0;
  display: flex;
  .category-menu {
    width: 80px;
    height: 100%;
    overflow: hidden;
  }
  .category-menu-list {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
}
.zoomOutUp,
.bounceInLeft,
.jello {
  animation-duration: 1000ms;
}
</style>

