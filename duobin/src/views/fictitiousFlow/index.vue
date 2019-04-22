<template>
  <div class="flow-box" style="width: 1200px;height: 500px;margin-left: 20px;position: relative;">
    <div class="flow">
      <div class="new-box cursor" @click="$router.push('/fictitious/setupObject/addObject')">
        新增项目立项
      </div>
      <div class="line-box">
        <div class="col-line"></div>
        <div class="row-line">
          <div class="col-top-line">
            <div class="new-enter-box">
              <div class="new-order new-enter">
                <span class="cursor" @click="$router.push('/fictitious/material/importOrder')">新增进口订单</span>
                <div class="col-right-line">
                  <div class="row-add-line">
                    <div class="new-cue1">境外采购完成</div>
                    <div class="new-cue2">国内采购完成</div>
                    <div class="col-add-left"></div>
                    <div class="new-box new-add cursor" @click="$router.push('/fictitious/production/detail')">
                      关联加工生产
                    </div>
                    <div class="col-add-right">
                      <div class="row-addOrder-line">
                        <div class="new-cue1">加工完成</div>
                        <div class="new-cue2">审核通过</div>
                        <div class="col-top-line">
                          <div class="new-enter-box">
                            <div class="new-box new-enter">
                              <span class="cursor" @click="$router.push('/fictitious/exportOrder')">关联出口销售</span>
                              <div class="pay-apply-line">
                                <div class="pass-box">
                                  审核通过
                                </div>
                                <div class="flow-last purchase-pay">
                                  富森执行付款
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-bottom-line">
                          <div class="new-purchase-box">
                            <div class="new-box new-purchase">
                              <span class="cursor" @click="$router.push('/fictitious/payApply')">付款单</span>
                              <div class="pay-apply-line">
                                <div class="pass-box">
                                  审核通过
                                </div>
                                <div class="flow-last purchase-pay">
                                  富森执行付款
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="enter-top-line">
                  <div class="new-box enter-top">
                    <span class="cursor"  @click="$router.push('/import/payApply/payApplyDetail')">进口付款申请</span>
                    <div class="pay-apply-line">
                      <div class="pass-box">
                        审核通过
                      </div>
                      <div class="flow-last purchase-pay">
                        富森执行付款
                      </div>
                    </div>
                  </div>
                  <div class="enter-cue">审核通过</div>
                </div>
              </div>
            </div>
          </div>
          <div class="new-cue1">审核通过<br>采购境外原材料</div>
          <div class="col-bottom-line">
            <div class="new-purchase-box">
              <div class="new-purchase-order new-purchase">
                <span class="cursor" @click="$router.push('/fictitious/material/domPurchase/detail')">新增采购订单</span>
                <div class="col-right-line"></div>
                <div class="enter-bottom-line">
                  <div class="new-box enter-bottom">
                    <span class="cursor" @click="$router.push('/import/payApply/payApplyDetail')">采购付款申请</span>
                    <div class="pay-apply-line">
                      <div class="pass-box">
                        审核通过
                      </div>
                      <div class="flow-last purchase-pay">
                        富森执行付款
                      </div>
                    </div>
                  </div>
                  <div class="purchase-cue">审核通过</div>
                </div>
              </div>
            </div>

          </div>
          <div class="new-cue2">
            审核通过<br>采购国内原材料
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: ''
  }
</script>

