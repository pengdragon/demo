<template>
  <div class="menu-wrapper">
    <el-menu
      router
      default-active="2"
      class="menu-wrapper-content"
    >
      <div v-for="(item,i) in routes"
           :key="item.name"
           v-show="!item.hidden">
        <el-submenu v-if="item.children&&!item.hidenChild"
                    :class="{'active-list-title': activeRoute.includes('#/'+module+'/'+item.path) && !sidebar.opened}"
                    :index="'/'+module+'/'+item.path">
          <template slot="title">
            <!--扩展状态-->
            <div v-show="sidebar.opened">
              <img v-if="item.meta.imgIcon"
                   class="menu-item-img"
                   :src="require(`@/assets/sidebarImg/${activeRoute == '#/'+module+'/'+item.path ? item.meta.imgIcon + '_active' : item.meta.imgIcon}.png`)">
              <svg-icon v-else :icon-class="item.meta.icon"></svg-icon>
              <span>{{item.meta.title}}</span>
            </div>
            <!--折叠状态-->
            <div v-show="!sidebar.opened"
                 @mouseover="$set(item, 'houver', true)"
                 @mouseout="$set(item, 'houver', false)">
              <el-popover
                placement="right"
                width="100"
                trigger="hover">
                <!--遍历子路由-->
                <div class="child-content">
                  <div class="title">
                    {{item.meta.title}}
                    <i class="el-icon-arrow-down"></i>
                  </div>
                  <div v-for="child in item.children"
                       :key="child.name"
                       @click="$router.push(`/${module}/${item.path}/${child.path}`)"
                       v-show="!child.hidden"
                       class="childItem">
                    {{child.meta.title}}
                  </div>
                </div>
                <template slot="reference">
                  <img v-if="item.meta.imgIcon"
                       class="menu-item-img"
                       :src="require(`@/assets/sidebarImg/${
                       activeRoute.includes('#/'+module+'/'+item.path)?
                       item.meta.imgIcon + '_active':
                       item.houver?
                       item.meta.imgIcon + '_hover':
                       item.meta.imgIcon}.png`)">
                  <svg-icon v-else :icon-class="item.meta.icon"></svg-icon>
                </template>
              </el-popover>
            </div>
          </template>
          <!--下拉菜单-->
          <el-menu-item-group>
            <el-menu-item
              v-for="(child,c) in item.children"
              :key="c"
              v-show="!child.hidden && sidebar.opened"
              :class="{'active-title': activeRoute==='#/'+module+'/'+item.path+'/'+child.path}"
              :index="'/'+module+'/'+item.path+'/'+child.path">
              {{child.meta.title}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!--单项-->
        <el-menu-item
          :class="{'active-title': activeRoute==='#/'+module+'/'+item.path}"
          v-if="!item.children||item.hidenChild"
          @mouseover.native="$set(item, 'houver', true)"
          @mouseout.native="$set(item, 'houver', false)"
          :index="'/'+module+'/'+item.path">
          <template>
            <!--扩展状态-->
            <div v-show="sidebar.opened">
              <img v-if="item.meta.imgIcon"
                   class="menu-item-img"
                   :src="require(`@/assets/sidebarImg/${
                   activeRoute === '#/'+module+'/'+item.path?
                   item.meta.imgIcon + '_active':
                   item.meta.imgIcon}.png`)">
              <svg-icon v-else :icon-class="item.meta.icon"></svg-icon>
              <span slot="title"
                    v-show="sidebar.opened">
                {{item.meta.title}}
                <img :src="require('@/assets/sidebarImg/HOT.png')"
                     v-show="item.meta.hot"
                     class="hotImg">
              </span>
            </div>
            <!--折叠状态-->
            <div v-show="!sidebar.opened">
              <el-popover
                placement="right"
                width="100"
                trigger="hover">
                <div class="child-content">
                  <div class="title">
                    {{item.meta.title}}
                  </div>
                </div>
                <template slot="reference">
                  <img v-if="item.meta.imgIcon"
                       class="menu-item-img"
                       :src="require(`@/assets/sidebarImg/${
                       activeRoute === '#/'+module+'/'+item.path?
                       item.meta.imgIcon + '_active':
                       item.houver?
                       item.meta.imgIcon + '_hover':
                       item.meta.imgIcon}.png`)">
                  <svg-icon v-else :icon-class="item.meta.icon"></svg-icon>
                </template>
              </el-popover>
            </div>
          </template>
        </el-menu-item>
      </div>
      
    </el-menu>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      },
      module: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ])
    },
    data() {
      return {
        activeRoute: '',
        settingHover: false // 是否悬停在标账号管理签上
      }
    },
    watch: {
      $route() {
        this.activeRoute = location.hash
      }
    },
    created() {
      this.activeRoute = location.hash
    }
  }
</script>

<style scoped lang="scss">
  .menu-item-img{
    width: 19px;
    margin-right: 4px;
  }
  .hotImg{
    width: 38px;
    height: 15px;
    margin-left: 10px;
    margin-top: -3px;
  }
</style>

<style lang="scss">
  .el-menu-item-group__title{
    padding: 0;
  }
  .child-content{
    font-size: 14px;
    width: 100%;
    text-align: center;
    .title{
      font-weight: 600;
      height: 30px;
      line-height: 30px;
      color: #404040;
    }
    .childItem{
      width: 100%;
      height: 30px;
      line-height: 30px;
      color: #636363;
      cursor: pointer;
      &:hover{
        background-color: #E9F5FB;
      }
    }
  }
  /*收起时,多项下拉的侧边栏加激活效果*/
  .active-list-title{
    .el-submenu__title{
      border-left: 2px solid #FA8A0D;
      background-color: #FAF5EF;
      font-weight: 600;
      color: #333;
    }
  }
  .menu-wrapper{
    flex: 1;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .menu-wrapper-content{
    height: auto;
    box-sizing: border-box;
    margin-bottom: 120px;
  }
</style>
