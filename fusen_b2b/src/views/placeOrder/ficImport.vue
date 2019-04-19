<template>
  <div v-loading="loadState">
    <layout :order="order"
            @submitHandle="submitHandle"
            :fileListProp="order.file"
            @uploadConfim="uploadConfim">
      <template slot="baseInfo">
        <!--文件上传弹框-->
        <uploadCmp :showDialog="showUpload"
                   :uploadClose="true"
                   :importTabTagData="tabTagData"
                   :acceptType="'.xlsx'"
                   :downloadModelUrl="'https://test.fusen.net.cn/file/download/5c8a0d80ea1c9c6cabd3203e'"
                   @importFileHandle="getImportTabData"
                   @closeHandle="showUpload = false"></uploadCmp>
        <el-form :model="order" label-position="right" ref="formMain" :rules="orderRules" label-width="100px">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="富森项目号:" prop="fsOrderNo"
                            class="formItem inputBox">
                <el-select v-model="order.fsOrderNo"
                           style="width: 360px"
                           v-if="editState"
                           filterable
                           @change="gatheringCompanyChange"
                           class="inputBox"
                           placeholder="请输入">
                  <el-option
                    v-for="item in fsOrderNoList"
                    :key="item.fsOrderNo"
                    :label="item.fsOrderNo"
                    :value="item">
                  </el-option>
                </el-select>
                <div v-else>{{order.fsOrderNo}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单币别：" prop="orderCurrency">
                <el-select v-model="order.orderCurrency" filterable placeholder="请输入">
                  <el-option
                    v-for="item in currency"
                    :key="item.orderCurrency"
                    :label="item.orderCurrency"
                    :value="item.orderCurrency">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="海外供应商:" prop="vendorName" class="formItem">
                <el-input v-model="order.vendorName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内部项目号：" prop="customerNo">
                <el-input v-model="order.customerNo" placeholder="请选择" >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template slot="goodsList">
        <div class="title">订单明细</div>
        <div style="text-align: right;margin-bottom: 20px">
          <el-button type="primary" v-if="editState" @click="importHandle">导入</el-button>
          <el-button type="primary" @click="addDetail">新增</el-button>
        </div>
        <el-table :data="order.list" class="table-main" show-summary :summary-method="getSummaries" border>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="partName" label="品名" align="center">
            <template slot-scope="prop">
              <div class="tmpContent">
                <el-input class="inline-input" v-model="prop.row.partName" placeholder="品名"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="型号" align="center">
            <template slot-scope="prop">
              <div class="tmpContent">
                <el-input class="inline-input" v-model="prop.row.spec" placeholder="型号"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center">
            <template slot-scope="prop">
              <el-input v-model.number="prop.row.quantity"  type="number"  placeholder="数量"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" align="center">
            <template slot-scope="prop">
              <el-input v-model="prop.row.unit" placeholder="单位"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" align="center">
            <template slot-scope="prop">
              <el-input v-model="prop.row.price" placeholder="单价"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" align="center">
            <template slot-scope="prop">
              <el-input v-model.number="prop.row.amount" type="number" placeholder="金额"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="brand" label="品牌" align="center">
            <template slot-scope="prop">
              <el-input v-model="prop.row.brand" placeholder="品牌"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="original" label="产地" align="center">
            <template slot-scope="prop">
              <el-input v-model="prop.row.original" placeholder="产地"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" style="color: #85ce61" @click="deleteOrder(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </layout>
  </div>
</template>

<script>
  import req from '@/utils/req'
  import tabTmp from '@/components/tabTemplate'
  import layout from './component/layout'
  import uploadCmp from '@/components/uploadCmp'
  export default {
    data() {
      return {
        showUpload: false, // 文件导入弹窗
        editState: true, // 页面可编辑状态
        dialogVisible: false,
        orderNodeList: ['下单', '受理中', '待确认', '已收货', '已付款', '全部报关', '已发货', '已签收'], // 节点列表
        editStatus: true, // 当前订单可编辑状态
        currentNodeIndex: 0, // 当前订单节点索引
        loadState: false,
        settleType: '1',
        order: {
          itemId: '',
          itemId_fk: '',
          fsImportOrderNo: '',
          customsAmount: '',
          fsOrderNo: '',
          vendorName: '',
          customerNo: '',
          orderCurrency: '',
          settleType: ' ',
          orderStatus: '',
          list: [
            // { itemDetailId: '',
            //   partName: '',
            //   spec: '',
            //   quantity: '',
            //   unit: '',
            //   price: '',
            //   useAge: '2',
            //   brand: '',
            //   original: '',
            //   amount: '' }
          ],
          file: [
          ]
        },
        tabTagData: [ // 附件上传商品明细列表表头
          {
            label: '品名',
            prop: 'partName',
            width: ''
          },
          {
            label: '型号',
            prop: 'spec',
            width: ''
          },
          {
            label: '数量',
            prop: 'quantity',
            width: ''
          },
          {
            label: '单位',
            prop: 'unit',
            width: '200px'
          },
          {
            label: '单价',
            prop: 'price',
            width: ''
          },
          {
            label: '金额',
            prop: 'amount',
            width: ''
          },
          {
            label: '品牌',
            prop: 'brand',
            width: ''
          },
          {
            label: '产地',
            prop: 'original',
            width: ''
          }
        ],
        orderRules: {
          fsOrderNo: [
            { required: true, message: '请选择项目号', trigger: 'change' }
          ],
          orderCurrency: [
            { required: true, message: '请选择订单币别', trigger: 'change' }
          ],
          vendorName: [
            { required: true, message: '请填写海外客户', trigger: 'blur' }
          ],
          custContractNO: [
            { required: true, message: '请填写内部项目号', trigger: 'blur' }
          ]
        },
        fsOrderNoList: [],
        currency: [],
        supplier: [],
        objectData: []
      }
    },
    components: {
      layout,
      uploadCmp,
      tabTmp
    },
    created() {
      // 父组件传来的订单号获取对象
      let itemId = this.$route.query.id
      itemId && this.getOrderObj(itemId)
      // 判断当前订单进度,决定是否可编辑
      let orderNode = this.$route.query.orderNode
      if (orderNode) {
        let index = this.orderNodeList.findIndex((v) => v === orderNode)
        this.currentNodeIndex = 6
        index !== 0 ? this.editStatus = false : ''
      } else {
        this.currentNodeIndex = 0
        this.editStatus = true
      }
      this.getCurrency()
      this.initFsOrder()
    },
    methods: {
      initFsOrder() { // 获取富森单号
        req.get('/api/virtual/order/itemSearch', {
          params: {
            keyword: ''
          }
        }).then((res) => {
          if (res.data && Array.isArray(res.data)) {
            res.data.forEach((val) => {
              this.fsOrderNoList.push({
                fsOrderNo: val.fsOrderNo,
                settleType: val.settleType,
                exportBuyer: val.exportBuyer,
                customerNo: val.internalProjectNumber,
                itemId: val.itemId
              })
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
      ***表格数据自定义求和
       **/
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价'
            return
          }
          if (index === 3 || index === 5 || index === 6) {
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
        let num3 = sums[3]
        let num5 = sums[5]
        sums[6] = num3 * num5
        this.order.customsAmount = sums[6]
        return sums
      },
      /**
       * layout组件文件上传后触发事件
       * */
      uploadConfim(file) {
        this.order.file.push({
          fileName: file.raw.name,
          fileType: file.raw.name.split('.')[1],
          fileId: file.response.fileId
        })
        console.log(this.order)
      },
      /**
       * 导入文件操作
       * */
      importHandle() {
        this.showUpload = true
      },
      /**
       * 获取导入的数据
       * */
      getImportTabData(list) {
        list.map((val) => {
          this.order.list.push(val)
        })
      },
      // 获取币别列表
      getCurrency() {
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
      getInvestInfo(val) { // 选取单据编码,覆盖原有值
        this.order.fsOrderNo = val.fusenOrder
      },
      gatheringCompanyChange(val) {
        this.order.itemId_fk = val.itemId
        this.order.fsOrderNo = val.fsOrderNo
        this.order.settleType = val.settleType
        this.order.exportBuyer = val.exportBuyer
        this.order.customerNo = val.customerNo
      },
      // 获取订单对象
      getOrderObj(itemId) {
        this.loadState = true
        req.get('api/virtual/importOrder/getItemInfo', {
          params: {
            itemId
          }
        }).then((res) => {
          this.order = res.data
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      // 订单提交/保存操作
      submitHandle(val) {
        if (val === '保存') {
          this.order.orderStatus = '0'
        } else {
          this.order.orderStatus = '1'
        }
        let jsonStr = this.order
        this.$axios.post('api/virtual/importOrder/itemSaveOrCommit', jsonStr).then((res) => {
          if (res.result === 'success') {
            this.$notify({
              title: '订单保存成功',
              message: res.msg,
              type: 'success'
            })
            this.$refs.formMain.resetFields()
            this.$router.replace('/fictitious/material/importOrder')
          }
        }).catch((error) => {
          console.log(`保存/提交 ${error}`)
          // 失败时重置状态
          this.order.orderStatus = '0'
        })
      },
      /**
       * 删除订单明细
       * */
      delDetail(order, index) {
        console.log(order.id)
        req.get('api/import/order/orderinfo/removegoods', {
          params: {
            goodsId: order.id
          }
        }).then((res) => {
          console.log(res)
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 增加订单明细
       */
      addDetail() {
        this.order.list.push({
          partName: '',
          spec: '',
          quantity: '',
          unit: '个',
          price: '',
          useAge: '2',
          brand: '',
          original: '',
          amount: ''
        })
      },
      /**
       *   文件上传后
       */
      handleChange(file) {
        console.log(file)
        if (file.response) {
          let theFile = {
            fileName: file.raw.name,
            fileType: file.raw.type,
            fTypeName: '',
            fileId: file.response.fileId
          }
          console.log(theFile)
          this.order.file.push(theFile)
        }
      },
      // 点击文件列表中的文件
      evebtFile(file) {
        let fileId = file.response.fileId
        let baseUrl = window.g.baseUrl
        let link = document.createElement('a')
        let url = `${baseUrl}file/download/${fileId}`
        link.setAttribute('href', url)
        link.click()
        // req.get(`file/download/${fileId}`).then((res) => {
        //   // console.log(res)
        // }).catch((error) => {
        //   console.log(error)
        // })
      },
      deleteOrder(order, index) {
        console.log(order)
        this.order.list.splice(index, 1)
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
