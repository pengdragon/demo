<template>
  <div v-loading="loadState">
    <layout :order="order"
            @submitHandle="submitHandle"
            @uploadConfim="uploadConfim">
      <template slot="baseInfo">
        <el-form :model="order" ref="formMain" :rules="orderRules" size="small" label-position="right" label-width="120px">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="富森项目号:" prop="fsOrderNo"
                            class="formItem">
                <el-select v-model="order.fsOrderNo"
                           style="width: 100%"
                           v-if="editState"
                           filterable
                           @change="gatheringCompanyChange"
                           class="inputBox"
                           placeholder="请选择">
                  <el-option
                    v-for="item in fsOrderNoList"
                    :key="item.fsOrderNo"
                    :label="item.fsOrderNo"
                    :value="item">
                  </el-option>
                </el-select>
                <div v-else>{{order.fsOrderNo}}</div>
              </el-form-item>
              <!--<el-form-item label="富森项目号：">-->
                <!--<el-input v-model="order.fsOrderNo"></el-input>-->
              <!--</el-form-item>-->
            </el-col>
            <el-col :span="12">
              <el-form-item label="运输方式：" prop="recWay">
                <el-select v-model="order.recWay" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="cur in recWayType"
                    :key="cur.value"
                    :label="cur.label"
                    :value="cur.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出口目的国：" prop="exportCountry_fk">
                <el-select v-if="editStatus" v-model="order.exportCountry_fk" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="sup in purposecountryArr"
                    :key="sup.name"
                    :label="sup.name"
                    :value="sup.id">
                  </el-option>
                </el-select>
                <span v-if="!editStatus">{{exportTarget(order.exportCountry_fk)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="海外客户：" prop="exportBuyer">
                <el-input v-model="order.exportBuyer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单币别：" prop="orderCurrency">
                <el-select v-model="order.orderCurrency" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="cur in currency"
                    :key="cur.orderCurrency"
                    :label="cur.orderCurrency"
                    :value="cur.orderCurrency">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算方式：" prop="settlements">
                <el-select v-model="order.settlements" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="cur in settlementsType"
                    :key="cur.value"
                    :label="cur.label"
                    :value="cur.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template slot="goodsList">
        <div class="title">订单明细</div>
        <div style="text-align: right;margin-bottom: 20px">
          <el-button type="primary">批量导入</el-button>
          <el-button type="primary" @click="addTabDetail">新增</el-button>
        </div>
        <el-table :data="order.exItemlist" class="table-main" show-summary :summary-method="getSummaries" border>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="unit" label="品名" align="center">
            <template slot-scope="prop">
              <el-input v-model="prop.row.partName" placeholder="品名"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="spec"
                           label="型号" align="center">
            <template slot-scope="prop">
              <el-input v-model="prop.row.spec" placeholder="型号"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="parts"
                           label="配件" align="center">
            <template slot-scope="prop">
              <el-input v-model="prop.row.parts" placeholder="配件"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center">
            <template slot-scope="prop">
              <el-input v-model.number="prop.row.quantity" type="number" placeholder="数量"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" align="center">
            <template slot-scope="prop">
              <el-input v-model.number="prop.row.price" type="number" placeholder="单价"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" align="center">
            <template slot-scope="prop">
              <el-input v-model="prop.row.unit" placeholder="单位"></el-input>
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
          <el-table-column prop="originalPacNum" label="箱数" align="center">
            <template slot-scope="prop">
              <el-input v-model.number="prop.row.originalPacNum" type="number" placeholder="箱数"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="oriNetWeight" label="净重"  align="center">
            <template slot-scope="prop">
              <el-input v-model.number="prop.row.oriNetWeight" type="number" placeholder="净重"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="oriGrossWeight" label="毛重" align="center">
            <template slot-scope="prop">
              <el-input v-model.number="prop.row.oriGrossWeight" placeholder="毛重" type="number"></el-input>
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
  import XLSX from 'xlsx'
  import layout from './component/layout'
  export default {
    data() {
      return {
        orderNodeList: ['下单', '受理中', '待确认', '已收货', '已付款', '全部报关', '已发货', '已签收'], // 节点列表
        editStatus: true, // 当前订单可编辑状态
        editState: true,
        currentNodeIndex: 0, // 当前订单节点索引
        purposecountryArr: [], // 出口目的国
        loadState: false,
        fsOrderNoList: [],
        orderRules: {
          fsOrderNo: [
            { required: true, message: '请选择项目号', trigger: 'change' }
          ],
          recWay: [
            { required: true, message: '请选择运输方式', trigger: 'change' }
          ],
          exportCountry_fk: [
            { required: true, message: '请选择出口国', trigger: 'change' }
          ],
          exportBuyer: [
            { required: true, message: '请填写海外客户', trigger: 'blur' }
          ],
          orderCurrency: [
            { required: true, message: '请选择订单币别', trigger: 'change' }
          ],
          settlements: [
            { required: true, message: '请选择结算方式', trigger: 'change' }
          ]
        },
        order: { 'itemId': '',
          itemId_fk: '000B2E8B-0000-0000-0000-0000A119FA2C',
          fsExportOrderNo: '',
          fsOrderNo: '',
          exportBuyer: '',
          recWay: '',
          exportCountry_fk: '',
          orderCurrency: '',
          settlements: '',
          customsAmount: '',
          settleType: '',
          orderStatus: '1',
          exItemlist: [{
            itemDetailId: '',
            ordb0010Id: '',
            partName: '',
            spec: '',
            parts: '',
            quantity: '',
            unit: '',
            price: '',
            brand: '',
            original: '',
            originalPacNum: '',
            oriNetWeight: '',
            oriGrossWeight: ''
          }],
          file: []
        },
        recWayType: [{
          value: '陆运',
          label: '陆运'
        }, {
          value: '铁路运输',
          label: '铁路运输'
        }, {
          value: '海运',
          label: '海运'
        }, {
          value: '空运',
          label: '空运'
        }],
        settlementsType: [{
          value: 'LC',
          label: 'LC'
        }, {
          value: 'TT',
          label: 'TT'
        }],
        currency: [],
        supplier: []
      }
    },
    components: {
      layout,
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
        this.currentNodeIndex = index
        index !== 0 ? this.editStatus = false : ''
      } else {
        this.currentNodeIndex = 0
        this.editStatus = true
      }
      this.getCurrency()
      this.getkeyword()
      this.purposecountry()
    },
    methods: {
      /**
       * 获取出口目的国
       * */
      purposecountry() {
        req.get('api/import/baseinfo/purposecountry').then((res) => {
          if (Array.isArray(res.data)) {
            this.purposecountryArr = res.data
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      // 导入订单详细
      addDetails(obj) {
        var files = obj.target.files

        var fileReader = new FileReader()
        let that = this
        fileReader.onload = function(ev) {
          try {
            var data = ev.target.result
            var workbook = XLSX.read(data, {
              type: 'binary'
            })
            var goods = []
          } catch (e) {
            console.log('文件类型不正确')
            return
          }
          for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              goods = goods.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
            }
          }
          that.showData(goods)
          goods.forEach((g) => {
            that.order.lst.push(g)
          })
        }
        fileReader.readAsBinaryString(files[0])
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
          if (index === 4 || index === 5 || index === 9 || index === 10 || index === 11) {
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
        let num4 = sums[4]
        let num5 = sums[5]
        let sum6 = num4 * num5
        this.order.customsAmount = sum6
        return sums
      },
      // 获取富森订单号
      getkeyword() {
        req.get('api/virtual/order/itemSearch', {
          params: {
            keyword: ''
          }
        }).then((res) => {
          if (res.data && Array.isArray(res.data)) {
            res.data.forEach((val) => {
              this.fsOrderNoList.push({
                itemId: val.itemId,
                fsOrderNo: val.fsOrderNo,
                settleType: val.settleType,
                exportBuyer: val.exportBuyer
              })
            })
          }
        }).catch((error) => {
          console.log(error)
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
          console.log(error)
        })
      },
      // 获取订单对象
      getOrderObj(itemId) {
        this.loadState = true
        req.get('api/virtual/exportOrder/getItemInfo', {
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
      // 删除订单明细
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
      // 增加订单明细
      addTabDetail() {
        this.order.exItemlist.push({
          itemDetailId: '',
          ordb0010Id: '',
          partName: '',
          spec: '',
          parts: '',
          quantity: '',
          unit: '',
          price: '',
          brand: '',
          original: '',
          originalPacNum: '',
          oriNetWeight: '',
          oriGrossWeight: ''
        })
      },
      /**
      **带出项目号付款方式
       * */
      gatheringCompanyChange(val) {
        this.order.fsOrderNo = val.fsOrderNo
        this.order.settleType = val.settleType
        this.order.itemId_fk = val.itemId
        // this.order.exportBuyer = val.exportBuyer
      },
      // 订单提交/保存操作
      submitHandle(val) {
        if (val === '保存') {
          this.order.orderStatus = '0'
        } else {
          this.order.orderStatus = '1'
        }
        let jsonStr = this.order
        this.$axios.post('api/virtual/exportOrder/itemSaveOrCommit', jsonStr).then((res) => {
          if (res.result === 'success') {
            this.$notify({
              title: '订单保存成功',
              message: res.msg,
              type: 'success'
            })
            this.$refs.order.resetFields()
            this.$router.replace('/fictitious/exportOrder')
          }
        }).catch((error) => {
          console.log(`保存/提交 ${error}`)
          // 失败时重置状态
          this.order.orderStatus = '0'
        })
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
      // 文件上传后
      handleChange(file) {
        console.log(file)
        if (file.response) {
          let theFile = {
            fileName: file.raw.name,
            fileType: file.raw.type,
            fileId: file.response.fileId
          }
          console.log(theFile)
          this.formMain.file.push(theFile)
        }
      },
      deleteOrder(order, index) {
        console.log(order)
        this.order.exItemlist.splice(index, 1)
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .order{
    display: none;}
</style>
