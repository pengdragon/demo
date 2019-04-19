<template>
  <div>
    <el-steps  direction="vertical"
               :active="propsActiveIndex">
      <el-step v-for="(item,i) in titleArr"
               :key="i"
               :title="item">
        <div slot="description"
             v-show="(i+1)<=propsActiveIndex"
             class="stepContent">
          <slot :name="'step'+(i+1)"></slot>
          <div class="stepContent-btn">
            <el-button v-if="(i+1)===propsActiveIndex&&(i+1)!==titleArr.length"
                       @click="nextStep"
                       type="primary">下一步</el-button>
            <el-button v-if="(i+1)===titleArr.length && hideContrl"
                       @click="saveHandle('保存')"
                       :loading="saveBtnState"
                       type="primary">保存</el-button>
            <el-button v-if="(i+1)===titleArr.length && hideContrl"
                       :loading="saveBtnState"
                       @click="saveHandle('提交')"
                       type="primary">提交</el-button>
          </div>
        </div>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
  export default {
    props: {
      titleArr: { // 外部数据
        type: Array,
        default() {
          return []
        }
      },
      propsActiveIndex: { // 当前激活项
        type: Number,
        default: 1
      },
      /**
       * 隐藏保存提价按钮
       * */
      hideContrl: {
        type: Boolean,
        default: true
      },
      /**
       * 按钮加载状态
       * */
      saveBtnState: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      /**
       * 触发父组件下一步事件,并传入当前步数
       * */
      nextStep() {
        this.$emit('nextStepHandle', this.propsActiveIndex)
      },
      saveHandle(type) {
        // 触发父组件事件
        this.$emit('saveHandle', type)
      }
    }
  }
</script>

<style scoped lang="scss">
.stepContent{
  min-height: 100px;
  padding: 20px;
  color: #000;
}
.stepContent-btn{
  text-align: right;
}
</style>
