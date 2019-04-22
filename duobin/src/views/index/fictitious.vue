<template>
  <div class="index-content">
    <div class="top-msg">
      <!-- <div class="company">{{name}}</div> -->
      <div class="pass">已认证企业</div>
      <div class="time">上次登录时间: {{new Date()}}</div>
    </div>
    <div class="content">
      <div class="left">
        <div class="left-top">
          <div class="item">
            <div class="number">￥{{statistics[0].value}}万美元</div>
            <div class="text">本月出口业务量</div>
            <div class="progress">
              <el-progress :show-text="false" :stroke-width="8" :percentage="88" color="#68DAA4"></el-progress>
            </div>
          </div>
          <div class="item">
            <div class="number">￥{{statistics[1].value}}万美元</div>
            <div class="text">垫资金额</div>
            <div class="progress">
              <el-progress :stroke-width="8" :show-text="false" :percentage="66" color="#F6C441"></el-progress>
            </div>
          </div>
          <div class="item">
            <div class="number">￥{{statistics[2].value}}万美元</div>
            <div class="text">已付款未回票</div>
            <div class="progress">
              <el-progress :stroke-width="8" :show-text="false" :percentage="40" color="#F58807"></el-progress>
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
            <div
              class="order-item"
              v-for="(item, index) in orderData"
              :key="index"
              @click="$router.push({path: '/fictitious/orderTrack/objectTrack', query: {id: item.orderId}})"
            >
              <div class="main">
                <div class="main-item">
                  <div class="text">
                    <div class="item">富森项目号: {{item.fsOrderNo}}</div>
                    <div class="item">项目日期: {{item.orderDate}}</div>
                  </div>
                </div>
                <div class="main-item">
                  <div class="text">
                    <div class="item">内部项目号: {{item.customerNo}}</div>
                    <div class="item">项目数量: {{item.itemNum}}</div>
                  </div>
                </div>
                <div class="main-item">
                  <div class="text">
                    <div class="item">项目金额: {{item.itemPrice}}</div>
                    <div class="item">BOM确认: {{item.bomState}}</div>
                  </div>
                </div>
                <div class="main-item">
                  <div class="text">
                    <div class="item">出口数量: {{item.exportVolume}}</div>

                    <div class="item">结算数量: {{item.quantityNum}}</div>
                  </div>
                </div>
              </div>
              <div class="logistics">{{item.logisticsStatus}}</div>
            </div>
          </div>
        </div>
        <!--        <div class="table-bottom">-->
        <!--          <div class="title-order">通知公告</div>-->
        <!--          <notice :noticeData="noticeData"></notice>-->
        <!--        </div>-->
      </div>
      <div class="right">
        <div class="right-top">
          <div class="express" @click="$router.push('/fictitious/setupObject/addObject')">新增项目</div>
          <div class="flow">我的关注</div>
        </div>
        <!-- 关注列表 -->
        <div class="item-list">
          <div
            class="item"
            v-for="(item, index) in followData"
            :key="index"
            @click="$router.push({path: '/import/orderDetail', query: {id: item.orderId}})"
          >
            <div class="flex-item">{{item.fsOrderNo}}</div>
            <div class="flex-item">{{item.orderStatus}}</div>
            <div class="flex-item">{{item.customsAmount}}</div>
            <div class="flex-item">{{item.orderDate}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import req from "@/utils/req";
import api from "@/utils/apiUtil";
import statistics from "./component/statistics";
import follow from "./component/follow";
import notice from "./component/notice";
import bottomTab from "@/components/bottomFeedbackTab";

export default {
  components: { statistics, follow, notice, bottomTab },
  data() {
    return {
      orders: [],
      orderData: [
        // {
        //   itemId: 'AA1234',
        //   fsOrderNo: 'BB6789',
        //   customerNo: '2018-4-18',
        //   orderDate: '2000',
        //   itemNum: '5000000',
        //   itemPrice: '已确认',
        //   bomState: '1000',
        //   quantityNum: '100',
        //   status: ''
        // }
      ],
      followData: [
        // {
        //   itemId: '',
        //   fsOrderNo: '',
        //   orderStatus: '',
        //   customsAmount: '',
        //   orderCurrency: '',
        //   orderDate: ''
        // }
      ],
      noticeData: [
        // {
        //   text: '富森B2B新平台上线啦~只要轻轻动一下就可以快速下单哦',
        //   date: '2018-02-12'
        // }
      ],
      statistics: [
        {
          title: "本月出口业务量",
          value: "0"
        },
        {
          title: "垫资金额",
          value: "0"
        },
        {
          title: "已付款未回票",
          value: "0"
        }
      ],
      type: "fictitious"
    };
  },
  created() {
    this.getOrderList();
    this.getBusinessvolume();
    this.getfollowList();
  },
  //     //判断session是否过期，跳转登录页
  //         beforeRouteEnter(to, from, next) {
  //         //路由守卫的方法
  //         // 获取sessionid方法
  //         function getCookie(cname) {
  //         var name = cname + "=";
  //         var ca = document.cookie.split("; ");
  //           for (var i = 0; i < ca.length; i++) {
  //               var c = ca[i];
  //         //key=value,此时为一个字符串，判断字符串中是否有key=，如果有，则去其值；
  //           if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  //         }
  //           return "";
  //         }
  //           // 判断用户是否登录了
  //         let sessionid = getCookie("sessionid");

  //         if (sessionid) {
  //         // 路由守卫通过 进入页面
  //         console.log('存在sessionid进入个人页面')
  //         next();
  //         } else {
  //         //重定向 去到登录页面
  //         console.log('sessionid过期进入登录页面')
  //         next({ name: "login" });
  // }
  // },

  methods: {
    allOrder() {
      this.$router.push("/fictitious/orderTrack/objectTrack");
    },
    // 获取执行中的订单
    getOrderList() {
      // let sessionId = Cookies.get('sessionid')
      req
        .get("api/virtual/kanban/execueItemList", {
          // params: {
          //   sessionId: sessionId
          // }
        })
        .then(res => {
          res.data.forEach(v => {
            if (!v.bomState) {
              v.bomState = "待确认";
            }
          });
          this.orderData = res.data;
          this.orders = res.data || [];
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 获取我关注的订单
    getfollowList() {
      console.log(document.cookie);
      req
        .get("api/virtual/kanban/focusItem", {})
        .then(res => {
          this.followData = res.data;
          res.data.forEach((item, index, arr) => {
            arr[index].orderDate = api.getDate(arr[index].orderDate);
            if (arr[index].orderStatus === "0") {
              arr[index].orderStatus = "暂存";
            } else if (
              arr[index].orderStatus === "1" ||
              arr[index].orderStatus === "2"
            ) {
              arr[index].orderStatus = "审核中";
            } else {
              arr[index].orderStatus = "已审核";
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 通知列表
     * */
    noticeList() {
      req
        .get("/api/import/kanban/notice/list", {
          params: {
            sessionid: Cookies.get("sessionid"),
            limit: 5
          }
        })
        .then(res => {
          this.noticeData = res.data;
          this.noticeData.forEach((v, i) => {
            this.noticeData[i].createTime = api.getDate(v.createTime);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 业务量 垫资金额 已付款、
    getBusinessvolume() {
      req
        .get("api/virtual/kanban/volume", {})
        .then(res => {
          this.statistics[0].value = res.data.businessVolume;
          this.statistics[1].value = res.data.paidAndNonBillAmount;
          this.statistics[2].value = res.data.prepayAmount;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped lang="scss">
.index-content {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 62px 24px 56px;
  background: #f7f7f7;

  .top-msg {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 40px;
    background: #eeeeee;
    padding: 0 24px;
    font-size: 14px;

    .company {
      margin-right: 20px;
      color: #676767;
    }

    .pass {
      position: relative;
      padding-left: 18px;
      color: #5e5e5e;

      &:after {
        display: block;
        content: "";
        position: absolute;
        left: 0;
        top: 1px;
        width: 14px;
        height: 14px;
        background: url("../../assets/img/pass.png") 100% no-repeat;
      }
    }

    .time {
      color: #949494;
      margin-left: 60px;
      font-size: 12px;
    }
  }

  .content {
    display: flex;
    width: 100%;
    height: 100%;

    .left {
      flex: 1;
      display: flex;
      flex-direction: column;

      .left-top {
        flex: 0 0 123px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 123px;
        margin-bottom: 20px;

        .item {
          flex: 1;
          box-sizing: border-box;
          height: 123px;
          padding: 25px 0;
          text-align: center;
          background: #fff;
          border-radius: 5px;

          &:nth-child(2) {
            margin: 0 22px;
          }

          .progress {
            padding-top: 9px;
            width: 145px;
            margin: 0 auto;
          }

          .text {
            margin: 12px 0;
            font-size: 12px;
            width: 100%;
            color: #a4a4a4;
          }

          .number {
            width: 100%;
            font-size: 20px;
            font-weight: 600;
            color: lightcoral;
          }
        }
      }

      .order-content {
        flex: 0 0 526px;
        box-sizing: border-box;
        width: 100%;
        height: 526px;
        background: #fff;
        border-radius: 5px;
        padding: 19px 0;
        margin-bottom: 20px;

        .order-list {
          height: 500px;
          width: 100%;
          overflow-y: auto;
          color: #626262;
          font-size: 14px;
        }

        .order-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px 13px;
          border-bottom: 1px solid #f3f3f3;

          .title {
            position: relative;
            font-size: 16px;
            color: #2a2a2a;

            .sum {
              position: absolute;
              right: -98px;
              top: -2px;
              height: 22px;
              line-height: 21px;
              width: 89px;
              padding: 0 10px;
              font-size: 12px;
              color: #a5a5a5;
              text-align: center;
              border-radius: 10px;
              border: 1px solid #a5a5a5;
            }
          }

          .lookAll {
            cursor: pointer;
            width: 61px;
            font-size: 12px;
            color: #69a1de;
          }
        }

        .order-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 24px;
          height: 113px;
          border-bottom: 1px solid #f3f3f3;
          font-size: 14px;
          cursor: pointer;

          &:hover {
            background: #fef9f5;
          }

          .status {
            flex: 0 0 97px;

            .statusBtn {
              width: 68px;
              height: 26px;
              line-height: 26px;
              border-radius: 15px;
              font-size: 14px;
              color: #fff;
              text-align: center;

              &.warning {
                background: #f9b158;
              }

              &.success {
                background: #58d8a8;
              }
            }
          }

          .main {
            width: 100% !important;
            flex: 1;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .main-item {
              flex: 1;

              .text {
                margin: 0 auto;
                text-align: left;
              }

              .item {
                margin-top: 10px;
              }
            }
          }

          .logistics {
            font-size: 14px;
            flex: 0 0 105px;
            margin-right: 30px;
            color: #9b9b9b;
          }
        }
      }

      .info {
        flex: 1;
        box-sizing: border-box;
        overflow-y: auto;
        padding: 19px 0;
        background: #fff;
        border-radius: 5px;

        .info-title {
          padding: 0 24px 15px;
          margin-bottom: 10px;
          font-size: 16px;
          color: #333;
          border-bottom: 1px solid #f3f3f3;
        }

        .info-item {
          color: #838383;
          padding: 10px 24px;
          font-size: 14px;
          cursor: pointer;
        }
      }

      .table-bottom {
        height: 285px;
        background: white;

        .title-order {
          height: 45px;
          border-left: 3px solid #1f9bd6;
          border-bottom: 1px solid rgb(232, 232, 232);
          line-height: 45px;
          padding-left: 20px;
          font-size: 16px;
        }
      }
    }

    .right {
      margin-left: 20px;
      flex: 0 0 242px;
      min-height: 680px;
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 5px;

      .right-top {
        width: 100%;
        flex: 0 0 136px;
        background: #fef8ec;
        text-align: center;

        .express {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          height: 123px;
          line-height: 123px;
          padding-left: 33px;
          background: #ed6832;
          font-size: 20px;
          color: #fff;
          border-radius: 5px;
          cursor: pointer;

          &:after {
            position: absolute;
            left: 65px;
            top: 49px;
            display: block;
            color: white;
            background-color: #ed6832;
            content: "";
            width: 24px;
            height: 25px;
            background: url("../../assets/img/order.png") 100% no-repeat;
          }
        }

        .flow {
          height: 62px;
          line-height: 62px;
          font-size: 16px;
          color: #34312a;
          text-align: left;
        }
      }

      .item-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        width: 100%;
        font-size: 12px;
        color: #969696;

        .item {
          display: flex;
          flex: 0 0 75px;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          padding: 20px 8px 15px 8px;
          border-bottom: 1px solid #f3f3f3;
          cursor: pointer;

          &:hover {
            background: #fef9f5;
          }

          .flex-item {
            flex: 0 0 50%;

            &:nth-child(even) {
              text-align: right;
            }

            &:nth-child(1),
            &:nth-child(2) {
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
