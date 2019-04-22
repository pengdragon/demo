<template>
  <div class="content-wrapper">
    <el-row>
      <el-col>
        <div class="order-content" :class=" { borderNone: isBorderNone } ">
          <div class="title">项目信息</div>
          <el-form label-position="right" class="form-content" ref="formMain" :rules="orderRules" size="small" :model="order" label-width="155px" >
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="项目平台：" prop="invHead">
                  <el-select v-model="order.invHead" class="inputBox" v-if="editState" placeholder="请选择"  @change="startISnvHead">
                    <el-option
                      v-for="pur in purchaser"
                      :key="pur.value"
                      :label="pur.label"
                      :value="pur.label">
                    </el-option>
                  </el-select>
                  <div v-else>{{order.invHead}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内部项目号：" prop="customerNo">
                  <el-input class="inline-input inputBox"  v-if="editState" v-model="order.customerNo"  placeholder="内部项目号"></el-input>
                  <div v-else>{{order.customerNo}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品名：" prop="xmPartName">
                  <el-input class="inline-input inputBox" v-if="editState" v-model="order.xmPartName"  placeholder="品名"></el-input>
                  <div v-else>{{order.xmPartName}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="型号：" prop="productName">
                  <el-input class="inline-input inputBox" v-if="editState" v-model="order.productName"  placeholder="型号"></el-input>
                  <div v-else>{{order.productName}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机屏幕尺寸(寸)：" prop="yjsNum">
                  <el-input class="inline-input inputBox" v-if="editState" v-model="order.yjsNum"  placeholder="手机屏幕尺寸"></el-input>
                  <div v-else>{{order.yjsNum}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="整机和套料：" prop="totalorPart">
                  <el-select v-model="order.totalorPart" class="inputBox" v-if="editState" placeholder="请选择"  >
                    <el-option
                      v-for="pur in talorPart"
                      :key="pur.value"
                      :label="pur.label"
                      :value="pur.value">
                    </el-option>
                  </el-select>
                  <div v-else>{{order.totalorPart}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="尾款方式：" prop="lastPay">
                  <el-select v-model="order.lastPay" class="inputBox" v-if="editState" placeholder="请选择"  >
                    <el-option
                      v-for="pur in lastpayValue"
                      :key="pur.value"
                      :label="pur.label"
                      :value="pur.value">
                    </el-option>
                  </el-select>
                  <div v-else>{{order.lastPay}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="付费类型：" prop="settleType">
                  <el-select v-model="order.settleType" class="inputBox" v-if="editState" placeholder="请选择"  >
                    <el-option
                      v-for="pur in settleTypeValue"
                      :key="pur.value"
                      :label="pur.label"
                      :value="pur.value">
                    </el-option>
                  </el-select>
                  <div v-else>{{order.settleType}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="海外客户：">
                  <el-input class="inline-input inputBox" v-if="editState" v-model="order.vendorName"  placeholder="海外客户"></el-input>
                  <div v-else>{{order.vendorName}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单币别：" prop="orderCurrency">
                  <el-select v-model="order.orderCurrency" class="inputBox" v-if="editState" placeholder="请选择" >
                    <el-option
                      v-for="item in currency"
                      :key="item.orderCurrency"
                      :label="item.orderCurrency"
                      :value="item.orderCurrency">
                    </el-option>
                  </el-select>
                  <div v-else>{{order.orderCurrency}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数量：" prop="pQty">
                  <el-input class="inline-input inputBox" type="number" v-if="editState" v-model.number="order.pQty"  @change="handlerPageNo"  placeholder="数量"></el-input>
                  <div v-else>{{order.pQty}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单价：" prop="pPrice">
                  <el-input class="inline-input inputBox" v-if="editState" v-model.number="order.pPrice"  @change="handlerPageNo" type="number" placeholder="单价"></el-input>
                  <div v-else>{{order.pPrice}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="金额：" prop="customsAmount">
                  <el-input class="inline-input inputBox" v-if="editState" v-model="order.customsAmount" disabled placeholder="金额"></el-input>
                  <div v-else>{{order.customsAmount}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="备注：">
                  <el-input type="textarea" class="inline-input" v-if="editState" v-model="order.remark"  placeholder=""></el-input>
                  <div v-else>{{order.remark}}</div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-col class="upload-wrapper">
            <div class="title" v-if="editState">附件上传</div>
            <el-upload
              class="upload-content"
              accept=".xls,.xlsx,.txt,.doc,.docx,.pdf"
              :data="parameter"
              :action="`${ baseUrl }/file/upload`"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              multiple
              :file-list="fileList">
              <el-button v-if="editState" size="small" type="primary">点击上传</el-button>
              <div v-if="editState" slot="tip" class="el-upload__tip">支持上传文件:表格(*.xls;*.xlsx) 文档(*.txt,*.doc,*.docx,*.pdf)</div>
              <div v-else slot="tip" style="font-size: 16px;font-weight: bold;color: #1F9BD6;">附件列表:</div>
            </el-upload>
          </el-col>
          <div style="text-align: right;margin-top: 20px">
            <el-button type="primary" @click="saveOrder('0')" v-if="editState" :disabled="isAuditing">暂存</el-button>
            <el-button type="success" @click="saveOrder('1')" v-if="editState">提交</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import req from '@/utils/req'
  import api from '@/utils/apiUtil'
  import uploadCmp from '@/components/uploadCmp'
  export default {
    data() {
      return {
        isBorderNone: false, // 页面不可编辑状态
        editState: true, // 页面可编辑状态
        showUpload: false, // 文件导入弹窗
        isAuditing: false,
        orderNumber: '',
        order: {
          itemId: '',
          fsOrderNo: '',
          customerNo: '',
          xmPartName: '',
          invHead: '',
          productName: '',
          pPrice: '0',
          pQty: '0',
          customsAmount: '',
          customsTakeGoodsUnitFK: '',
          orderCurrency: '',
          yjsNum: '',
          settleType: '',
          vendorName: '',
          remark: '',
          totalorPart: '',
          lastPay: '',
          orderStatus: '',
          orderDate: '', // 项目创建日期
          sysCreatedDate: '', // 第一次创建日期
          file: [
          ]
        },
        orderRules: {
          invHead: [
            { required: true, message: '请选择收项目平台', trigger: 'change' }
          ],
          orderCurrency: [
            { required: true, message: '请选择订单币别', trigger: 'change' }
          ],
          xmPartName: [
            { required: true, message: '请填写品名', trigger: 'blur' }
          ],
          customerNo: [
            { required: true, message: '请填写内部项目号', trigger: 'blur' }
          ],
          productName: [
            { required: true, message: '请填写型号', trigger: 'blur' }
          ],
          yjsNum: [
            { required: true, message: '请填写手机屏幕尺寸', trigger: 'blur' }
          ],
          totalorPart: [
            { required: true, message: '请选择整机和套料', trigger: 'change' }
          ],
          lastPay: [
            { required: true, message: '请选择尾款方式', trigger: 'change' }
          ],
          pQty: [
            { required: true, message: '请填写数量', trigger: 'change' }
          ],
          pPrice: [
            { required: true, message: '请填写单价', trigger: 'change' }
          ],
          customsAmount: [
            { required: true }
          ],
          settleType: [
            { required: true, message: '请选择付款类型', trigger: 'change' }
          ]
        },
        parameter: {
          orderId: '0006C275-0000-0000-0000-00000E97FDBC',
          customId: '736CA29F-0B32-409C-9159-64F1C3EDD949'
        },
        baseUrl: window.g.baseUrl, // 请求基础地址
        fileList: [ // 页面显示文件列表
        ],
        currency: [
        ],
        talorPart: [
          {
            label: '整机',
            value: '整机'
          },
          {
            label: '套料',
            value: '套料'
          }
        ],
        lastpayValue: [
          {
            label: 'LC',
            value: 'LC'
          },
          {
            label: 'TT',
            value: 'TT'
          }
        ],
        settleTypeValue: [
          {
            label: '垫资',
            value: '垫资'
          },
          {
            label: '非垫资',
            value: '非垫资'
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
    components: {
      uploadCmp
    },
    created() {
      if (this.$route.query.status) {
        this.getOrderDetail()
        if (this.$route.query.status !== '暂存') {
          // 已审核后的输入框按钮状态
          this.editState = false
        }
      }
      // this.oederDetail.push({})
      this.getCurrency()
      // this.getOrderNumber()
    },
    methods: {
      // 获取币别
      getCurrency() { // 币别
        req.get('api/import/baseinfo/currency', {
          params: {
            businessCode: 1
          }
        }).then((res) => {
          this.currency = res.currencyLst
        }).catch((error) => {
          console.log(error)
        })
      },
      // 获取订单id
      getOrderNumber() {
        req.get('api/import/order/orderinfo/getid').then((res) => {
          // this.order.itemId = res.orderId
        }).catch((error) => {
          console.log(error)
        })
      },
      saveOrder(val) {
        this.order.orderStatus = val
        this.orderList()
      },
      /**
      *** 自动计算总金额
       **/
      handlerPageNo() {
        const pPrice = this.order.pPrice
        const pQty = this.order.pQty
        this.order.customsAmount = pPrice * pQty
      },
      // 保存订单
      orderList() {
        let weate = new Date()
        this.order.orderDate = api.getTime(weate)
        if (this.order.sysCreatedDate === '') {
          this.order.sysCreatedDate = api.getTime(weate)
        }
        let jsonStr = this.order
        console.log(jsonStr)
        // 订单保存/提交
        this.$axios.post('api/virtual/order/itemSaveOrCommit', jsonStr).then((res) => {
          if (res.result === 'success') {
            this.$notify({
              title: '订单保存成功',
              message: res.msg,
              type: 'success'
            })
            console.log(res)
          }
          this.$refs.formMain.resetFields()
          this.$router.replace('/fictitious/setupObject')
        }).catch((error) => {
          console.log(`保存/提交 ${error}`)
          // 失败时重置状态
          this.order.status = '0'
        })
      },
      getOrderDetail() {
        req.get('api/virtual/order/getItemInfo', {
          params: {
            itemId: this.$route.query.id
          }
        }).then((res) => {
          this.order = res.data
          this.parseFileList()
        }).catch((error) => {
          console.log(error)
        })
      },
      startISnvHead(val) {
        this.order.customsTakeGoodsUnitFK = val
      },
      /**
       * 序列化fileList
       * */
      parseFileList() {
        let baseUrl = this.baseUrl
        this.order.file.map((file) => {
          this.fileList.push({
            id: file.id,
            name: file.fileName,
            url: `${baseUrl}file/download/${file.fileId}`
          })
        })
      },
      /**
       * 文件上传后
       * */
      handleChange(file) {
        if (file.response) {
          this.order.file.push({
            fileName: file.raw.name,
            fileType: file.raw.name.split('.')[1],
            fileId: file.response.fileId
          })
        }
      },
      /**
       * 删除对应文件
       * */
      handleRemove({ response }) {
        if (response) {
          const id = response.fileId
          req.post('api/import/file/fileinfo/del', {
            id
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '附件删除成功',
              type: 'success'
            })
          }).catch((error) => {
            console.log(error)
          })
          this.order.file = this.order.file.filter((v) => {
            return v.fileId !== id
          })
        }
      },
      /**
       * 预览下载对应文件
       * */
      handlePreview(file) {
        let url
        if (file.url) {
          url = file.url
        } else {
          let fileId = file.response.fileId
          let baseUrl = window.g.baseUrl
          url = `${baseUrl}file/download/${fileId}`
        }
        let link = document.createElement('a')
        link.setAttribute('href', url)
        link.click()
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    padding: 10px 20px;
    min-width: 1310px;
    .form-content {
      margin-top: 20px;
      .inputBox{
        width: 276px;
      }
    }
    .order-content{
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
  /*.borderNone{
    input{
      border: 0px !important;}
    .el-input.is-disabled {
      .el-input__inner{background-color: transparent}
      .el-input__icon{
        color: transparent;}
    }
  }*/
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
