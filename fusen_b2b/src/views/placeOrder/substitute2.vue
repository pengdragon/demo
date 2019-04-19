<template>
  <div>
    <layout :order="order"
            :editStatus="false" :fileListProp="order.file">
      <template slot="baseInfo">
        <el-form :model="order" label-position="right" label-width="100px">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="内部订单号：">
                <el-input v-model="order.customOrder"></el-input>
                <!-- <span >{{order.customOrder}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期：">
                <el-date-picker
                  style="width: 100%"
                  v-model="order.date"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <!-- <span >{{order.customOrder}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商：">
                <el-select v-model="order.supplier" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="sup in supplier"
                    :key="sup.name"
                    :label="sup.name"
                    :value="sup.name">
                  </el-option>
                </el-select>
                <!-- <span>{{order.supplier}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否垫资：">
                <div>
                  <el-radio v-model="order.settleType" label="1" :disabled="settleType==='2'">垫付</el-radio>
                  <el-radio v-model="order.settleType" label="2">不垫付</el-radio>
                </div>
                <!-- <span>{{order.settleType===1?'垫付':'不垫付'}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单金额：">
                <el-input v-model="f_GcAmount" readonly></el-input>
                <!-- <span >{{order.customOrder}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="币别：">
                <el-select v-model="order.currency" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="cur in currency"
                    :key="cur.orderCurrency"
                    :label="cur.orderCurrency"
                    :value="cur.orderCurrency">
                  </el-option>
                </el-select>
                <!-- <span >{{order.currency}}</span> -->
              </el-form-item>
            </el-col>


          </el-row>
        </el-form>
      </template>

      <template slot="goodsList">
        <div class="title">订单明细</div>
        <div>


          <el-table
            :data="order.lst"
            class="table-main"
            border
            show-summary
          >
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="productName" label="品名" align="center">
              <template slot-scope="prop">
                <div class="tmpContent">
                  <el-input class="inline-input" v-model="prop.row.productName" placeholder="品名"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="model" label="型号" align="center">
              <template slot-scope="prop">
                <div class="tmpContent">
                  <el-input class="inline-input" v-model="prop.row.model" placeholder="型号"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="数量" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.amount" placeholder="数量"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice"
                             label="单价" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.unitPrice" placeholder="单价"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="money"
                             label="金额" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.money" placeholder="金额"></el-input>
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
            <el-table-column prop="origin" label="产地" align="center">
              <template slot-scope="prop">
                <el-input v-model="prop.row.origin" placeholder="产地"></el-input>
              </template>
            </el-table-column>

          </el-table>
        </div>

        <!-- <tabTmp :tabData="order.lst"
                :tabTagData="goodsTagData"
                :tabHeight="'300'">
        </tabTmp> -->
      </template>
    </layout>
  </div>
</template>

<script>
  import req from '@/utils/req'
  // import tabTmp from '@/components/tabTemplate'

  import layout from './component/layout'
  export default {
    data() {
      return {

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
            label: '数量',
            prop: 'unit',
            width: ''
          },
          {
            label: '单价',
            prop: 'unitPrice',
            width: ''
          },
          {
            label: '金额',
            prop: 'amount',
            width: ''
          },
          {
            label: '单位',
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
        settleType: '1',
        order: {
          orderId: '',
          supplier: '',
          currency: '',
          settleType: '',
          customOrder: '',
          fusenOrder: '',
          status: '0',
          lst: [],
          file: []
        },
        currency: [],
        supplier: []
      }
    },
    components: {
      layout

    },
    created() {
      // 父组件传来的订单号获取对象
      // console.log(this.$route.query)
      let orderId = this.$route.query.id
      orderId && this.getOrderObj(orderId)

      // this.getLoaning()
    },
    methods: {
      uploadConfim(i) {
        console.log(i)
      },

      // 获取垫资列表
      getLoaning() {
        req.get('api/import/baseinfo/loaning', {
          params: {
            customId: '060B44BC-E51D-4543-865A-F595F20C392D',
            businessCode: 1
          }
        }).then((res) => {
          this.settleType = res.loaningLst[0].loaningType
          this.settleType !== '1' ? this.order.settleType = '2' : false
        }).catch((error) => {
          console.log(error)
        })
      },
      // 获取订单对象
      getOrderObj(orderId) {
        let data = {
          id: orderId
        }
        this.$axios.post('/api/purchase/order/queryInWarehouseApply', data).then((res) => {
          console.log(res.data)
          this.order = res.data
        }).catch((error) => {
          console.log(error)
        })
      },
      // 删除订单明细
      delDetail(order, index) {
        this.order.lst.splice(index, 1)
      },
      // 增加订单明细
      addDetail() {
        this.order.lst.push({
          brandName: '',
          model: '',
          amount: '',
          unit: '',
          money: '',
          unitPrice: '',
          brand: '',
          origin: ''
        })
      },
      // 文件上传后
      handleChange(file) {
        if (file.response) {
          let theFile = {
            fileName: file.raw.name.split('.')[0],
            fileType: file.raw.name.split('.')[1],

            fileId: file.response.fileId
          }

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
      }
    },
    // 总价计算属性
    computed: {
      f_GcAmount: function() {
        let all = 0
        if (this.order.lst) {
          for (var i = 0; i < this.order.lst.length; i++) {
            all += parseInt(this.order.lst[i].money)
          }
          this.order.money = all
          return all
        } else {
          return all
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
