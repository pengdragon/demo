<template>
  <el-table :data="tabData"
            ref="tabMain"
            @cell-click="getCellMsg"
            @cell-dblclick="dbGetCellMsg"
            @selection-change="getSelectChange"
            :style="{height:tabHeight,width:'100%'}"
            :height="tabHeight"
            :id = "tableId"
            :border="border">

    <el-table-column v-if="showSelection"
                     type="selection"
                     width="55" align="center"></el-table-column>
    <el-table-column v-if="showIndex"
                     type="index"
                     label="序号"
                     :class-name="showPointer?'showPointer':''"
                     align="center" width="60"></el-table-column>
    <el-table-column
      v-for="item in tabTagData"
      :key="item.label"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      :class-name="showPointer?'showPointer':''"
      align="center">
      <template slot-scope="prop">
        <div v-if="emptyHandle">
          {{prop.row[item.prop]?prop.row[item.prop]:(parseInt(prop.row[item.prop])!==0)?'-':prop.row[item.prop]}}
        </div>
        <!--商机列表页面点击跳转-->
        <div v-else-if="item.openJump"
             class="nameContent"
             @click.stop="chanceDetailJump(prop.row)">
          {{prop.row[item.prop]}}
        </div>
        <div v-else-if="item.type === 'input'">
          <el-input type="text" v-model="prop.row[item.prop]"></el-input>
        </div>
        <div v-else-if="item.type === 'number'">
          <el-input type="number" v-model="prop.row[item.prop]"></el-input>
        </div>
        <div v-else>
          {{prop.row[item.prop]}}
        </div>
      </template>
    </el-table-column>
    <el-table-column v-if="showHandle" label="操作" align="center">
      <template slot-scope="prop">
        <el-button type="text" size="small" @click.stop="deleteItem(prop.$index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props: {
      tabData: {
        type: Array,
        required: true
      },
      tabTagData: {
        type: Array,
        required: true
      },
      showSelection: {
        type: Boolean,
        default: false
      },
      showIndex: {
        type: Boolean,
        default: true
      },
      showHandle: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: true
      },
      tabHeight: {
        type: [String, Number],
        default: 'auto'
      },
      tableId: {
        type: [String],
        default: ''
      },
      showPointer: {
        type: Boolean,
        default: true
      },
      openClick: {
        type: Boolean,
        default: false
      },
      openDbClick: {
        type: Boolean,
        default: false
      },
      emptyHandle: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      // doLayout
      this.$refs.tabMain.doLayout()
    },
    methods: {
      getCellMsg(row, column, cell, event) { // 点击某一项,实现删除操作
        if (!this.openClick) { return }
        /*
        * @参数
        * row 代表该行数据
        * column 代表改列数据
        * cell 代表点击项的DOM
        * event 代表事件对象
        * */
        // 父组件需对本组件绑定clickCell事件
        this.$emit('clickCell', row)
      },
      dbGetCellMsg(row, column, cell, event) {
        if (!this.openDbClick) { return }
        this.$emit('dbClickCell', row)
      },
      getSelectChange(selection) { // 获取选中项JSON
        if (!this.showSelection) { return }
        // 父组件需对本组件绑定getSelectResult事件
        this.$emit('getSelectResult', selection)
      },
      deleteItem(index) { // 获取对应项索引
        this.$confirm(`是否删除序号为 ${index + 1} 的项目?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 父组件需对本组件绑定deleteItem事件
          this.$emit('deleteItem', index)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      chanceDetailJump(row) {
        this.$emit('chanceDetailJump', row)
      }
    }
  }
</script>

<style lang="scss">
.showPointer{
  cursor: pointer;
}
.nameContent{
  color: dodgerblue;
  &:hover{
    text-decoration: underline;
  }
}
</style>
