<template>
    <div>
      <el-table :data="list"
                :style="{width: '100%',height: tabHeight}"
                @cell-click="getCellMsg"
                @cell-dblclick="dbGetCellMsg"
                @selection-change="getSelectChange"
                :row-class-name="rowClassHandle"
                ref="tabMain"
                class="inputTab-content"
                row-key="itemId"
                :border="border">
        <el-table-column v-if="showSelection"
                         type="selection"
                         width="55" align="center"></el-table-column>
        <el-table-column v-if="showIndex"
                         type="index"
                         label="序号"
                         :class-name="showPointer?'showPointer':''"
                         align="center" width="60">
        </el-table-column>
        <el-table-column v-for="(item,z) in tabTagData" :key="item.prop"
                         :label="item.label"
                         :width="item.width"
                         :class-name="(showPointer?'showPointer ':' ')+item.prop"
                         :prop="item.prop" align="center">
          <div v-if="item.type !== 'text' || item.type" slot-scope="prop">
            <!--文本框-->
            <el-input v-if="item.type === 'textarea'"
                      v-model="prop.row[item.prop]"
                      :autosize="{ minRows: 1}"
                      type="textarea"></el-input>
            <!--下拉-->
            <el-select v-else-if="item.type === 'select'" v-model="prop.row[item.prop]"
                       style="width: 100%"
                       placeholder="请选择">
              <el-option v-for="(v,i) in item.selectItem"
                         :key="v + i"
                         :label="v.label"
                         :value="v.value"></el-option>
            </el-select>
            <!--输入框-->
            <el-input v-else v-model="prop.row[item.prop]"></el-input>
          </div>
        </el-table-column>
        <el-table-column v-if="showHandle" label="操作" align="center" width="80px">
          <template slot-scope="prop">
            <el-button type="danger" size="mini" @click.stop="deleteItem(prop.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="showHandle" class="tabAdd-content" @click="addTabItem">
        <svg-icon className="addIcon" icon-class="add"></svg-icon>
      </div>
    </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import _ from 'lodash'
  export default {
    data() {
      return {
        list: []
      }
    },
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
      getListResult: {
        type: Boolean,
        default: false
      },
      rowActiveArr: {
        type: Array,
        default() {
          return []
        }
      }
    },
    watch: {
      getListResult(v) {
        if (v) {
          this.$emit('getListResult', this.list)
        }
      },
      tabData(v) {
        this.list = v
      }
    },
    mounted() {
      this.list = _.cloneDeep(this.tabData)
      this.$nextTick(() => {
        this.setSort()
      })
      this.deepWatch()
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
          let id = this.list[index].id || ''
          this.$emit('deleteItem', {
            index,
            id
          })
          this.list.splice(index, 1)
        }).catch((err) => {
          console.log(err)
        })
      },
      setSort() {
        const el = this.$refs.tabMain.$el.querySelectorAll('tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0]
            this.list.splice(evt.newIndex, 0, targetRow)
          }
        })
      },
      addTabItem() {
        let item = {}
        for (let key of this.tabTagData) {
          item[key.prop] = ''
        }
        if (!item.id) {
          item.id = ''
        }
        item.itemId = this.$getid()
        this.list.push(item)
      },
      deepWatch() {
        // 深度监听标签数组变化,并为需明显提示的列加激活样式
        let el = this.$refs.tabMain.$el
        let columnActive = (v) => {
          v.map((s) => {
            // 列激活
            for (let z of el.querySelectorAll('.' + s.prop)) {
              let className = z.className
              if (s.columnActive) {
                // 激活状态时,且存在激活class在则不操作
                if (className.indexOf('columnActive') === -1) {
                  className += ' columnActive'
                }
              } else {
                // 关闭状态则移除激活class
                className = className.replace('columnActive', '')
              }
              z.className = className
            }
          })
        }
        this.$watch('tabTagData', columnActive, {
          deep: true
        })
        // 行激活事件监听
        let rowActive = () => {
          // 恢复所有行背景色
          for (let p of el.querySelectorAll('.rowBadege')) {
            p.className = p.className.replace('activeRow', '')
          }
          // 激活对应行
          this.rowActiveArr.map((v) => {
            let row = el.querySelector('.rowSign' + v)
            let rowClassName = row.className
            if (rowClassName.indexOf('activeRow') === -1) {
              rowClassName += ' activeRow'
            }
            row.className = rowClassName
          })
        }
        this.$watch('rowActiveArr', rowActive, {
          deep: true
        })
      },
      rowClassHandle({ row, rowIndex }) {
        return 'rowSign' + rowIndex + ' rowBadege'
      }
    },
    computed: {
    }
  }
</script>

<style scoped lang="scss">
  .tabAdd-content{
    width: 40px;
    height: 25px;
    line-height: 0px;
    padding: 3px 0 0 0;
    margin: 0 auto;
    border-radius: 0 0 5px 5px;
    text-align: center;
    font-size: 0;
    color: #fff;
    background: #87D0F0;
    cursor: pointer;
    .addIcon{
      height: 20px;
      width: 20px;
    }
    &:hover{
      background: #01B8E2;
    }
  }
</style>
<style lang="scss">
.showPointer{
   cursor: pointer;
}
.columnActive{
  color: red !important;
  input,textarea{
    color: red !important;
  }
}
.activeRow{
  td,input,textarea,select{
    background: #E21918 !important;
    color: #fff;
  }
}
.inputTab-content{
  .cell{
    padding: 0;
    .el-input{
      input{
        text-align: center;
        border: none;
        background-color: transparent;
      }
    }
    .el-textarea{
      textarea{
        text-align: center;
        border: none;
        background-color: transparent;
      }
    }
  }
  tbody{
    td{
      padding: 0;
    }
  }
}
</style>
