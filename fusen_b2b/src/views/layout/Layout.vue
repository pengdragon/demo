<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened"
         class="drawer-bg"
         @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <div class="fixedHead"
           :class="{hidden: !$store.state.app.sidebar.opened}">
        <navbar></navbar>
        <tags-view></tags-view>
      </div>
      <app-main></app-main>
      <slot name="bottomFooter"></slot>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .main-container{
    /**padding-top: 153px;**/
    padding: 70px 0 0px 0;
  }
  .fixedHead{
    z-index: 1000;
    position: fixed;
    left: 0;
    top: 0;
    box-sizing: border-box;
    width: 100%;
    height: 104px;
    transition: all .2s linear;
  }
  .fixedFooter{
    z-index: 1000;
    position: fixed;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    height: 90px;
    padding-left: 208px;
    transition: all .2s linear;
    &.hidden{
      padding-left: 65px;
    }
  }
</style>
