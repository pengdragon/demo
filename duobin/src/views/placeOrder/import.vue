<template>
  <baseLayout v-loading="loadState">
    <div slot="top" v-if="!$route.query.id">
      <mButton :active="activeIndex === 1"
               @click="activeIndex = 1">手动导入</mButton>
      <mButton :active="activeIndex === 2"
               style="margin-left: 20px;"
               @click="activeIndex = 2">模板导入</mButton>
      <mButton :active="activeIndex === 3"
               style="margin-left: 20px;"
               @click="activeIndex = 3">开放接口</mButton>
    </div>
    <div slot="msg1" v-if="activeIndex !== 3">
      <div v-show="activeIndex === 1">
        <div class="title">基本信息</div>
        <el-form :model="order"
                 :rules="rules"
                 ref="formMain"
                 label-position="left"
                 label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="国内供应商:" prop="supplier">
                <el-select v-model="order.supplier"
                           v-if="editStatus"
                           filterable
                           default-first-option
                           placeholder="请选择">
                  <el-option
                    v-for="sup in supplier"
                    :key="sup.name"
                    :label="sup.name"
                    :value="sup.name">
                  </el-option>
                </el-select>
                <div v-else>
                  {{order.supplier}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单币别:" prop="currency">
                <el-select v-model="order.currency"
                           v-if="editStatus"
                           placeholder="请选择">
                  <el-option
                    v-for="cur in currency"
                    :key="cur.orderCurrency"
                    :label="cur.orderCurrency"
                    :value="cur.orderCurrency">
                  </el-option>
                </el-select>
                <div v-else>
                  {{order.currency}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="numberId"
                            label="单据编号:">
                <el-select v-model="order.fusenOrder"
                           @change="numberIdChange"
                           v-if="editStatus">
                  <el-option
                    v-for="item in takeno"
                    :key="item.fusenOrder"
                    :label="item.fusenOrder"
                    :value="item.fusenOrder">
                  </el-option>
                </el-select>
                <div v-else>
                  {{order.fusenOrder}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否垫资:" prop="settleType">
                <div v-if="settleType === '2' || settleType === '3'">
                  不垫资
                </div>
                <div v-else-if="editStatus">
                  <el-radio v-model="order.settleType" :disabled="judgement" label="1">垫付</el-radio>
                  <el-radio v-model="order.settleType" label="2">不垫付</el-radio>
                </div>
                <div v-else>
                  {{order.supplier}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="isOrder"
                            prop="customOrder"
                            label="我的订单号:">
                <el-input v-model="order.customOrder"
                          v-if="editStatus"></el-input>
                <div v-else>
                  {{order.customOrder}}
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="activeIndex === 2"
           class="dialog-content">
        <div class="title">
          上传订单模板
        </div>
        <el-upload
          class="upload-content"
          accept=".xlsx"
          :data="parameter"
          :action="`${ baseUrl }/file/upload`"
          :on-success="oneKeyCreatedOrder"
          :multiple="false"
          drag>
          <div class="clickBtn">选择文件上传</div>
          <div class="bottom-tip-1">也可拖拽文件到该区域,完成上传</div>
          <div class="bottom-tip-2">只支持 (.xlsx)格式文件上传</div>
          <div class="bottom-tip-3">*只能上传模板格式文件,不可进行删除或修改,否则导致匹配错误,上传失败</div>
        </el-upload>
        <div class="download-model"
             @click="downloadModel">下载模板</div>
      </div>
    </div>
    <div slot="msg2" v-if="activeIndex === 1">
      <div class="title">
        订单明细
        <el-button v-if="editStatus"
                   style="float: right;"
                   type="primary"
                   size="small"
                   @click="addDetail">新增</el-button>
      </div>
      <el-table
        :data="order.lst"
        show-summary
        :summary-method="getSummaries">
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="productName" label="品名" width="160" align="center">
          <template slot-scope="prop">
            <el-input v-model="prop.row.productName"
                      v-if="editStatus"
                      size="mini"
                      placeholder="品名"></el-input>
            <div v-else>
              {{prop.row.productName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="model" label="型号" align="center">
          <template slot-scope="prop">
            <el-input size="mini"
                      v-if="editStatus"
                      v-model="prop.row.model"
                      placeholder="型号"></el-input>
            <div v-else>
              {{prop.row.model}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center">
          <template slot-scope="prop">
              <el-input v-if="editStatus"
                        v-model="prop.row.unit"
                        size="mini"
                        placeholder="单位"></el-input>
            <div v-else>
              {{prop.row.unit}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价" align="center">
          <template slot-scope="prop">
            <el-input v-model.number="prop.row.unitPrice"
                      v-if="editStatus"
                      type="number"
                      size="mini"
                      placeholder="单价"></el-input>
            <div v-else>
              {{prop.row.unitPrice}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="数量" align="center">
          <template slot-scope="prop">
            <el-input v-model.number="prop.row.amount"
                      v-if="editStatus"
                      type="number"
                      size="mini"
                      placeholder="数量"></el-input>
            <div v-else>
              {{prop.row.amount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额" width="180" align="center">
          <template slot-scope="prop">
            {{prop.row.money = prop.row.unitPrice * prop.row.amount}}
          </template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" align="center">
          <template slot-scope="prop">
            <el-input v-model="prop.row.brand"
                      v-if="editStatus"
                      size="mini"
                      placeholder="品牌"></el-input>
            <div v-else>
              {{prop.row.brand}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="origin" label="产地" align="center">
          <template slot-scope="prop">
            <el-input v-if="editStatus"
                      size="mini"
                      v-model="prop.row.origin"
                      placeholder="产地"></el-input>
            <div v-else>
              {{prop.row.origin}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="editStatus">
          <template slot-scope="scope">
            <div @click="delDetail(scope.row,scope.$index)" delBtn></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="msg3" v-if="activeIndex === 1 && (editStatus || (order.file && order.file.length))">
      <div class="title">
        附件信息
      </div>
      <mUpload :file-list-data="order.file || []"
               :disabled="!editStatus"
               acceptType=".xlsx"
               @success="fileUploadSuccess"></mUpload>
    </div>
    <div slot="button" v-show="activeIndex === 1">
      <div style="text-align: right;" v-if="editStatus">
        <el-button type="info"
                   :loading="btnLoading"
                   @click="submitHandle('0')">暂存</el-button>
        <el-button type="success"
                   :loading="btnLoading"
                   @click="submitHandle('1')">提交</el-button>
      </div>
    </div>
  </baseLayout>
</template>

<script>
  import req from '@/utils/req'
  import baseLayout from '@/components/detailsBaseLayout'
  import mUpload from '@/components/mUpload'
  export default {
    data() {
      return {
        btnLoading: false, // 按钮状态
        isOrder: true, // 是否显示我的订单
        editStatus: true, // 当前订单可编辑状态
        loadState: false, // 全局加载状态
        judgement: false, // 垫资禁用状态
        goodsTagData: [
          {
            label: '品名',
            prop: 'productName',
            width: ''
          },
          {
            label: '型号',
            prop: 'model',
            width: ''
          },
          {
            label: '单位',
            prop: 'unit',
            width: ''
          },
          {
            label: '单价',
            prop: 'unitPrice',
            width: ''
          },
          {
            label: '数量',
            prop: 'amount',
            width: ''
          },
          {
            label: '金额',
            prop: 'money',
            width: ''
          },
          {
            label: '品牌',
            prop: 'brand',
            width: ''
          },
          {
            label: '产地',
            prop: 'origin',
            width: ''
          }
        ],
        settleType: '1', // 垫资不垫资状态
        unitValidate: '1', // 单位状态
        originValidate: '1', // 产地状态
        order: { // 表单数据
          orderId: '',
          supplier: '',
          currency: '',
          settleType: '',
          customOrder: '',
          fusenOrder: '',
          numberId: '',
          status: '0',
          money: 0,
          lst: [
            {
              productName: '',
              model: '',
              unit: '',
              unitPrice: 0,
              amount: '',
              money: 0,
              brand: '',
              origin: ''
            }
          ],
          file: []
        },
        rules: { // 表单规则
          supplier: [{ required: true, message: '请选择国内供应商', trigger: 'blur' }], // 出货方式
          settleType: [{ required: true, message: '请选择是否垫资', trigger: 'blur' }], // 出货方式
          numberId: [{ required: true, message: '请选择单据编码', trigger: 'blur' }], // 单据编码
          currency: [{ required: true, message: '请选择订单币别', trigger: 'blur' }] // 出货方式
        },
        currency: [], // 币别列表
        supplier: [], // 供应商列表
        activeIndex: 1, // 按钮控制索引
        baseUrl: window.g.baseUrl, // 基础地址
        parameter: { // 上传文件id
          orderId: '0006C275-0000-0000-0000-00000E97FDBC',
          customId: '736CA29F-0B32-409C-9159-64F1C3EDD949'
        },
        takeno: [] // 富森订单
      }
    },
    components: {
      baseLayout,
      mUpload
    },
    created() {
      // 获取基础信息
      this.getSupplier()
      this.getCurrency()
      this.getLoaning()
      this.isMyOrder()
      this.initFsOrder()
    },
    activated() {
      // 父组件传来的订单号获取对象
      let orderId = this.$route.query.id
      orderId && this.getOrderObj(orderId)
    },
    methods: {
      numberIdChange(selected) {
        let item = this.takeno.filter((val) => {
          return val.fusenOrder === selected
        })
        this.order.numberId = item.numberId
      },
      /**
       * 获取numberId
       * */
      initFsOrder() { // 获取富森单号
        req.get('/api/import/baseinfo/takeno').then((res) => {
          if (res.data && Array.isArray(res.data)) {
            res.data.forEach((val) => {
              this.takeno.push({
                fusenOrder: val.fusenOrder,
                numberId: val.numberId
              })
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 文件上传成功
       * */
      fileUploadSuccess(fileItem) {
        this.order.file.push({
          fileName: fileItem.name,
          fileType: fileItem.raw.type,
          ftypename: '',
          fileId: fileItem.response.fileId
        })
      },
      /**
       * 下载模板
       * */
      downloadModel() {
        let link = document.createElement('a')
        let downloadModelUrl = 'http://test.fusen.net.cn/file/download/5c087bfaea1c9c6fa42465c3'
        link.setAttribute('href', downloadModelUrl)
        link.click()
      },
      /**
       * 生成订单ID
       * */
      async getOrderId() {
        let result = await req.get('api/import/order/orderinfo/getid').catch((error) => {
          console.log(error)
        })
        return result
      },
      /**
       * 一键上传生成订单
       * */
      async oneKeyCreatedOrder(file) {
        // 生成订单
        this.loadState = true
        // 获取ID
        const orderId = this.getOrderId() || ''
        // 请求生成订单
        req.get('api/import/order/orderinfo/twosaveexcelorder', {
          params: {
            fileId: file.fileId,
            orderId
          }
        }).then((res) => {
          this.$notify({
            title: '订单生成成功',
            message: res.msg,
            type: 'success'
          })
          // 关闭动画
          this.loadState = false
          // 路由到跳转
          this.$router.push({ path: '/import/orderSearch/orderDetail', query: { id: orderId }})
        }).catch((error) => {
          this.loadState = false
          console.log(error)
        })
      },
      /**
       * 订单提交/保存操作
       * */
      async submitHandle(type) {
        this.btnLoading = true
        let jsonStr = JSON.parse(JSON.stringify(this.order))
        if (!jsonStr.orderId) {
          let result = await this.getOrderId()
          jsonStr.orderId = result.orderId
        }
        jsonStr.status = type
        jsonStr = JSON.stringify(jsonStr)
        // 订单保存/提交
        req.post('api/import/order/orderinfo/save', { jsonStr }).then((res) => {
          this.btnLoading = false
          if (res.result === 'success') {
            this.$notify({
              title: '订单操作成功',
              message: res.msg,
              type: 'success'
            })
            const originValidate = res.data.lst[0].originValidate
            const unitValidate = res.data.lst[0].unitValidate
            this.ievent({ originValidate, unitValidate })
            // 数据重置
            Object.assign(this.order, this.$options.data().order)
            this.$store.dispatch('delVisitedViews', { fullPath: this.$route.fullPath })
            // 关闭当前标签页
            this.$router.replace('/import/orderSearch')
          }
        }).catch((error) => {
          this.btnLoading = false
          // 失败时重置状态
          console.log(`保存/提交 ${error}`)
        })
      },
      // 获取订单详情
      getOrderObj(orderId) {
        this.loadState = true
        req.get('api/import/order/orderinfo/objectquery', {
          params: {
            orderId
          }
        }).then((res) => {
          this.order = res.obj
          if (this.settleType === '1') {
            this.order.settleType = '1'
          } else if (this.settleType === '2') {
            this.order.settleType = '2'
            this.judgement = true
          } else if (this.settleType === '3') {
            this.order.settleType = ''
          }
          this.unitValidate = this.order.lst[0].unitValidate
          this.originValidate = this.order.lst[0].originValidate
          this.loadState = false
          if (res.obj.status === '保存') {
            this.editStatus = true
          } else {
            this.editStatus = false
          }
        }).catch((error) => {
          console.log(`获取订单对象 ${error}`)
          this.loadState = false
        })
      },
      // 表格数据自定义求和
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价'
            return
          }
          if (index === 5 || index === 6) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            } else {
              sums[index] = ''
            }
          }
        })
        let num = sums[6]
        this.order.money = num
        return sums
      },
      // 删除订单明细
      delDetail(row, index) {
        if (!row.id) {
          this.order.lst.splice(index, 1)
          return
        }
        req.get('api/import/order/orderinfo/removegoods', {
          params: {
            goodsId: row.id
          }
        }).then((res) => {
          console.log(res)
          this.order.lst.splice(index, 1)
        }).catch((error) => {
          console.log(`删除订单明细 ${error}`)
        })
      },
      // 增加订单明细
      addDetail() {
        this.order.lst.push({
          id: '',
          productName: '',
          model: '',
          unit: '个',
          unitPrice: '',
          amount: '',
          brand: '',
          origin: ''
        })
      },
      // 获取币别列表
      getCurrency() {
        req.get('api/import/baseinfo/currency', {
          params: {
            customId: '060B44BC-E51D-4543-865A-F595F20C392D',
            businessCode: 1
          }
        }).then((res) => {
          this.currency = res.currencyLst
        }).catch((error) => {
          console.log(`获取币别列表 ${error}`)
        })
      },
      // 获取垫资列表
      getLoaning() {
        req.get('api/import/baseinfo/loaning', {
          params: {
            customId: '060B44BC-E51D-4543-865A-F595F20C392D',
            businessCode: 1
          }
        }).then((res) => {
          // 当前协议垫资类型,2是不垫资,3是部分垫资,都当不垫资处理
          this.settleType = res.loaningLst[0].loaningType
          this.order.settleType = this.settleType
        }).catch((error) => {
          console.log(`获取垫资信息 ${error}`)
        })
      },
      // 获取供应商列表
      getSupplier() {
        req.get('api/import/baseinfo/supplier', {
          params: {
            customId: '060B44BC-E51D-4543-865A-F595F20C392D',
            businessCode: 1
          }
        }).then((res) => {
          this.supplier = res.supplierLst
        }).catch((error) => {
          console.log(`获取供应商列表 ${error}`)
        })
      },
      // 产地和单价匹配值
      ievent(msg) {
        this.originValidate = msg.originValidate
        this.unitValidate = msg.unitValidate
      },
      /**
       * 我的订单号判断
       * */
      isMyOrder() {
        req.get('api/import/baseinfo/isexistcustorderno').then((res) => {
          if (res.data > 0) {
            this.isOrder = true
          } else {
            this.isOrder = false
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  /*标题*/
  .title{
    font-size: 15px;
    font-weight: 600;
    color: #272727;
    margin-bottom: 25px;
  }
</style>
<style lang="scss">
  .dialog-content{
    font-family: "Microsoft YaHei";
    .el-dialog__body{
      padding-bottom: 45px;
    }
    .upload-content{
      width: 100%;
      margin: 0 auto;
      text-align: center;
      .el-upload{
        width: 100%;
      }
      .el-upload-dragger{
        width: 100%;
        height: auto;
        .clickBtn{
          width: 160px;
          height: 55px;
          line-height: 55px;
          margin: 44px auto 0;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          color: #333333;
          background: #EDEDED;
          cursor: pointer;
        }
        .bottom-tip-1{
          width: 100%;
          margin-top: 30px;
          text-align: center;
          font-size: 16px;
          color: #333;
        }
        .bottom-tip-2{
          width: 100%;
          margin-top: 12px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .bottom-tip-3{
          width: 100%;
          margin-top: 56px;
          margin-bottom: 27px;
          text-align: center;
          font-size: 12px;
          color: #f89569;
        }
      }
      .el-upload-list{
        width: 50%;
        .el-upload-list__item-name{
          text-align: left;
        }
      }
    }
    /*模板下载*/
    .download-model{
      position: relative;
      margin-top: 20px;
      margin-left: 18px;
      font-size: 14px;
      font-weight: bold;
      color: #82BCF2;
      cursor: pointer;
      &:after{
        display: block;
        content: '';
        position: absolute;
        left: -18px;
        top: 1.5px;
        width: 16px;
        height: 16px;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFXUlEQVRYR8WWXWwUVRTH///ZLR+lM1VEDMSgvGgQeBBDrMZGtjubQoIPRkOIQEQEEzVojBEV7ezMVgRiYkxBiIEAYoCE+KQGwdm2ikiDmGj4MjWKxhDEEqo72/LR7swxM7tbtu3utktCvE+TzPn43f8599xL/M+LleT/6AepupBKz6fgEQCTRWQKSEchT8PDSTfMo2ak5kIlMUcFELcvTwvRfVXEW0py4ggJTkPwpYvwJitW/edIMGUB1h3unZK55loklgOoGhJMAPwikF6AUyGYTEIpsOkH8HEIyttv6TV/lwIpCWDaqToF/AzE7XlnETlEKEdE2CHahONmHZ38P7Ndauj1PkbPWyzAwjyMAOckVFVvRsb/UQyiKEBzMv2kB9lHIOw7CXBGiFVmVDs6kqT+/+ZDV6ZLqD8BYGngL+iSMKNmRD011H8YQMLuvR9wO0CMzSaXPRLSlpsRZkaTvNDGSqaWANyV28glV8JzhvbFIADzYGqiEuIpEFOy5GLFY7VmpYkHQXzVEyW9QyBCAjkrGcw159d2520GAVh2qoXk6pxsO+MxbUWp5Ga73ELX+T2wDWnTzQj/LWWbaHVWQrAt+58thq6+PAzAbL9yt5Lp/zVLihMzutU5ixbRLRW02U7PE0p7EFIYaYqpX5dTyrJTB0k2AuinW3VvU+P4AH5AActObSH5fBBE4TyjQf2mXMBKAcxW52FF8F2utFvjsdoXBgBEhM2t6YsAboPgmBHT6kaqe6UAfjzLdjpI1EHwlxHTpg4ABGee7MjVfk08pr13MwASSWcNgI1ZlaXOaKg9FpTAslOrSbb4316Is4ud16FAN6KA2Z6epbhyMtuLXG1E1c0BQMJ21oN4IwugqmaEPTdDgY1HRL12NR1MTwHWx3VtbU4BZzeJZX6HGro2Zmhyy069A6COIcaNBi1opFIKWMl0BJAmAl8Yuvb+0FiJpNMX3CuC3UZMezqrQNLZCWC5AFfjujZ+GEDSuUhgkohcZggNfu2KATS3phvEkwPBFC1otMJ4lp3qJVkNYIeha8/mAdYBWBuUwOUdZqPaVeiUSKYXA7I3OPKQHirQ6SrjC+dABpIJAclcchfgU0ZM3V8Yp7AEgCQMvTaeLUEy/SIhm7O9wWhTVG0brkJqCcFP8hCKKGuEsiV3rl8CsCHYmcAlubhJVz8dJr/dMxv0TmSbEKuMqLY9r0A9gMNZh8GjcpAStrMCxPbcALsCIFcuXgVkXLnkwUZbndcp2JBt9qrp/hUdAPiDKNHqdBGcJMCFuK4Fl1GxlRgMUWgiBBcV23neKJFMfQ9wrn+9x3VtZlaI3LKSzgEACyDsM/SacST9F8/oIAQilGVxvXZPSZ+29KPwJHdfMG7oqv9euA7gPyK8UL8/pX6M69r6UoEGdmOnPwQlmOeecJMZU/0+KLr275fQz7emfyIxS0S6qz1t2muN7B0EMFLCYv/Ntp53PVeuJWKqVc7fsp0dJJ4JbEReMWK1H+TtR/UqvhG4grpbAI0gN3B4RrfaUHjNlwVItKUeFA91Sj8PNi3QOisBMdslTNfZRXBJduM4L67MLnwNjViCRNLxH5Ez/QkI4jkjqu0t15x5QP/up2AbgftyOz8nYKOpq2eGbqKsApbtdJK4J+/kv+kAZRcFnQgpv1VVVZ9ViExfX3oqRLnLg8yF59XnXj55t2/DwONrde1SMQXLApjtcicy6a0KsbAS+XO2nQJplqi2zyS9Uv6jasJE9gyvBPDE9elXNGS/CPx5slN09fNyiW/oFLQckLHdY9MPUPAQRNSgiUi/P7oI5Xx4zITjb9bzn0rUGpUClQSs1PY/Kjt9P/NsRTwAAAAASUVORK5CYII=");
        background-size: 100%;
      }
    }
  }
</style>
