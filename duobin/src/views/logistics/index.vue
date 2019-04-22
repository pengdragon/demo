<template>
  <div class="content-wrapper">
    <div class="box">
      <div class="box-line"></div>
      <div v-for="(item,i) in status" :key="i" class="item" :class="{'complete':item.complete}">
        <div class="item-title">
          <p style="font-size: 14px">{{item.otype}}</p>
          <p style="font-size: 12px;color: rgb(178,178,178)">{{item.otimes[item.otimes.length-1]}}</p>
        </div>
        <div class="box-location"><i class="el-icon-location"></i></div>
        <div class="item-box">
          <div class="triangle-top"></div>
          <i :class="item.icon"></i>
        </div>
        <div v-if="item.otimes.length>1" v-for="(time,m) in item.otimes" class="detail-box">
          <div class="detail-line"></div>
          <div class="item-box">
            <div class="triangle-top"></div>
            <i class="el-icon-circle-check-outline"></i>
            <p class="detail-time">{{time}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="title">国内物流信息</div>
    <div class="track-table"  v-loading="loadState">
      <el-table :data="logisticsInfo" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="送货信息" width="190">
          <template slot-scope="scope">
            <p>送货单号：{{scope.row.f_DeliveryNumber}}</p>
            <p>深圳出仓时间：{{scope.row.f_SendDate}}</p>
          </template>
        </el-table-column>
        <el-table-column label="配送信息">
          <template slot-scope="scope">
            <p>送货方式：{{scope.row.f_ShipMentType}}</p>
            <p>物流公司：{{scope.row.f_logisticsCompany}}</p>
            <p>签收/运单号：{{scope.row.f_ExpressNumber}}</p>
          </template>
        </el-table-column>
        <el-table-column label="收货信息" width="280">
          <template slot-scope="scope">
            <p>收货公司：{{scope.row.f_Company}}</p>
            <p>收货人电话：{{scope.row.f_Phone}}</p>
            <p>收货人地址：{{scope.row.f_Address}}</p>
          </template>
        </el-table-column>
        <el-table-column label="物流明细" width="460">
          <template slot-scope="scope">
            <p v-for="detail in scope.row.logisticsDetails">{{detail.accept_time}}  {{detail.remark}}  {{detail.accept_address}}</p>
            <!--<p>{{scope.row.logisticsDetails}}</p>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import req from '@/utils/req'
  export default {
    data() {
      return {
        // 深圳送货信息（表格数据）
        logisticsInfo: [],
        // 物流信息（图节点信息）
        status: [
          {
            otype: '已下单',
            otimes: [],
            icon: 'el-icon-document',
            complete: false
          },
          {
            otype: '香港已收货',
            otimes: [],
            icon: 'el-icon-success',
            complete: false
          },
          {
            otype: '香港已出车',
            otimes: [],
            icon: 'el-icon-time',
            complete: false
          },
          {
            otype: '深圳已收货',
            otimes: [],
            icon: 'el-icon-success',
            complete: false
          },
          {
            otype: '深圳已发货',
            otimes: [],
            icon: 'el-icon-time',
            complete: false
          }
        ],
        loadState: false
      }
    },
    created() {
      let id = this.$route.query.id
      id && this.getStatus(id)
      id && this.getDetail(id)
    },
    methods: {
      // 物流节点信息
      getStatus(id) {
        let data = { iD: id }
        req.post('/logistics/base/querylogistics', data).then((res) => {
          let result = res.result
          console.log(result)
          // let result = [
          //   { otype: '已下单', otime: '2017/07/06 10:43:23', ono: '1', refno: 'FA170710537' },
          //   { otype: '香港已收货', otime: '2017/07/06 10:43:23', ono: '1', refno: 'FA170710537' },
          //   { otype: '香港已出车', otime: '2017/07/06 10:43:23', ono: '1', refno: 'FA170710537' },
          //   { otype: '香港已出车', otime: '2017/09/06 10:43:23', ono: '1', refno: 'FA170710537' },
          //   { otype: '深圳已收货', otime: '2017/07/06 10:43:23', ono: '1', refno: 'FA170710537' },
          //   { otype: '深圳已收货', otime: '2017/08/06 10:43:23', ono: '1', refno: 'FA170710537' },
          //   { otype: '深圳已发货', otime: '2017/07/06 10:43:23', ono: '1', refno: 'FA170710537' }
          // ]
          let lastStatus = result[result.length - 1].otype
          let index = this.status.findIndex((s) => s.otype === lastStatus)
          for (let i = 0; i <= index; i++) {
            this.status[i].complete = true
          }
          result.forEach((sta) => {
            this.status.forEach((s) => {
              if (sta.otype === s.otype) {
                s.otimes.push(sta.otime)
              }
            })
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      // 深圳送货信息
      getDetail(id) {
        this.loadState = true
        let data = { iD: id }
        let sessionid = Cookies.get('sessionid')
        req.post('/logistics/delivery/szdeliverylist', data).then((res) => {
          let list = res.result
          this.loadState = false
          // 获取第三方物流信息
          list.forEach((log) => {
            if (!log.f_DeliveryNumber || !log.f_ExpressNumber || !log.f_logisticsCompany) {
              this.logisticsInfo = list
              return
            }
            // console.log(log)
            req.get('/logistics/base/tplsf', {
              params: {
                // psid: 'PS180609406',
                // expressnumber: '620816513240',
                // logisticscompany: '顺丰快递',
                psid: log.f_DeliveryNumber,
                expressnumber: log.f_ExpressNumber,
                logisticscompany: log.f_logisticsCompany,
                sessionid
              }
            }).then((res) => {
              log.logisticsDetails = res.result.list
              console.log(res.result.list.length - 1)
              this.loadState = false
              this.logisticsInfo = list
            }).catch((error) => {
              console.log(error)
            })
          })
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    padding: 10px 20px;
  }
  .title{
    border-left: 3px solid #1F9BD6;
    margin: 20px 0;
    padding-left: 20px;
    color: #1F9BD6;
  }
  .track-table{
    p{
      margin: 3px;
    }
  }
</style>
<style scoped lang="scss">
  .complete{
    .box-location{
      color: #1F9BD6 !important;
    }
    .item-box{
      background: #1F9BD6 !important;
    }
    .triangle-top{
      border-bottom: 10px solid #1F9BD6 !important;
    }
  }
  .box{
    position: relative;
    display: flex;
    width: 80%;
    flex-direction: row;
    justify-content: space-between;
    .box-line{
      position: absolute;
      width: calc(100% - 100px);
      height: 2px;
      margin: 0 50px;
      top: 55px;
      z-index: 1;
      background: rgb(196,196,196);
    }
    .item{
      display: flex;
      width: 120px;
      flex-direction: column;
      align-items: center;
      .item-title{
        width: 100%;
        height: 40px;
        margin: 0;
        padding: 0;
        p{
          margin: 0;
          padding: 3px;
          text-align: center;
        }
      }
      .box-location{
        position: relative;
        z-index: 100;
        width: 40px;
        height: 40px;
        background: white;
        font-size: 40px;
        color: rgb(196,196,196);
      }
      .item-box{
        position: relative;
        width: 80px;
        height: 70px;
        border-radius: 10px;
        margin: 15px 0 5px 0;
        text-align: center;
        line-height: 85px;
        background: rgb(196,196,196);
        .triangle-top{
          position: absolute;
          top: -10px;
          left: 30px;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid rgb(196,196,196);
        }
        i{
          width: 40px;
          height: 40px;
          font-size: 40px;
          color: white;
        }
        .detail-time{
          position: absolute;
          top: -20px;
          left: 80px;
          width: 120px;
          height: 20px;
          font-size: 12px;
          color: rgb(178,178,178)
        }
      }
      .detail-box{
        .detail-line{
          width: 0px;
          height: 100px;
          margin: auto;
          border-left: 2px dashed rgb(196,196,196);
        }
      }
    }
  }
</style>
