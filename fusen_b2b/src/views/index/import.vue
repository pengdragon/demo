<template>
  <div class="index-content">
    <div class="top-msg">
      <div class="company">
        {{name}}
      </div>
      <div class="pass">已认证企业</div>
      <div class="time" v-show="lastLoginTime">上次登录时间: {{lastLoginTime}}</div>
    </div>
    <div class="content">
      <div class="left">
        <div class="left-top">
          <div class="item">
            <div class="number">￥{{statistics[0].value}}元</div>
            <div class="text">本月业务量</div>
            <div class="progress">
              <el-progress :show-text="false"
                           :stroke-width="8"
                           :percentage="88"
                           color="#68DAA4"></el-progress>
            </div>
          </div>
          <div class="item">
            <div class="number">￥{{statistics[1].value}}元</div>
            <div class="text">未结汇金额</div>
            <div class="progress">
              <el-progress :stroke-width="8"
                           :show-text="false"
                           :percentage="66"
                           color="#F6C441"></el-progress>
            </div>
          </div>
          <div class="item">
            <div class="number">￥{{statistics[2].value}}元</div>
            <div class="text">未开票总金额</div>
            <div class="progress">
              <el-progress :stroke-width="8"
                           :show-text="false"
                           :percentage="40"
                           color="#F58807"></el-progress>
            </div>
          </div>
        </div>
        <div class="order-content">
          <div class="order-title">
            <div class="title">
              执行中订单
              <div class="sum">总计{{orders.length}}个</div>
            </div>
            <div class="lookAll" @click="allOrder">查看全部 ></div>
          </div>
          <div class="order-list">
            <div class="order-item"
                 v-for="(item, index) in orders"
                 :key="index"
                 @click="$router.push({path: '/import/orderDetail', query: {id: item.orderId}})">
              <div class="status">
                <div class="statusBtn"
                     :class="{success: item.status === '已发货',warning: item.status === '受理中'}">
                  {{item.status}}
                </div>
              </div>
              <div class="main">
                <div class="main-item">
                  <div class="text">
                    <div class="item">
                      订单号: {{item.orderNo}}
                    </div>
                    <div class="item">
                      下单时间: {{item.orderDate}}
                    </div>
                  </div>
                </div>
                <div class="main-item">
                  <div class="text">
                    <div class="item">
                      物流状态: {{item.logisticsStatus}}
                    </div>
                    <div class="item">
                      订单金额: {{item.money}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="logistics">{{item.logisticsStatus}}</div>
            </div>
          </div>
        </div>
<!--        <div class="info">-->
<!--          <div class="info-title">通知公告</div>-->
<!--          <div class="info-item"-->
<!--               v-for="(item, index) in noticeData"-->
<!--               :key="index">-->
<!--            {{item.noticeTitle}}-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <div class="right">
        <div class="right-top">
          <div class="express" @click="$router.push('/import/placeOrder')">
            快速下单
          </div>
          <div class="flow">我的关注</div>
        </div>
        <div class="item-list">
          <div class="item"
               v-for="(item, index) in orderData"
               :key="index"
               @click="$router.push({path: '/import/orderDetail', query: {id: item.orderId}})">
            <div class="flex-item">{{item.orderNo}}</div>
            <div class="flex-item">{{item.status}}</div>
            <div class="flex-item">{{item.money}}</div>
            <div class="flex-item">{{item.sysCreated}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import req from '@/utils/req'
  import api from '@/utils/apiUtil'

  export default {
    data() {
      return {
        noticeData: [ // 公告
          // {
          //   noticeTitle: '富森B2B新平台上线啦~只要轻轻动一下就可以快速下单哦',
          //   createTime: '2018-02-12'
          // }
        ],
        orders: [], // 执行中订单
        orderData: [], // 关注订单
        statistics: [ // 业务量
          {
            title: '本月业务量',
            value: '0'
          },
          {
            title: '应付金额',
            value: '0'
          },
          {
            title: '逾期金额',
            value: '0'
          }
        ],
        name: Cookies.get('name'),
        lastLoginTime: Cookies.get('lastLoginTime')
      }
    },
    created() {
      this.totalAmount()
      this.queryList()
      this.noticeList()
      this.followList()
    },
    methods: {
      followList() {
        this.$axios.get('/api/export/kanban/exportfocusorder/list', {
          params: {
            businessType: '1'
          }
        }).then((res) => {
          this.orderData = res.data
          this.orderData.forEach((v, i) => {
            this.orderData[i].sysCreated = api.getDate(v.sysCreated)
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      // 查询业务量
      totalAmount() {
        req.get('/api/import/kanban/order/volume', {
          params: {
            'sessionid': Cookies.get('sessionid')
          }
        }).then((res) => {
          // 本月业务量
          this.statistics[0].value = res.data.businessVolume
          // 应付金额
          this.statistics[1].value = res.data.needPayAmount
          // 逾期金额
          this.statistics[2].value = res.data.overdueAmount
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 正在执行订单
       * */
      queryList() {
        req.get('/api/import/kanban/order/list', {
          params: {
            'sessionid': Cookies.get('sessionid'),
            limit: 2
          }
        }).then((res) => {
          this.orders = res.data || []
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 通知列表
       * */
      noticeList() {
        req.get('/api/import/kanban/notice/list', {
          params: {
            'sessionid': Cookies.get('sessionid'),
            limit: 5
          }
        }).then((res) => {
          this.noticeData = res.data
          this.noticeData.forEach((v, i) => {
            this.noticeData[i].createTime = api.getDate(v.createTime)
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 查看全部订单列表
       * */
      allOrder() {
        this.$router.push('/import/orderSearch')
      }
    }
  }
</script>

<style scoped lang="scss">
  .index-content{
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 62px 24px 10px;
    background: #F7F7F7;
    .top-msg{
      display: flex;
      align-items: center;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 40px;
      background: #EEEEEE;
      padding: 0 24px;
      font-size: 14px;
      .company{
        margin-right: 20px;
        color: #676767;
      }
      .pass{
        position: relative;
        padding-left: 18px;
        color: #5E5E5E;
        &:after{
          display: block;
          content: '';
          position: absolute;
          left: 0;
          top: 1px;
          width: 14px;
          height: 14px;
          background: url("../../assets/img/pass.png") 100% no-repeat;
        }
      }
      .time{
        color: #949494;
        margin-left: 60px;
        font-size: 12px;
      }
    }
    .content{
      display: flex;
      width: 100%;
      height: 100%;
      .left{
        flex: 1;
        display: flex;
        flex-direction: column;
        .left-top{
          flex: 0 0 123px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 123px;
          margin-bottom: 20px;
          .item{
            flex: 1;
            box-sizing: border-box;
            height: 123px;
            padding: 25px 0;
            text-align: center;
            background: #fff;
            border-radius: 5px;
            &:nth-child(2){
              margin: 0 22px;
            }
            .progress{
              padding-top: 9px;
              width: 145px;
              margin: 0 auto;
            }
            .text{
              margin: 12px 0;
              font-size: 12px;
              width: 100%;
              color: #A4A4A4;
            }
            .number{
              width: 100%;
              font-size: 20px;
              font-weight: 600;
              color: #282828;
            }
          }
        }
        .order-content{
          flex: 1 0 396px;
          box-sizing: border-box;
          width: 100%;
          height: 396px;
          background: #fff;
          border-radius: 5px;
          padding: 19px 0;
          .order-list{
            height: 326px;
            width: 100%;
            overflow-y: auto;
          }
          .order-title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px 13px;
            border-bottom: 1px solid #F3F3F3;
            .title{
              position: relative;
              font-size: 16px;
              color: #2A2A2A;
              .sum{
                position: absolute;
                right: -98px;
                top: -2px;
                height: 22px;
                line-height: 21px;
                width: 89px;
                padding: 0 10px;
                font-size: 12px;
                color: #A5A5A5;
                text-align: center;
                border-radius: 10px;
                border: 1px solid #A5A5A5;
              }
            }
            .lookAll{
              cursor: pointer;
              width: 61px;
              font-size: 12px;
              color: #69A1DE;
            }
          }
          .order-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0 24px;
            height: 113px;
            border-bottom: 1px solid #F3F3F3;
            font-size: 14px;
            cursor: pointer;
            &:hover{
              background: #FEF9F5;
            }
            .status{
              flex: 0 0 97px;
              .statusBtn{
                width: 68px;
                height: 26px;
                line-height: 26px;
                border-radius: 15px;
                font-size: 14px;
                color: #fff;
                text-align: center;
                background: #FBD87C;
                &.warning{
                  background: #F9B158;
                }
                &.success{
                  background: #58D8A8;
                }
              }
            }
            .main{
              flex: 1;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .main-item{
                flex: 1;
                .text{
                  width: 250px;
                  margin: 0 auto;
                  text-align: left;
                }
                .item{
                  margin-top: 10px;
                }
              }
            }
            .logistics{
              font-size: 14px;
              flex: 0 0 105px;
              margin-right: 30px;
              color: #9B9B9B;
            }
          }
        }
        .info{
          flex: 1;
          box-sizing: border-box;
          overflow-y: auto;
          padding: 19px 0;
          background: #fff;
          border-radius: 5px;
          .info-title{
            padding: 0 24px 15px;
            margin-bottom: 10px;
            font-size: 16px;
            color: #333;
            border-bottom: 1px solid #F3F3F3;
          }
          .info-item{
            color: #838383;
            padding: 10px 24px;
            font-size: 14px;
            cursor: pointer;
          }
        }
      }
      .right{
        margin-left: 20px;
        flex: 0 0 242px;
        min-height: 530px;
        display: flex;
        flex-direction: column;
        background: #fff;
        border-radius: 5px;
        .right-top{
          width: 100%;
          flex: 0 0 136px;
          background: #FEF8EC;
          text-align: center;
          .express{
            position: relative;
            box-sizing: border-box;
            width: 100%;
            height: 74px;
            line-height: 74px;
            padding-left: 33px;
            background: #F6890A;
            font-size: 20px;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
            &:after{
              position: absolute;
              left: 64px;
              top: 25px;
              display: block;
              content: '';
              width: 24px;
              height: 25px;
              background: url("../../assets/img/order.png") 100% no-repeat;
            }
          }
          .flow{
            height: 62px;
            line-height: 62px;
            font-size: 16px;
            color: #34312A;
          }
        }
        .item-list{
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          width: 100%;
          font-size: 12px;
          color: #969696;
          .item{
            display: flex;
            flex: 0 0 75px;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            padding: 20px 8px 15px 8px;
            border-bottom: 1px solid #F3F3F3;
            cursor: pointer;
            &:hover{
              background: #FEF9F5;
            }
            .flex-item{
              flex: 0 0 50%;
              &:nth-child(even){
                text-align: right;
              }
              &:nth-child(1),&:nth-child(2){
                color: #626262;
                font-size: 14px;
                margin-bottom: 10px;
              }
            }
          }
        }
      }
    }
  }
</style>
