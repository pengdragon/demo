<template>
  <div>
    <el-table height="240" :data="orderData" style="width: 100%" :show-header="false">
      <el-table-column prop="orderNo" label="订单号">
      </el-table-column>
      <el-table-column prop="supplier" label="订单金额">
      </el-table-column>
      <el-table-column prop="sysCreated" label="订单日期" width="160">
      </el-table-column>
      <el-table-column prop="status" label="订单状态">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import api from '@/utils/apiUtil'
  export default {
    props: {
      /**
       * 当前读取的关注订单类型
       * */
      type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        orderData: [
          // {
          //   orderNo: 'AA1234',
          //   sysCreated: '2018-4-18',
          //   money: '5000000',
          //   status: '已确认'
          // }
        ]
      }
    },
    created() {
      this.followList()
    },
    methods: {
      followList() {
        this.$axios.get('/api/export/kanban/exportfocusorder/list', {
          params: {
            businessType: this.type === '进口' ? '1' : '2'
          }
        }).then((res) => {
          this.orderData = res.data
          this.orderData.forEach((v, i) => {
            this.orderData[i].sysCreated = api.getDate(v.sysCreated)
          })
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .grid-content {
    border-radius: 4px;
    min-height: 110px;
  }
  .purple{
    background: url("/src/assets/index/bg-purple.png") no-repeat;
    background-size: 100% 100%;
  }
  .orange{
    background: url("/src/assets/index/bg-orange.png") no-repeat;
    background-size: 100% 100%;
  }
  .green{
    background: url("/src/assets/index/bg-green.png") no-repeat;
    background-size: 100% 100%;
  }
  .advertisement{
    background: url("/src/assets/index/ad.png");
    background-size: 100% 100%;
  }
  .left-icon{
    height: 110px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .right-text{
    height: 110px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    p{
      margin: 0;
      padding: 0;
    }
    .money{
      font-size: 22px;
    }
    .title{
      font-size: 14px;
      margin-top: 5px;
    }
  }
</style>
