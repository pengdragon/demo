<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      class="sidebar-menu"
    >
      <div class="choose-wrapper" v-if="permission==='A,B,C,E'">
        <el-popover
          placement="right"
          width="200"
          trigger="click">
          <p class="index" :class="{'active-index': title===modules[2]}" @click="toFictitious();">全程供应链</p>
          <p class="index" :class="{'active-index': title===modules[0]}" @click="toImport()">进口业务</p>
          <p class="index" :class="{'active-index': title===modules[1]}" @click="toExport()">出口业务</p>
          <p class="index" :class="{'active-index': title===modules[3]}" @click="toSubstitute()">仓储业务</p>
          <div class="title-top"
               :class="{hiddenHandle: !sidebar.opened}"
               slot="reference">
            <div class="title-text"
                 v-show="sidebar.opened">
              {{title}}
            </div>
            <img :src="require('@/assets/img/qiehuan.png')"
                 class="qiehuan"/>
          </div>
        </el-popover>
      </div>
      <sidebar-item :routes="routes"
                    :module="module"></sidebar-item>
      <div class="extendItem"
           :style="{width: sidebar.opened ? '208px' : '70px'}"
           @click="openMenu">
        <img :src="require('@/assets/sidebarImg/quanpingshouqi.png')"
             class="extend">
        {{sidebar.opened ? '收起侧边栏' : ''}}
      </div>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      modules: ['进口业务', '出口业务', '全程供应链', '仓储业务'],
      title: '',
      module: 'import',
      routes: [],
      permission: Cookies.get('permission')
    }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers', // 存储于vuex的当前路由列表
      'sidebar'
    ]),
    isCollapse() {
      // 收起菜单
      return !this.sidebar.opened
    }
  },
  created() {
    this.$store.dispatch('GenerateRoutes', [], { root: true })
    let type = Cookies.get('modelType') || location.hash.split('/')[1]
    Cookies.set('modelType', type)
    let permission = Cookies.get('permission')
    let permission_routersIndex = 0
    if (permission === 'A') {
      this.module = 'import'
      permission_routersIndex = 0
      this.title = this.modules[0]
    }
    if (permission === 'B') {
      permission_routersIndex = 1
      this.module = 'export'
      this.title = this.modules[1]
    }
    if (permission === 'C') {
      permission_routersIndex = 3
      this.module = 'substitute'
      this.title = this.modules[3]
    }
    if (permission === 'E') {
      permission_routersIndex = 2
      this.module = 'fictitious'
      this.title = this.modules[2]
    }
    if (permission === 'A,B,C,E') {
      this.module = 'import'
      permission_routersIndex = 0
      this.title = this.modules[0]
    }
    this.routes = this.permission_routers[permission_routersIndex].children
  },
  methods: {
    toImport() {
      this.title = this.modules[0]
      this.routes = this.permission_routers[0].children
      this.module = 'import'
      Cookies.set('modelType', 'import')
      // 清空标签
      this.$store.dispatch('delAllViews')
      this.$router.push('/import/')
    },
    toExport() {
      this.title = this.modules[1]
      this.routes = this.permission_routers[1].children
      this.module = 'export'
      Cookies.set('modelType', 'export')
      // 清空标签
      this.$store.dispatch('delAllViews')
      this.$router.push('/export/')
    },
    toFictitious() {
      this.title = this.modules[2]
      this.routes = this.permission_routers[2].children
      this.module = 'fictitious'
      Cookies.set('modelType', 'fictitious')
      // 清空标签
      this.$store.dispatch('delAllViews')
      this.$router.push('/fictitious/')
    },
    toSubstitute() {
      this.title = this.modules[3]
      this.routes = this.permission_routers[3].children
      this.module = 'substitute'
      Cookies.set('modelType', 'substitute')
      // 清空标签
      this.$store.dispatch('delAllViews')
      this.$router.push('/substitute/')
    },
    openMenu() {
      this.$store.dispatch('ToggleSideBar')
    }
  }
}
</script>

<style scoped lang="scss">
  /*底部扩展项*/
  .extendItem{
    z-index: 222;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 12px;
    background: #F7F7F7;
    cursor: pointer;
    &:hover{
      background-color: #E9F5FB;
    }
    .extend{
      margin-right: 5px;
    }
  }
  .sidebar-menu{
    display: flex;
    flex-direction: column;
    width: 208px;
    height: 100%;
    overflow: hidden;
    font-family: "Microsoft YaHei";
    background-color: #fff;
  }
  .choose-wrapper{
    flex: 0 0 104px;
    box-sizing: border-box;
    padding-top: 26px;
    border-bottom: 1px solid #F7F6F4;
    .title-top{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 45px;
      width: 162px;
      background-color: #F6890A;
      border-radius: 0 20px 20px 0;
      cursor: pointer;
      .title-text{
        height: 45px;
        line-height: 45px;
        padding-left: 20px;
        font-size: 18px;
        color: #fff;
      }
      .qiehuan{
        width: 27px;
        height: 15px;
        margin-right: 15px;
      }
      &.hiddenHandle{
        width: 60px;
        .qiehuan{
          margin-left: 15px;
        }
      }
    }
  }
  .index{
    margin: 0;
    padding: 10px;
    border-bottom: 1px solid rgb(232,232,232);
    font-size: 16px;
    cursor: pointer;
  }
  .index:hover{
    background: rgb(232,232,232);
  }
  .active-index{
    color: #01B8E2;
  }
  .el-popover{
    padding: 0;
  }
  .el-button--text{
    color: white;
  }
  ::-webkit-scrollbar-button {
    width: 6px !important;
    height: 25%;
  }
  ::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background: #ccc;
  }
  ::-webkit-scrollbar-track {
    background-color: #E9F5FB;
  }
</style>
