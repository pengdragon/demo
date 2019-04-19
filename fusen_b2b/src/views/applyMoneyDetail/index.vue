<template>
  <div class="content-wrapper">
    <div class="orderNum">单据编号：987655</div>
    <el-row>
      <el-col class="form-wrapper">
        <div class="title">基本信息</div>
        <el-form :label-width="'110px'"
                 :model="formData"
                 size="small"
                 class="form-content">
          <el-form-item label="富森订单号：" class="formItem">
            <el-input v-model="formData.fusenOrder"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="申请退税金额：" class="formItem">
            <el-input v-model="formData.drawbackMoney"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="收款银行：" class="formItem term">
            <el-input v-model="formData.receivablesBank"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="收款账号：" class="formItem">
            <el-input v-model="formData.receivablesAmount"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="备注:" class="formItem">
            <el-input v-model="formData.desc"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="upload-wrapper">
        <div class="make-content">
          <span class="makeTime">制单时间: 2018-03-14 18:22:50</span>
          <span class="maker">制单人: 杨朝妮</span>
        </div>
      </el-col>
      <el-col class="submit-wrapper">
        <el-button type="info" @click="$router.push('/orderSearch/index')">返回</el-button>
        <el-button type="primary" @click="submitHandle(0)">打印</el-button>
        <el-button type="primary" @click="submitHandle(0)">保存</el-button>
        <el-button style="background: #42B983;color: #fff;" @click="submitHandle(0)">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: 1,
        formData: {
          fusenOrder: '', // 富森订单号
          drawbackMoney: '', // 申请退税金额
          receivablesBank: '', // 收款银行
          receivablesAmount: '', // 收款账号
          desc: '' // 备注
        }
      }
    },
    methods: {

    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 15px 0 90px 20px;
    min-height: 794px;
  .title{
    display: block;
    height: 22px;
    line-height: 22px;
    padding-left: 12px;
    border-left: 2px solid #01B8E1;
    font-size: 17px;
    font-weight: 600;
    color: #09BAE3;
    margin-bottom: 15px;
  }
  .orderNum{
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .form-content {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
  .radioBox{
    -webkit-box-flex: 0;
    -ms-flex: 0 0 40%;
    flex: 0 0 100%;
  }
  .formItem {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 40%;
    flex: 0 0 40%;
  .inputBox{
    width: 360px;
  }
  .inputName{
    width: 120px;
  }
  .inputNum{
    width: 100px;
    margin-right: 5px;
  }
  .inputTel{
    width: 235px;
  }
  }
  .Shipments{
    flex: 0 0 100%;
  }
  }
  .upload-wrapper{
    width: 530px;
    margin-top: 30px;
  .make-content{
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 30px;
    font-size: 14px;
  }
  .upload-content{
    margin-bottom:10px;
  .el-upload__tip{
    display: inline-block;
    margin-left: 10px;
  }
  }
  }
  .submit-wrapper{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    position: absolute;
    right: 20px;
    bottom: 0px;
  }
  }
</style>
