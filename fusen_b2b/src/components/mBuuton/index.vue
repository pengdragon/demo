<template>
  <!--橙色圆角按钮-->
  <div class="my-button"
       @click="$emit('click')"
       :class="{active: active}">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'mButton',
    props: {
      active: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped lang="scss">
.my-button{
  transition: all .1s linear;
  display: inline-block;
  box-sizing: border-box;
  height: 36px;
  padding: 10px 24px;
  border: 1px solid #aaa;
  border-radius: 17px;
  font-size: 14px;
  color: #666;
  background-color: #fff;
  cursor: pointer;
  &.active{
    border: none;
    background-color: #f68909;
    border: 1px solid #f68909;
    color: #fff;
  }
  &:hover{
    border: 1px solid #f68909;
  }
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
</style>