<style scoped>
  .cursor{
    cursor: pointer;
  }
  *{
    margin: 0;
    padding: 0;
  }
  .flow{
    position: absolute;
    top: 60%;
    left: 0%;
  }
  .new-box{
    width: 120px;
    text-align: center;
    padding: 20px 10px;
    position: relative;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    border: 1px #01b8e3 solid;
    background-color: #fff;
    display: inline-block;
    top: 6px;
  }
  .new-order{
    width: 120px;
    text-align: center;
    padding: 20px 10px;
    position: relative;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    border: 1px #01b8e3 solid;
    background-color: #fff;
    display: inline-block;
    top: 6px;
  }
  .new-order:before{
    content: " ";
    position: absolute;
    top: -15px;
    left: 0;
    right: 0;
    /*bottom: 0;*/
    margin: 0 auto;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-bottom: 15px solid #01b8e3;
    border-right: 15px solid transparent;
  }
  .new-order:after {
    content: " ";
    position: absolute;
    top: -14px;
    left: 0;
    right: 0;
    /*bottom: 0;*/
    margin: 0 auto;
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-bottom: 14px solid #fff;
    border-right: 14px solid transparent;
  }
  .new-purchase-order {
    width: 120px;
    text-align: center;
    padding: 20px 10px;
    position: relative;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    border: 1px #01b8e3 solid;
    background-color: #fff;
    display: inline-block;
    top: 6px;
  }
  .new-purchase-order:before{
    content: " ";
    position: absolute;
    /*top: -15px;*/
    left: 0;
    right: 0;
    bottom: -15px;
    margin: 0 auto;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-top: 15px solid #01b8e3;
    border-right: 15px solid transparent;
  }
  .new-purchase-order:after{
    content: " ";
    position: absolute;
    /*top: -14px;*/
    left: 0;
    right: 0;
    bottom: -14px;
    margin: 0 auto;
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-top: 14px solid #fff;
    border-right: 14px solid transparent;
  }
  .new-box:before {
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

  .new-box:after {
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
  .line-box{
    position: relative;
    display: inline-block;
    margin-left: 15px;
  }
  .col-line{
    width: 60px;
    height: 1px;
    background: #01b8e3;
    display: inline-block;
  }
  .row-line{
    float: right;
    width: 1px;
    height: 200px;
    display: inline-block;
    background: #01b8e3;
    margin-top: -100px;
    position: relative;
  }
  .col-top-line{
    width: 80px;
    height: 1px;
    background: #01b8e3;
    display: inline-block;
    position: absolute;
    top: 0px;
    left: 0;
  }
  .col-bottom-line{
    width: 80px;
    height: 1px;
    background: #01b8e3;
    display: inline-block;
    position: absolute;
    bottom: 0px;
    left: 0;
  }
  .new-cue1 {
    width: 100px;
    height: auto;
    font-size: 14px;
    position: absolute;
    left: -50px;
    top: 20px;
    text-align: center;
    background: #ffffff;
  }
  .new-cue2{
    width: 100px;
    height: auto;
    font-size: 14px;
    position: absolute;
    left: -50px;
    bottom: 20px;
    text-align: center;
    background: #ffffff;
  }
  .new-enter-box,.new-purchase-box {
    position: absolute;
    top: -36px;
    left: 90px;
  }
  .enter-top-line {
    position: absolute;
    left: 60px;
    top: -83px;
    width: 1px;
    height: 60px;
    background: #01b8e3;
  }
  .enter-bottom-line{
    position: absolute;
    left: 60px;
    bottom: -83px;
    width: 1px;
    height: 60px;
    background: #01b8e3;
  }
  .enter-top{
    position: absolute;
    top: -72px;
    left: -60px;
  }
  .enter-bottom{
    position: absolute;
    top: 67px;
    left: -60px;
  }
  .enter-cue,.purchase-cue {
    position: absolute;
    top: 18px;
    left: -30px;
    width: 60px;
    height: auto;
    font-size: 14px;
    background: #ffffff;
  }
  .pay-apply-line{
    position: absolute;
    left: 141px;
    top: 30px;
    width: 80px;
    height: 1px;
    background: #01b8e3;
  }
  .purchase-pay{
    position: absolute;
    left: 80px;
    top: -30px;
  }
  .flow-last {
    width: 136px;
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
  .col-right-line{
    position: absolute;
    left: 139px;
    top: 30px;
    width: 80px;
    height: 1px;
    background: #01b8e3;
  }
  .row-add-line{
    position: absolute;
    left: 80px;
    top: 0;
    width: 1px;
    height: 200px;
    background: #01b8e3;
  }
  .col-add-left {
    position: absolute;
    width: 60px;
    height: 1px;
    background: #01b8e3;
    left: 0;
    top: 100px;
  }
  .new-add{
    position: absolute;
    top: 70px;
    left: 70px;
  }
  .col-add-right {
    position: absolute;
    left: 213px;
    top: 100px;
    width: 60px;
    height: 1px;
    background: #01b8e3;
  }
  .row-addOrder-line{
    width: 1px;
    height: 200px;
    background: #01b8e3;
    position: absolute;
    left: 60px;
    top: -100px;
  }
  .pass-box{
    position: absolute;
    left: 10px;
    top: -10px;
    width: 60px;
    height: auto;
    background: #ffffff;
    font-size: 14px;
  }
</style>
