<template>
  <div>
    <div class="wrap-container">

      <statistics :type="type" :statistics="statistics"
                  :activeColor="`linear-gradient(to bottom,rgb(244,160,71),rgb(228,61,17))`"></statistics>

      <div style="height: 375px" class="execute-project">
        <div class="title-order">执行中的订单
          <span style="color: rgb(141,141,141);font-size: 14px;">（查看全部订单）</span>
          <span @click="allOrder" style="float: right;margin-right: 20px;font-size: 14px;cursor: pointer">查看全部 >></span>
        </div>
        <order :orders="orders"></order>
      </div>
      <el-row :gutter="20">
        <el-col :span="11">
          <div class="table-bottom">
            <div class="title-order">我的关注</div>
            <follow :orderData="orderData"></follow>
          </div>
        </el-col>
        <el-col :span="13">
          <div class="table-bottom">
            <div class="title-order">通知公告</div>
            <notice :noticeData="noticeData"></notice>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="fixedFooter" slot="bottomFooter">
      <bottomTab></bottomTab>
    </div>
  </div>
</template>

<script>
  import order from './component/order'
  import statistics from './component/statistics'
  import follow from './component/follow'
  import notice from './component/notice'
  import bottomTab from '@/components/bottomFeedbackTab'

  export default {
    components: { order, statistics, follow, notice, bottomTab },
    data() {
      return {
        orderData: [],
        noticeData: [
          {
            text: '富森B2B新平台上线啦~只要轻轻动一下就可以快速下单哦',
            date: '2018-02-12'
          },
          {
            text: '富森清明节放假通知及业务办理通知',
            date: '2018-02-12'
          },
          {
            text: '富森B2B新平台上线啦~只要轻轻动一下就可以快速下单哦',
            date: '2018-02-12'
          },
          {
            text: '富森B2B新平台上线啦~只要轻轻动一下就可以快速下单哦',
            date: '2018-02-12'
          }
        ],
        orders: [],
        statistics: [
          {
            title: '本月业务量',
            value: '57600万元'
          },
          {
            title: '未结汇金额',
            value: '89000000美元'
          },
          {
            title: '未开票总金额（报关未收票）',
            value: '890000美元'
          }
        ],
        type: 'substitute'
      }
    },
    methods: {
      allOrder() {
        this.$router.push('/order/orderSearch')
      }
    },
    created() {
      // 列表查询
      let data = {}

      this.$axios.post('/api/purchase/kanban/order/list', data)
        .then((response) => {
          this.orders = response.data
        })
      this.$axios.post('/api/purchase/kanban/focusOrder/list', data)
        .then((response) => {
          this.orderData = response.data
          console.log(this.orderData)
        })
    }
  }
</script>

<style scoped lang="scss">
  .wrap-container {
    background: rgb(232, 232, 232);
    padding: 10px 20px;
  }

  .main-container {
    padding: 70px 0 90px 0;
  }

  .execute-project {
    width: 100%;
    background: white;
    margin: 10px 0;
    overflow: hidden;
  }

  .table-bottom {
    height: 285px;
    background: white;
  }

  .title-order {
    height: 45px;
    border-left: 3px solid #1F9BD6;
    border-bottom: 1px solid rgb(232, 232, 232);
    line-height: 45px;
    padding-left: 20px;
    font-size: 16px;
    color: #1F9BD6;
  }
</style>
