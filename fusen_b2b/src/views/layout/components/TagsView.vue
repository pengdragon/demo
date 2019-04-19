<template>
  <div class="tags-view-container"
       :class="{hidden: !sidebar.opened}">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag'
                   class="tags-view-item"
                   :class="isActive(tag)?'active':''"
                   v-for="(tag,i) in Array.from(visitedViews)"
                   :to="tag.fullPath"
                   :key="i"
                   @contextmenu.prevent.native="openMenu(tag,$event)">
        {{tag.title}}
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>
    </scroll-pane>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScrollPane from '@/components/ScrollPane'
import Cookie from 'js-cookie'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      moduleType: Cookie.get('permission')
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    ...mapGetters([
      'sidebar'
    ])
  },
  watch: {
    $route() {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
  },
  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isActive(route) {
      return route.fullPath === this.$route.fullPath
    },
    addViewTags() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      if (!tags) {
        return
      }
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el)
            break
          }
        }
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.fullPath)
          } else {
            if (this.moduleType === 'B') {
              this.$router.push('/export')
            } else if (this.moduleType === 'C') {
              this.$router.push('/substitute')
            } else if (this.moduleType === 'E') {
              this.$router.push('/fictitious')
            } else {
              this.$router.push('/')
            }
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.path)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },
    openMenu(tag, e) {
      this.visible = true
      this.selectedTag = tag
      this.left = e.clientX
      this.top = e.clientY
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  transition: margin .1s linear;
  margin-left: 208px;
  &.hidden{
    margin-left: 70px;
  }
  .tags-view-wrapper {
    background: #EEEEEE;
    height: 40px;
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 28px;
      line-height: 28px;
      border: 1px solid #d8dce5;
      text-align: center;
      border-bottom: 0;
      color: #848484;
      background: #F8F8F8;
      padding: 0 10px;
      font-size: 12px;
      margin-left: 20px;
      margin-top: 12px;
      &:first-of-type {
        margin-left: 22px;
      }
      &.active {
        background-color: #fff;
        color: #333;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      position: absolute;
      right: -9px;
      top: -9px;
      width: 18px;
      height: 18px;
      line-height: 20px;
      font-size: 10px;
      text-align: center;
      border-radius: 50%;
      background: #F8F8F8;
      color: #848484;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:hover{
        background: #F6890A;
        color: #fff;
      }
    }
    &.active{
      .el-icon-close{
        background-color: #fff;
        color: #333;
        &:hover{
          background: #F6890A;
          color: #fff;
        }
      }
    }
  }
}
</style>
