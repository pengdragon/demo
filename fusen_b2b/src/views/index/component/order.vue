<template>
  <div>
      <el-table height="330" :data="orders" style="width: 100%" :show-header="false">
        <el-table-column width="150">
          <template slot-scope="scope">
            <div class="acceptance">{{scope.row.status}}</div>
          </template>
        </el-table-column>
        <el-table-column width="500">
          <template slot-scope="scope">
            <p><span>订单号：</span>{{scope.row.orderNo}}</p>
            <p><span>下单时间：</span>{{scope.row.orderDate}}</p>
            <p><span>供应商：</span>{{scope.row.supplier}}</p>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <p><span>物流状态：</span>{{scope.row.logisticsStatus}}</p>
            <p><span>订单金额：</span>{{scope.row.money}}</p>
          </template>
        </el-table-column>
        <el-table-column width="110">
          <template slot-scope="scope">
            <div style="color: #1F9BD6;cursor: pointer"
                 @click="$router.push(`${jumpRoute}?id=${scope.row.orderId}`)">
              {{jumpTitle}}
            </div>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      orders: {
        type: Array,
        default: []
      },
      /**
       * 跳转页面路由
       * */
      jumpRoute: {
        type: String,
        default: ''
      },
      /**
       * 跳转的标题
       * */
      jumpTitle: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="scss">
  p{
    margin: 0;
    padding: 4px;
    span{
      display: inline-block;
      width: 100px;
      padding-right: 10px;
      text-align: right;
      color: rgb(130,130,130);
    }
  }
  .acceptance{
    position: absolute;
    top: 0;
    left: 0;
    width: 75px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: #1F9BD6;
    border-radius: 0 0 5px 5px;
    color: white;
  }
</style>
