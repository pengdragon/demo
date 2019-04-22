<template>
  <div class="tmpContent">
    <el-autocomplete
      class="inline-input"
      v-model="val"
      :fetch-suggestions="todoListFun"
      placeholder="公司名称"
      @select="handleSelect">
    </el-autocomplete>
    <i class="el-icon-more moreIcon"></i>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        val: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Number],
        default: '',
        required: true
      },
      todoList: {
        type: Array,
        default: ''
      }
    },
    watch: {
      val(v) {
        this.$emit('linkResult', v)
      }
    },
    mounted() {
      if (this.value) {
        this.val = this.value
      }
    },
    methods: {
      todoListFun(queryString, cb) {
        let todoList = this.todoList
        let results = queryString ? todoList.filter((item) => {
          return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }) : todoList
        cb(results)
      },
      handleSelect(item) {
        this.$emit('selectItem', item)
      }
    }
  }
</script>

<style scoped lang="scss">
  .tmpContent{
    position: relative;
    .inline-input{
      width: 100%;
      z-index: 5;
      background: transparent;
    }
    .moreIcon{
      z-index: 2;
      position: absolute;
      right: 5px;
      top: 13px;
    }
  }
</style>
<style lang="scss">
  .tmpContent{
    .inline-input{
      input{
        background-color: transparent;
      }
    }
  }
</style>
