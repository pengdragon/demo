<template>
  <el-table :data="formatData"
            :row-style="showRow"
            v-bind="$attrs">
    <el-table-column v-if="columns.length===0" width="150" header-align="center">
      <template slot-scope="scope">
        <!--渲染间距-->
        <span v-for="space in scope.row._level" :key="space"
              class="ms-tree-space"></span>
        <!--+/-图标操作-->
        <span class="tree-ctrl"
              v-if="iconShow(0,scope.row)"
              @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        {{scope.$index}}
      </template>
    </el-table-column>
    <el-table-column v-else
                     v-for="(column, index) in columns" :key="column.value"
                     :label="column.text" :width="column.width" header-align="center" :align="index!==0?'center':'left'">
      <template slot-scope="scope">
        <span v-if="index === 0"
              v-for="space in scope.row._level" :key="space"
              class="ms-tree-space"></span>
        <span class="tree-ctrl"
              v-if="iconShow(index,scope.row)"
              @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        {{scope.row[column.value]}}
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from './eval'
export default {
  name: 'treeTable',
  data() {
    return {
      formatData: []
    }
  },
  props: {
    tabData: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    let handleData = (v) => {
      let tmp = v
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      this.formatData = func.apply(null, args)
    }
    handleData(this.tabData)
    this.$watch('tabData', handleData, {
      deep: true
    })
  },
  methods: {
    // 是否展示行数据,定制table行样式
    showRow: function(row) {
      // 判断当前是否存在父节点,无则展开,有则进一步判断
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      // 返回行样式列表
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示,判断函数
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>
