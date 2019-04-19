<template>
  <footer>
    <div class="footer-top">
      <div class="fl-container">
        <el-row>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <div class="logoLeft"><img src="../../../assets/img/logo.png" class="addIcon"/></div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light singleSolid">
              <div  class="header clearfix">
                <span>服务热线</span>
              </div>
              <div v-for="item in items"  class="text item">
                {{item.message }}
              </div>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="grid-content bg-purple singleSolid">
              <div  class="header clearfix">
                <span>深圳市富森供应链管理有限公司</span>
              </div>
              <div v-for="addres in address"  class="text item">
                {{addres.message }}
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light singleSolid">
              <div class="el-card__body wechat" style="padding: 0">
                <img data-v-51a1741d="" src="../../../assets/img/Wechat.png" class="image">
                <div data-v-51a1741d="">公司官方微信</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="keepOnRecord">版权所有@深圳市富森供应链管理有限公司    粤ICP备14051101号-3</div>
  </footer>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          { message: '0755-83573650' },
          { message: '深圳市富森供应链管理有限公司' }
        ],
        address: [
          { message: '地址：深圳市福田区中心五路18号星河发展中心大厦7楼' },
          { message: '电话：0755-83573650' },
          { message: '传真：0755-83588299' }
        ]
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" >
  .fl-container{width: 1230px;margin-left: auto;margin-right: auto;padding-left: 15px;padding-right: 15px}
  .fl-container:after, .fl-container:before{    display: table;content: " ";}
  .footer-top{
    background-color: #2d3a4b;
    padding-bottom: 25px;padding-top: 25px;
    .grid-content{height: 120px;
      .logoLeft{
        line-height: 120px;
      }
    }
    .singleSolid{
      border-left: 1px solid #4d565c;
      padding-left: 60px;
      .wechat{
        font-size: 12px;
        color: rgb(118, 119, 120);
        text-align: center;
        div{
          padding: 5px 0;}
      }
    }
    .header{
      margin-bottom: 20px;
      color: #ffffff;
    }
    .item{
      font-size: 12px;
      color:#767778;
      line-height: 25px;
    }
  }
  .keepOnRecord{    text-align: center;font-size: 12px;color: #5f5f5f;line-height: 40px;background: #292a2c;}
</style>
