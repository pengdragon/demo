<template>
  <el-row>
    <div class="flow" v-show="$route.path==='/import/flow'">
      <div class="flow-first fl">
        <div class="flow-box cursor" @click="$router.push('/import/placeOrder')">
          新增进口订单
        </div>
        <div class="line-box">
          <div class="line-left fl"></div>
          <div class="flow-content fl">审核通过</div>
          <div class="line-right fl"></div>
        </div>
      </div>
      <div class="flow-second fl">
        <div class="second-box">
          <div class="row-line-top">
            <div class="col-line-top"></div>
          </div>
          <div class="flow-box">
            订单确认
          </div>
          <div class="row-line-bottom">
            <div class="col-line-bottom"></div>
          </div>
        </div>
        <div class="line-box">
          <div class="line"></div>
        </div>
      </div>
      <div class="flow-third">
        <div class="flow-last-top">
          <div class="flow-box cursor" @click="$router.push('/import/payApply/payApplyDetail')">
            新增付款申请
          </div>
          <div class="line-box">
            <div class="line-left fl"></div>
            <div class="flow-content fl">审核成功<br>富森执行付款</div>
            <div class="line-right fl"></div>
          </div>
          <div class="flow-last">
            付款水单
          </div>
        </div>
        <div class="flow-last-center">
          <div class="flow-box cursor" @click="$router.push('/import/logistics/takeGoods/newTakeGoods')">
            新增提货单
          </div>
          <div class="line-box">
            <div class="line-left fl"></div>
            <div class="flow-content fl">审核成功<br>富森执行派货</div>
            <div class="line-right fl"></div>
          </div>
          <div class="flow-last">
            进口报关
          </div>
        </div>
        <div class="flow-last-bottom">
          <div class="flow-box cursor" @click="$router.push('/import/logistics/sendGoods/newSendGoods')">
            新增派货单
          </div>
          <div class="line-box">
            <div class="line-left fl"></div>
            <div class="flow-content fl">审核成功<br>富森执行派货</div>
            <div class="line-right fl"></div>
          </div>
          <div class="flow-last">
            送货单
          </div>
        </div>
      </div>
    </div>
  </el-row>

</template>

<script>
    export default {
      name: ''
    }
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .flow{
    margin-top: 20%;
    display: inline-block;
    margin-left: 20px;
  }
  .cursor{
    cursor: pointer;
  }
  @media screen and (max-width: 1300px){
    .flow{
      transform: scale(0.8) translateX(-100px);
      min-width: 1220px;
    }
  }
  .flow-box{
    width: 131px;
    text-align: center;
    padding: 20px 10px;
    position: relative;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    border: 1px #01b8e3 solid;
    background-color: #fff;
    display: inline-block;
  }
  .flow-box:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 100%;
    bottom: 0;
    margin: auto 0;
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-left: 15px solid #01b8e3;
    border-bottom: 15px solid transparent;
  }

  .flow-box:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 99%;
    bottom: 0;
    margin: auto 0;
    width: 0;
    height: 0;
    border-top: 14px solid transparent;
    border-left: 14px solid #fff;
    border-bottom: 14px solid transparent;
  }
  .line-left{
    width: 30px;
    height: 1px;
    background: #01b8e3;
    margin-right: 10px;
    margin-top: 10px;
    position: relative;
  }
  .line-right{
    width: 40px;
    height: 1px;
    background: #01b8e3;
    margin-left: 10px;
    margin-top: 10px;
  }
  .line{
    width: 30px;
    height: 1px;
    background: #01b8e3;
    margin-top: -8px;
    position: relative;
  }
  .line-box{
    margin-left: 20px;
    display: inline-block;
  }
  .flow-second{
    margin-left: 10px;
  }
  .second-box{
    position: relative;
    display: inline-block;
  }
  .row-line-top{
    width: 1px;
    height: 84px;
    background: #01b8e3;
    position: absolute;
    top: -84px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .row-line-bottom{
    width: 1px;
    height: 84px;
    background: #01b8e3;
    position: absolute;
    bottom: -84px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .col-line-top{
    width: 120px;
    position: absolute;
    height: 1px;
    left: 0;
    top: 0;
    background: #01b8e3;
  }
  .col-line-bottom{
    width: 120px;
    position: absolute;
    height: 1px;
    left: 0;
    bottom: 0;
    background: #01b8e3;
  }
  .flow-content{
    text-align: center;
  }
  .flow-third{
    display: flex;
    align-items: center;
    position: relative;
  }
  .flow-third .flow-box{
    text-align: center;
    margin-left: 10px;
    width: 131px;
  }
  .flow-third .line-left,.flow-third .line-right{
    margin-top:22px
  }
  .flow-last{
    width: 105px;
    text-align: center;
    padding: 20px;
    position: relative;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    color: #ffffff;
    background-color: #01b8e3;
    display: inline-block;
    margin-left: 10px;
  }
  .flow-last-top{
    height: auto;
    position: absolute;
    top: -176%;
    left: 0;
    display: flex;
    align-items: center;
  }
  .flow-last-center{
    display: flex;
    align-items: center;
  }
  .flow-last-bottom{
    height: auto;
    position: absolute;
    bottom: -170%;
    left: 0;
    display: flex;
    align-items: center;
  }
  .sub-text{
    width: 50px;
    text-align: center;
    background: #fff;
    position: absolute;
    top: 28px;
    left: -25px;
  }
  .add-order{
    position: absolute;
    left: 140px;
    top: -28px;
    width: 760px;
    margin-left: 16px;
  }
  .add-order li{
    float: left;
    border: 1px solid #01b8e3;
    width: 98px;
    text-align: center;
    padding: 20px 10px;
    margin-right: 63px;
    border-radius: 10px;
  }
  .invoice,.flow-exit{
    background: #01b8e3;
    color: #ffffff;
  }
  .flow-exit:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 117%;
    bottom: 0;
    margin: auto 0;
    width: 0;
    height: 0;
    border-top: 14px solid transparent;
    border-left: 14px solid #fff;
    border-bottom: 14px solid transparent;
  }
  .add-order li:last-child{
    margin-right: 0;
  }
  .bottom-content{
    position: absolute;
    left: 70px;
    top: -28px;
    width: 490px;
    display: flex;
    align-items: center;
  }
  .pass-text{
    position: absolute;
    left: -31px;
    top: 39px;
    width: 70px;
    background: #ffffff;
    line-height: 30px;
  }
  .col-left{
    width: 1px;
    height: 170px;
    background: #01b8e3;
    position: absolute;
    left: 50px;
    top: -85px;
  }
  .row-top-line{
    width: 60px;
    height: 1px;
    background: #01b8e3;
    position: absolute;
    left: 0;
    top: 0;
  }
  .row-bottom-line{
    width: 60px;
    height: 1px;
    background: #01b8e3;
    position: absolute;
    left: 0;
    top: 170px;
  }
  .top-cue{
    width: 97px;
    height: auto;
    position: absolute;
    left: -47px;
    top: 16px;
    background: #ffffff;
    line-height: 30px;
  }
  .bottom-cue{
    width: 70px;
    height: auto;
    position: absolute;
    left: -32px;
    bottom: 16px;
    background: #ffffff;
    line-height: 30px;
  }
</style>
