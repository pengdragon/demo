<template>
  <el-header>
    <div class="container">
      <div class="heardName">
        <div class="logoLeft"><img src="../../../assets/img/logo.png" class="addIcon"/></div>
        <div class="nemeLeft">综合服务平台</div>
      </div>
    </div>
  </el-header>
</template>

<script>


</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-header{
  height: 80px;
  background-color: #1f9bd6;
  color: #fff;
  .container{
    width: 1230px;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    .heardName{
      padding-top:5px;
      padding-bottom:5px;
      .logoLeft{
        border-right: 1px solid #fff;
      }
      .logoLeft,.nemeLeft{
        padding-left: 10px;
        padding-right: 10px;
        font-size: 18px;
        line-height: 50px;
        display: inline-block;
        img{vertical-align: middle}
      }
    }
  }
}
</style>


