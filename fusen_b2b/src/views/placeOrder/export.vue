<template>
  <div v-loading="loadState" style="height: 100%;">
    <uploadCmp :showDialog="showUpload"
               :uploadClose="true"
               :importTabTagData="goodsTagData"
               :acceptType="'.xlsx'"
               :downloadModelUrl="'https://test.fusen.net.cn/file/download/5c81efc0ea1c9c6cabd31f7a'"
               @importFileHandle="getImportTabData"
               @closeHandle="showUpload = false"></uploadCmp>
    <layout :order="order"
            :produceTime="order.produceTime"
            :producer="order.producer"
            :editStatus="editStatus"
            :fileListProp="order.file"
            @uploadConfim="uploadConfim"
            @submitHandle="submitHandle">
      <!--基本信息插槽-->
      <template slot="baseInfo">
        <el-form :model="order"
                 label-position="right"
                 :rules="formRule"
                 ref="formMain"
                 label-width="120px">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="海外客户：" prop="exportBuyer">
                <el-select v-if="editStatus"
                           v-model="order.exportBuyer" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="sup in overseascustomArr"
                    :key="sup.customId"
                    :label="sup.name"
                    :value="sup.name">
                  </el-option>
                </el-select>
                <span v-if="!editStatus">{{order.exportBuyer}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="国内供应商：">
                <el-select v-if="editStatus" v-model="order.supplier" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="sup in inlandsupplierArr"
                    :key="sup.customId"
                    :label="sup.name"
                    :value="sup.name">
                  </el-option>
                </el-select>
                <span v-if="!editStatus">{{order.supplier}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出口目的国：" prop="basa019Id">
                <el-select v-if="editStatus" v-model="order.basa019Id" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="sup in purposecountryArr"
                    :key="sup.name"
                    :label="sup.name"
                    :value="sup.id">
                  </el-option>
                </el-select>
                <span v-if="!editStatus">{{exportTarget(order.basa019Id)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运输方式：">
                <el-select v-if="editStatus"
                           v-model="order.recWay"
                           placeholder="请选择"
                           style="width: 100%">
                  <el-option label="上门送货" value="1"></el-option>
                  <el-option label="陆运" value="2"></el-option>
                  <el-option label="空运" value="3"></el-option>
                  <el-option label="海运" value="4"></el-option>
                  <el-option label="快递" value="5"></el-option>
                  <el-option label="上门提货" value="6"></el-option>
                </el-select>
                <span v-else>{{recWayLabel}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单币别：" prop="basa020Id">
                <el-select v-if="editStatus" v-model="order.basa020Id" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="cur in currencyList"
                    :key="cur.orderCurrency"
                    :label="cur.orderCurrency"
                    :value="cur.id">
                  </el-option>
                </el-select>
                <span v-else>{{order.orderCurrency}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="我的订单号：">
                <el-input placeholder="请输入我的采购订单" v-if="editStatus" v-model="order.customOrder"></el-input>
                <span v-else>{{order.customOrder}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注：">
                <el-input v-if="editStatus" v-model="order.remark"></el-input>
                <span v-else>{{order.remark}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算方式：">
                <el-select v-if="editStatus" v-model="order.settlements" filterable placeholder="请选择" style="width: 100%">
                  <el-option label="TT" value="TT"></el-option>
                  <el-option label="TC" value="TC"></el-option>
                </el-select>
                <span v-else>{{order.settlements}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!--列表信息插槽-->
      <template slot="goodsList">
        <div>
          <div class="title">
            商品明细列表
          </div>
          <div style="text-align: right;margin-bottom: 20px" v-if="editStatus">
            <el-button style="position: relative" type="primary" @click="showUpload = true">
              导入
            </el-button>
            <el-button @click="addGoodsDetail">新增</el-button>
          </div>

          <el-table
            :data="order.goodsinfo"
            class="table-main"
            border
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="productName" label="品名" align="center">
              <template slot-scope="prop">
                <div class="tmpContent">
                  <el-input v-if="editStatus" class="inline-input" v-model="prop.row.productName" placeholder="品名"></el-input>
                  <div v-else>{{prop.row.productName}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="model" label="型号" align="center">
              <template slot-scope="prop">
                <div class="tmpContent">
                  <el-input v-if="editStatus" class="inline-input" v-model="prop.row.model" placeholder="型号"></el-input>
                  <div v-else>{{prop.row.model}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="parts" label="配件" align="center">
              <template slot-scope="prop">
                <el-input v-if="editStatus" v-model="prop.row.parts" placeholder="配件"></el-input>
                <div v-else>{{prop.row.parts}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="quality" label="数量" align="center">
              <template slot-scope="prop">
                <el-input v-model.number="prop.row.quality"
                          v-if="editStatus"
                          type="number"
                          placeholder="数量"></el-input>
                <div v-else>{{prop.row.quality}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="报关单位" align="center">
              <template slot-scope="prop">
                <el-input v-if="editStatus" v-model="prop.row.unit" placeholder="报关单位"></el-input>
                <div v-else>{{prop.row.unit}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice"
                             label="报关单价" align="center">
              <template slot-scope="prop">
                <el-input v-model.number="prop.row.unitPrice"
                          v-if="editStatus"
                          type="number"
                          placeholder="报关单价"></el-input>
                <div v-else>{{prop.row.unitPrice}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="报关金额" align="center">
              <template slot-scope="prop">{{prop.row.amount = prop.row.unitPrice * prop.row.quality}}
              </template>
            </el-table-column>
            <el-table-column prop="brand" label="品牌" align="center">
              <template slot-scope="prop">
                <el-input v-if="editStatus" v-model="prop.row.brand" placeholder="品牌"></el-input>
                <div v-else>{{prop.row.brand}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="origin" label="产地" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.origin"
                          v-if="editStatus"
                          placeholder="产地"></el-input>
                <div v-else>{{prop.row.origin}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="pacNum" label="箱数" align="center">
              <template slot-scope="prop">
                <el-input v-model.number="prop.row.pacNum"
                          v-if="editStatus"
                          type="number"
                          placeholder="箱数"></el-input>
                <div v-else>{{prop.row.pacNum}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="oriNetWeight" label="净重" align="center">
              <template slot-scope="prop">
                <el-input v-model.number="prop.row.oriNetWeight"
                          v-if="editStatus"
                          type="number"
                          placeholder="净重"></el-input>
                <div v-else>{{prop.row.oriNetWeight}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="oriGrossWeight" label="毛重" align="center">
              <template slot-scope="prop">
                <el-input v-model.number="prop.row.oriGrossWeight"
                          v-if="editStatus"
                          type="number"
                          placeholder="毛重"></el-input>
                <div v-else>{{prop.row.oriGrossWeight}}</div>
              </template>
            </el-table-column>
            <el-table-column v-if="editStatus" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" style="color: #85ce61" @click="delDetail(order.goodsinfo, scope.row, scope.$index, '订单明细')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </layout>
  </div>
</template>

<script>
  import req from '@/utils/req'
  import layout from './component/layout'
  import _ from 'lodash'
  import uploadCmp from '@/components/uploadCmp'
  export default {
    data() {
      return {
        loadState: false, // 读取状态
        formRule: {
          exportBuyer: [
            { required: true, message: '请选择海外客户', trigger: 'blur' }
          ],
          basa019Id: [
            { required: true, message: '请选择出口目的国', trigger: 'blur' }
          ],
          basa020Id: [
            { required: true, message: '请选择订单币别', trigger: 'change' }
          ]
        },
        goodsTagData: [ // 商品明细列表表头
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
            label: '配件',
            prop: 'parts',
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
            prop: 'quantity',
            width: ''
          },
          {
            label: '报关金额',
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
            prop: 'origin',
            width: ''
          },
          {
            label: '箱数',
            prop: 'pacNum',
            width: ''
          },
          {
            label: '净重',
            prop: 'oriNetWeight',
            width: ''
          },
          {
            label: '毛重',
            prop: 'oriGrossWeight',
            width: ''
          }
        ],
        recWayLabel: '', // 当前订单运输方式
        order: {
          orderNode: '下单', // 订单节点
          status: '0', // 保存/提交状态
          orderId: '', // 订单ID
          fusenOrder: '', // 富森单号
          customOrder: '', // 客户单号
          exportBuyer: '', // 海外客户
          supplier: '', // 国内供应商
          basa019Id: '', // 出口目的国外键
          recWay: '', // 运输方式
          orderCurrency: '', // 另外存储订单币别
          basa020Id: '', // 订单币别外键
          settlements: '', // 结算方式
          remark: '', // 备注
          settletype: '1', // 付款类型,暂时默认1
          producer: '', // 制单人
          produceTime: '', // 制单时间
          goodsinfo: [ // 商品明细列表
            {
              'productName': '',
              'model': '',
              'parts': '',
              'unit': '',
              'unitPrice': 0,
              'quality': 0,
              'amount': '',
              'brand': '',
              'origin': '',
              'pacNum': 0,
              'oriNetWeight': 0,
              'oriGrossWeight': 0
            }
          ],
          spare: [ // 备品明细列表
            // {
            //   'productName': '',
            //   'qty': '',
            //   'unit': '',
            //   'grossweight': '',
            //   'netweight': '',
            //   'boxnum': ''
            // }
          ],
          file: [] // 文件列表
        },
        currencyList: [], // 币别列表
        purposecountryArr: [], // 出口目的国列表
        inlandsupplierArr: [], // 国内供应商列表
        overseascustomArr: [], // 海外客户列表
        editStatus: true, // 当前订单可编辑状态
        currentNodeIndex: 0, // 当前订单节点索引
        exportButtonState: false, // 输出文件状态
        showUpload: false // 显示上传组件控制
      }
    },
    components: {
      layout,
      uploadCmp
    },
    created() {
      // 新增订单初始化数据拉取
      this.newOrderInit()
      // 判断是否为查看订单
      let orderId = this.$route.query.id
      if (orderId) {
        this.getOrderObj(orderId)
      }
    },
    methods: {
      /**
       * 获取导入的数据
       * */
      getImportTabData(list) {
        list.map((val) => {
          this.order.goodsinfo.push(val)
        })
      },
      /**
       * 匹配出口目的国
       * */
      exportTarget(id) {
        let result = ''
        this.purposecountryArr.map((val) => {
          if (val.id === id) {
            result = val.name
          }
        })
        return result
      },
      /**
       * layout组件文件上传后触发事件
       * */
      uploadConfim(file) {
        // file文件数组错误处理
        if (!Array.isArray(this.order.file)) {
          this.order.file = []
        }
        this.order.file.push({
          fileName: file.raw.name,
          fileType: file.raw.name.split('.')[1],
          fileId: file.response.fileId
        })
      },
      /**
       * 订单提交保存操作
       * */
      submitHandle(status) {
        // 提交保存
        let jsonData = _.cloneDeep(this.order)
        if (status === '保存') {
          jsonData.status = '0'
        } else if (status === '提交') {
          // 校验表单数据
          let checkoutResult = false
          this.$refs.formMain.validate((result) => {
            checkoutResult = !result
          })
          if (checkoutResult) { return }
          jsonData.status = '1'
        }
        // 匹配币别文本值处理
        this.currencyList.map((v) => {
          if (v.id === jsonData.basa020Id) {
            jsonData.orderCurrency = v.orderCurrency
          }
        })
        this.$axios.post('/api/export/order/orderinfo/save', jsonData).then((res) => {
          // 成功提示
          this.$notify({
            title: '成功',
            message: '订单操作成功!',
            type: 'success'
          })
          // 清除当前表单数据,及提示
          Object.assign(this.$data.order, this.$options.data().order)
          // 清除提示
          this.$refs.formMain.resetFields()
          // 关闭当前页签
          this.$store.dispatch('delVisitedViews', { fullPath: this.$route.fullPath })
          // 当为保存/提交时则重定向
          this.$router.replace('/export/orderSearch')
        }).catch((err) => {
          this.order.status = '0'
          console.log(err)
        })
      },
      /**
       * 新增订单初始化数据
       * */
      newOrderInit() {
        this.getCurrency()
        this.purposecountry()
        this.inlandsupplier()
        this.overseascustom()
      },
      /**
       * 序列化excel列表内容,并进行错误判断
       * */
      parseExcelData(excelData, parserTag) {
        let parserList = []
        excelData.map((v) => {
          const resultItem = {}
          Object.keys(v).map((excelKey) => {
            parserTag.map((parserItem) => {
              if (excelKey === parserItem.label) {
                resultItem[parserItem.prop] = v[excelKey]
              }
            })
          })
          parserList.push(resultItem)
        })
        return parserList
      },
      /**
       * 获取商品明细表格数据自定义求和
       * */
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总量'
            return
          }
          if (index === 4 || index === 7 || index === 10 || index === 11 || index === 12) {
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
        return sums
      },
      /**
       * 获取备品表格总和方法
       * */
      getSum(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价'
            return
          }
          if (index === 2 || index === 4 || index === 5 || index === 6) {
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
        return sums
      },
      /**
       * 获取国内供应商
       * */
      inlandsupplier() {
        req.get('api/import/baseinfo/inlandsupplier').then((res) => {
          if (Array.isArray(res.data)) {
            this.inlandsupplierArr = res.data
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 获取海外客户
       * */
      overseascustom() {
        req.get('api/import/baseinfo/overseascustom').then((res) => {
          this.overseascustomArr = res.data
        }).catch((error) => {
          console.log(error)
        })
      },
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
      /**
       * 获取币别列表
       * */
      getCurrency() {
        req.get('api/import/baseinfo/exportcurrency').then((res) => {
          if (Array.isArray(res.data)) {
            this.currencyList = res.data
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 获取订单详情数据
       * */
      getOrderObj(orderId) {
        this.loadState = true
        this.$axios.get('/api/export/order/orderinfo/object', {
          params: {
            id: orderId
          }
        }).then((res) => {
          const data = res.data
          // 获取当前订单数据
          this.order = data
          // 判断当前订单状态是否可编辑
          if (data.status === '1') {
            this.editStatus = false
            // 此处匹配位置不能变换
            const transportModeArray = ['上门送货', '陆运', '空运', '海运', '快递', '上门提货']
            transportModeArray.forEach((value, index) => {
              if (index === parseInt(res.data.recWay) - 1) {
                this.recWayLabel = transportModeArray[index]
              }
            })
          }
          // 序列化fileList显示文件
          // 结束动画
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      /**
       * 删除订单明细
       * */
      delDetail(dataList, row, index) {
        // 判断当前明细条目是否有保存,有则发送数据,无则本地移除
        if (row.id) {
          req.get('api/import/order/orderinfo/removegoods', {
            params: {
              goodsId: row.id
            }
          }).then(() => {
            dataList.splice(index, 1)
          }).catch((error) => {
            // 提示删除失败请重试
            this.$message({
              message: '删除失败请重试',
              type: 'warning'
            })
            console.log(error)
          })
          // 删除接口需修改
        } else {
          dataList.splice(index, 1)
        }
      },
      /**
       * 增加商品明细列表
       * */
      addGoodsDetail() {
        this.order.goodsinfo.push({
          id: '',
          productName: '',
          model: '',
          parts: '',
          unit: '',
          unitPrice: 0,
          quality: 0,
          amount: '',
          brand: '',
          origin: '',
          pacNum: 0,
          oriNetWeight: 0,
          oriGrossWeight: 0
        })
      },
      /**
       * 增加备品明细列表
       * */
      addSpares() {
        this.order.spare.push({
          id: '',
          productName: '',
          qty: '',
          unit: '',
          grossweight: '',
          netweight: '',
          boxnum: ''
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
