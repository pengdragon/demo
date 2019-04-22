<template>
  <div class="layout-content">
    <!--顶部控件-->
    <div class="layout-top" v-show="$slots.top">
      <slot name="top"></slot>
    </div>
    <!--表单信息1-->
    <div class="layout-item" v-show="$slots.msg1">
      <slot name="msg1"></slot>
    </div>
    <!--表单信息2-->
    <div class="layout-item" v-show="$slots.msg2">
      <slot name="msg2"></slot>
    </div>
    <!--表单信息3-->
    <div class="layout-item" v-show="$slots.msg3">
      <slot name="msg3"></slot>
    </div>
    <!--按钮-->
    <div class="layout-button" v-show="$slots.button">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'detailBaseLayout'
  }
</script>

<style scoped lang="scss">
.layout-content{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 25px 20px;
  overflow-y: auto;
  background-color: #F8F8F8;
  .layout-top{
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  }
  /*表单*/
  .layout-item{
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 20px 24px;
    margin-bottom: 20px;
    border-radius: 5px;
    background-color: #fff;
  }
  /*按钮*/
  .layout-button{
    position: relative;
    width: 100%;
  }
}
</style>
