<template>
  <div class="content-wrapper">
    <div class="content-wrapper2">
      <div class="title">
        <span>解绑微信</span>
      </div>
      <div class="title-btn">
        <el-button type="primary" size="medium" class="btn-top" @click="DellData()">批量解绑</el-button>
      </div>
      <div style="margin:12px">
        <el-table
          :data="tableData"
          border
          style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="headimgurl" align="center"
            label="头像"
            width="180">
            <template slot-scope="scope">
              <img :src="scope.row.headimgurl" alt="" style="width: 50px;height: 50px; border-radius:50%; ">
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname" align="center"
            label="微信名称"
            width="180">
          </el-table-column>

          <el-table-column
            prop="createdate" align="center"
            label="绑定时间">
          </el-table-column>
          <el-table-column
            label="操作" align="center">
            <template slot-scope="scope">

              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">解绑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
  import qs from 'qs'

  export default {
    data() {
      return {
        tableData: [],
        unionidsArray: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleSelectionChange(e) {
        this.unionidsArray = e
      },
      handleDelete(index, row) {
        console.log(row.unionid)
        let data = {
          unionids: row.unionid
        }
        this.$axios.post('/WX/wxBatchUnbind', qs.stringify(data))

          .then((response) => {
            this.getList()
          })
          .catch((error) => {
            console.log(error)
          })
      },

      getList() {
        this.$axios.post('/WX/wxQueryBindedAccs')

          .then((response) => {
            this.tableData = response.data
            console.log(response.data)
          })
          .catch((error) => {
            console.log(error)
          })
      },
      DellData() {
        let uuid = []
        for (let i = 0; i < this.unionidsArray.length; i++) {
          uuid.push(this.unionidsArray[i].unionid)
        }

        let data = {
          unionids: uuid.join('|')

        }
        this.$axios.post('/WX/wxBatchUnbind', qs.stringify(data))

          .then((response) => {
            this.getList()
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper {
    box-sizing: border-box;
    padding: 10px 22px 0;
    background: #f8f8f8;
    height: 100%;
  }

  .content-wrapper2 {
    background: white;
    border-radius: 5px;
    padding-bottom: 10px;
  }

  .title {
    color: #333;
    font-size: 16px;
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid #f3f3f3;
    margin: 8px;
  }

  .title span {
    margin-left: 17px;
  }

  .title-btn {
    height: 90px;
  }

  .btn-top {

    margin-top: 20px;
    margin-left: 24px;

  }
</style>
