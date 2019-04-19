<template>
  <div class="content-wrapper">
    <el-row>
      <el-col :span="20">
        <div class="order-content">
          <div class="title">基本信息</div>
          <el-form label-position="right" :model="order" label-width="100px">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="采购方：">
                  <el-input class="inline-input borderNone" v-model="order.invHead" :readonly = true></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单币别：">
                  <el-input class="inline-input borderNone" v-model="order.orderCurrency" :readonly = true></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内部项目号：">
                  <el-input class="inline-inpu borderNone" v-model="order.customerNo" :readonly = true></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="海外客户：">
                  <el-input class="inline-input borderNone" v-model="order.vendorName" :readonly = true></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机屏幕尺寸：">
                  <el-input class="inline-input borderNone" v-model="order.yjsNum" :readonly = true></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="整机和套料：">
                  <el-input class="inline-input borderNone" v-model="order.totalorPart" :readonly = true></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="尾款方式：">
                  <el-input class="inline-input borderNone" v-model="order.lastPay" :readonly = true></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="付费类型：">
                  <el-input class="inline-input borderNone" v-model="order.settleType" :readonly = true></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="备注：">
                  <el-input type="textarea" class="inline-input borderNone" v-model="order.remark" placeholder="备注" :readonly = true></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="title">立项明细</div>

          <el-table :data="order.oederDetail" class="table-main" border>
            <el-table-column prop="inObjectNum" label="料号" align="center">
              <template slot-scope="prop">
                <div class="tmpContent">
                  <el-input class="inline-input" v-model="prop.row.custPartNo" placeholder="料号"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="品名" align="center">
              <template slot-scope="prop">
                <div class="tmpContent">
                  <el-input class="inline-input" v-model="prop.row.partName" placeholder="品名"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="model" label="出口型号" align="center">
              <template slot-scope="prop">
                <div class="tmpContent">
                  <el-input class="inline-input" v-model="prop.row.spec" placeholder="出口型号"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="price"
                             label="项目单价" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.price" placeholder="单价"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="项目数量" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.quantity" placeholder="项目数量"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.amount" placeholder="金额"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="orderCurrency" label="币别" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.orderCurrency" placeholder="币别"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.unit" placeholder="单位"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="vendorName" label="供应商" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.vendorName" placeholder="供应商"></el-input>
              </template>
            </el-table-column>
          </el-table>

          <div class="title">附件上传</div>
          <el-upload
            class="upload-file"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList" disabled>
          </el-upload>
          <div style="text-align: right;margin-top: 20px">
            <el-button type="info" @click="$router.push('/fictitious/setupObject')">返回</el-button>
            <el-button type="warning">退回</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="4"><div style="font-size: 12px;text-align: right">订单号：{{orderNumber}}</div></el-col>
    </el-row>
  </div>
</template>

<script>
  import req from '@/utils/req'
  export default {
    data() {
      return {
        orderNumber: '',
        order: {
          orderNumber: '',
          invHead: '',
          customerNo: '',
          orderCurrency: '',
          yjsNum: '',
          totalorPart: '',
          lastPay: '',
          settleType: '',
          vendorName: '',
          remark: '',
          oederDetail: [
            {
              custPartNo: '',
              partName: 'LED灯',
              spec: 'SR',
              unit: '个',
              price: '10',
              quantity: 10,
              amount: 10,
              vendorName: '',
              orderCurrency: '深圳'
            }
          ]
        },
        fileList: [
          {
            name: 'PO附件.doc',
            url: ''
          },
          {
            name: '其他附件.doc',
            url: ''
          }
        ],
        currencyValue: '',
        purchaserValue: '',
        purchaser: [{
          value: '0002D787-0000-0000-0000-00005A20515A',
          label: '研祥智能科技股份有限公司'
        }, {
          value: '000F03F3-0000-0000-0000-000075C76C98',
          label: '深圳市吉而泰电子有限公司'
        }, {
          value: '2D27659B-F2A7-4DF2-83A0-5E9ADD682F23',
          label: '遵义市四海实业有限公司'
        }]
      }
    },
    created() {
      // this.oederDetail.push({})
      this.getCurrency()
      this.getOrderNumber()
    },
    methods: {
      // 获取币别
      getCurrency() {
        req.get('api/import/baseinfo/currency').then((res) => {
          this.currency = res.currencyLst[0].orderCurrency
        }).catch((error) => {
          console.log(error)
        })
      },
      // 获取订单号
      getOrderNumber() {
        req.get('api/import/baseinfo/dedaulttakeno').then((res) => {
          this.orderNumber = res.takeNoLst.orderNumber
        }).catch((error) => {
          console.log(error)
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除${file.name}？`)
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    padding: 10px 20px;
    min-width: 1310px;
    .order-content{
      width: 1110px;
      .title{
        border-left: 3px solid #1F9BD6;
        margin: 20px 0;
        padding-left: 20px;
        color: #1F9BD6;
      }
    }
    .upload-file{
      margin-bottom: 20px;
    }
    .el-upload__tip{
      display: inline-block;
      margin-left: 20px;
      color: rgb(178,178,178)
    }
  }
</style>
<style lang="scss">
  .borderNone input{border:0px}
  .table-main{
    .cell{
      .el-input{
        input{
          text-align: center;
          border: none;
          background-color: transparent;
        }
      }
      .el-input__inner{
        padding: 0;
      }
      .el-textarea{
        textarea{
          text-align: center;
          border: none;
          background-color: transparent;
        }
      }
    }
    tbody{
      td{
        padding: 0;
      }
    }
  }
</style>
