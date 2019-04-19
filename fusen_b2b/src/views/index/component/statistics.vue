<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="19">
        <el-row :gutter="30">
          <el-col :span="6">
            <div class="grid-content purple">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="left-icon">
                    <img src="../../../assets/index/cir-purple.png" alt="">
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="right-text">
                    <div style="height: 50px"> <p @click="$router.push('/import/orderSearch')" style="color: rgb(147,127,228);cursor: pointer" class="money">{{statistics[0].value}}</p>
                      <p class="title">{{statistics[0].title}}</p></div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="6"><div class="grid-content orange">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="left-icon">
                  <img src="../../../assets/index/cir-orange.png" alt="">
                </div>
              </el-col>
              <el-col :span="16">
                <div class="right-text">
                  <div style="height: 50px"> <p style="color: rgb(248,175,65)" class="money">{{statistics[1].value}}</p>
                    <p class="title">{{statistics[1].title}}</p></div>
                </div>
              </el-col>
            </el-row>
          </div></el-col>
          <el-col :span="6"><div class="grid-content green">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="left-icon">
                  <img src="../../../assets/index/cir-green.png" alt="">
                </div>
              </el-col>
              <el-col :span="16">
                <div class="right-text">
                  <div style="height: 50px"> <p style="color: rgb(64,198,44)" class="money">{{statistics[2].value}}</p>
                    <p class="title">{{statistics[2].title}}</p></div>
                </div>
              </el-col>
            </el-row>
          </div></el-col>
          <el-col :span="6">
            <div style="cursor: pointer;box-shadow: 1px 1px 5px black" :style="{ background: activeColor}" class="grid-content" @click="placeOrder">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="left-icon">
                  <img src="../../../assets/index/cir.png" alt="">
                </div>
              </el-col>
              <el-col :span="16">
                <div class="right-text">
                  <p style="font-size: 20px; color: white">快速下单</p>
                </div>
              </el-col>
            </el-row>
          </div></el-col>
        </el-row>
      </el-col>
      <el-col :span="5">
        <div class="grid-content advertisement"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      activeColor: {
        type: String,
        default: ''
      },
      statistics: {
        type: Array,
        default: []
      },
      type: {
        type: String,
        default: ''
      },
      /**
       * 快速下单跳转地址
       * */
      jumpUrl: {
        type: String,
        default: ''
      }
    },
    methods: {
      placeOrder() {
        if (this.type === 'substitute') {
          this.$router.push(`/${this.type}/purchaseOrderList/detail`)
        } else if (this.type === 'fictitious') {
          this.$router.push(`/${this.type}/exportOrder`)
        }
        if (this.jumpUrl) {
          this.$router.push(this.jumpUrl)
        }
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
    background: url("../../../assets/index/bg-purple.png") no-repeat;
    background-size: 100% 100%;
  }
  .orange{
    background: url("../../../assets/index/bg-orange.png") no-repeat;
    background-size: 100% 100%;
  }
  .green{
    background: url("../../../assets/index/bg-green.png") no-repeat;
    background-size: 100% 100%;
  }
  .advertisement{
    background: url("../../../assets/index/ad.png");
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
