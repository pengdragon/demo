<template>
  <div class="container-wrapper">
    <div class="orderNum">单据编号：{{sendNo}}</div>
    <flowSteps :titleArr="titleArr" :activeIndex="activeIndex" @saveHandle="saveHandle" class="flow">
      <div slot="step1">
        <el-form :label-width="'110px'"
                 :model="formData"
                 size="small"
                 class="form-content">
          <el-form-item label="出货方式：" class="formItem Shipments">
            <el-radio v-model="formData.shipmentType" label="自提" @change="selfLifting(formData.shipmentType)">自提</el-radio>
            <el-radio v-model="formData.shipmentType" label="送货" @change="selfLifting(formData.shipmentType)">送货</el-radio>
            <el-radio v-model="formData.shipmentType" label="快递" @change="selfLifting(formData.shipmentType)">快递</el-radio>
            <el-radio v-model="formData.shipmentType" label="物流" @change="selfLifting(formData.shipmentType)">物流</el-radio>
          </el-form-item>
          <div class="self form-content" v-if="selfLiftingGoods">
            <el-form-item label="自提公司：" class="formItem">
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="formData.sendCompany"
                :fetch-suggestions="sendCompanyQuerySearch"
                placeholder=""
                class="inputBox"
                @select="sendCompanySelect">
                <i
                  class="el-icon-search el-input__icon"
                  slot="suffix">
                </i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.sendCompany }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="自提人：" class="formItem">
              <div style="width: 360px;">
                <el-input v-model="formData.linkMan"
                          class="inputName"
                          placeholder="姓名"></el-input>
                <el-input v-model="formData.linkPhone"
                          class="inputTel"
                          placeholder="联系电话"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="身份证号" class="formItem">
              <el-input v-model="formData.iDCard"
                        class="inputBox"
                        placeholder=""></el-input>
            </el-form-item>
          </div>
          <div class="logistics form-content" v-if="logistics">
            <el-form-item label="送达公司：" class="formItem">
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="formData.sendCompany"
                :fetch-suggestions="sendCompanyQuerySearch"
                placeholder=""
                class="inputBox"
                @select="sendCompanySelect">
                <i
                  class="el-icon-search el-input__icon"
                  slot="suffix">
                </i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.sendCompany }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="联系人：" class="formItem">
              <div style="width: 360px;">
                <el-input v-model="formData.linkMan"
                          class="inputName"
                          placeholder="姓名"></el-input>
                <el-input v-model="formData.linkPhone"
                          class="inputTel"
                          placeholder="联系电话"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="地址：" class="formItem Shipments">
              <el-select v-model="formData.provinceName" placeholder="省" class="inputName" @change="provinceChange">
                <el-option
                  v-for="item in provinceNameArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="formData.cityName" placeholder="市" class="inputName" @change="cityChange">
                <el-option
                  v-for="item in cityNameArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="formData.countyName" placeholder="区" class="inputName">
                <el-option
                  v-for="item in countyNameArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="formData.address"
                        class="inputBox"
                        placeholder="请输入详细地址"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="step2">
        <div v-if="formData.shipmentType === '自提'">
          <el-form :label-width="'110px'"
                   :model="formData"
                   size="small"
                   class="form-content">
            <el-form-item label="预计送达日期：" class="formItem">
              <div style="width: 360px;">
                <el-date-picker
                  v-model="formData.fcDate"
                  type="date"
                  class="inputTel"
                  placeholder="选择日期">
                </el-date-picker>
                <el-time-select
                  v-model="formData.time"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }"
                  class="inputName"
                  placeholder="选择时间">
                </el-time-select>
              </div>
            </el-form-item>
            <el-form-item label="备注：" class="formItem">
              <el-input v-model="formData.remark"
                        class="inputBox"
                        placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="formItem Shipments">
              <el-checkbox v-model="formData.express" true-label="1" false-label="0">整单发货</el-checkbox>
              <el-checkbox v-model="formData.bill" true-label="1" false-label="0">附发票/支票</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="formData.shipmentType === '送货'">
          <el-form :label-width="'110px'"
                   :model="formData"
                   size="small"
                   class="form-content">
            <el-form-item label="运费方式：" class="formItem">
              <el-select v-model="formData.shipFeeType" placeholder="请选择" class="inputBox">
                <el-option
                  v-for="item in shipFeeType0ptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运费类型：" class="formItem">
              <el-select v-model="formData.carFreight" placeholder="请选择" class="inputBox">
                <el-option
                  v-for="item in carFreightOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预计送达日期：" class="formItem">
              <div style="width: 360px;">
                <el-date-picker
                  v-model="formData.fcDate"
                  type="date"
                  class="inputTel"
                  placeholder="选择日期">
                </el-date-picker>
                <el-time-select
                  v-model="formData.time"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }"
                  class="inputName"
                  placeholder="选择时间">
                </el-time-select>
              </div>
            </el-form-item>
            <el-form-item label="收款金额：" class="formItem">
              <div style="width: 360px;">
                <el-input v-model="formData.rcvAmt"
                          class="inputTel"
                          placeholder="输入金额"></el-input>
                <el-select v-model="formData.currency" placeholder="币别" class="inputName">
                  <el-option
                    v-for="item in currencyOptions"
                    :key="item.orderCurrency"
                    :label="item.orderCurrency"
                    :value="item.orderCurrency">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="备注：" class="formItem">
              <el-input v-model="formData.remark"
                        class="inputBox"
                        placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="formItem Shipments">
              <el-checkbox v-model="formData.express" true-label="1" false-label="0">整单发货</el-checkbox>
              <el-checkbox v-model="formData.bill" true-label="1" false-label="0">附发票/支票</el-checkbox>
              <el-checkbox v-model="formData.insure" true-label="1" false-label="0">保险</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="formData.shipmentType === '快递'">
          <el-form :label-width="'110px'"
                   :model="formData"
                   size="small"
                   class="form-content">
            <el-form-item label="运费方式：" class="formItem">
              <el-select v-model="formData.shipFeeType" placeholder="请选择" class="inputBox">
                <el-option
                  v-for="item in shipFeeType0ptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运费类型：" class="formItem">
              <el-select v-model="formData.carFreight" placeholder="请选择" class="inputBox">
                <el-option
                  v-for="item in carFreightOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="快递月结卡号：" class="formItem">
              <el-input v-model="formData.custId"
                        class="inputBox"
                        placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="物流公司：" class="formItem">
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="formData.logisticsCompany"
                :fetch-suggestions="logisticsCompanyQuerySearch"
                placeholder=""
                class="inputBox"
                @select="logisticsCompanySelect">
                <i
                  class="el-icon-search el-input__icon"
                  slot="suffix">
                </i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.name }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="预计送达日期：" class="formItem">
              <div style="width: 360px;">
                <el-date-picker
                  v-model="formData.fcDate"
                  type="date"
                  class="inputTel"
                  placeholder="选择日期">
                </el-date-picker>
                <el-time-select
                  v-model="formData.time"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }"
                  class="inputName"
                  placeholder="选择时间">
                </el-time-select>
              </div>
            </el-form-item>
            <el-form-item label="收款金额：" class="formItem">
              <div style="width: 360px;">
                <el-input v-model="formData.rcvAmt"
                          class="inputTel"
                          placeholder="输入金额"></el-input>
                <el-select v-model="formData.currency" placeholder="币别" class="inputName">
                  <el-option
                    v-for="item in currencyOptions"
                    :key="item.orderCurrency"
                    :label="item.orderCurrency"
                    :value="item.orderCurrency">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="备注：" class="formItem">
              <el-input v-model="formData.remark"
                        class="inputBox"
                        placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="formItem Shipments">
              <el-checkbox v-model="formData.express" true-label="1" false-label="0">整单发货</el-checkbox>
              <el-checkbox v-model="formData.signOrder" true-label="1" false-label="0">快递签回单</el-checkbox>
              <el-checkbox v-model="formData.bill" true-label="1" false-label="0">附发票/支票</el-checkbox>
              <el-checkbox v-model="formData.insure" true-label="1" false-label="0">保险</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="formData.shipmentType === '物流'">
          <el-form :label-width="'110px'"
                   :model="formData"
                   size="small"
                   class="form-content">
            <el-form-item label="运费方式：" class="formItem">
              <el-select v-model="formData.shipFeeType" placeholder="请选择" class="inputBox">
                <el-option
                  v-for="item in shipFeeType0ptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流公司：" class="formItem">
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="formData.logisticsCompany"
                :fetch-suggestions="logisticsCompanyQuerySearch"
                placeholder=""
                class="inputBox"
                @select="logisticsCompanySelect">
                <i
                  class="el-icon-search el-input__icon"
                  slot="suffix">
                </i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.name }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="备注：" class="formItem">
              <el-input v-model="formData.remark"
                        class="inputBox"
                        placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="formItem Shipments">
              <el-checkbox v-model="formData.insure" true-label="1" false-label="0">保险</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="step3">
        <el-col class="tableView-wrapper">
          <div class="title-wrapper">
            <span class="handleButton">
            <el-button type="primary" size="small" @click="chooseOrder">选择订单</el-button>
          </span>
          </div>
          <tabTmp :tabData="chooseOrderSelectArr"
                  :tabHeight="'200px'"
                  class="takeGoodsDetail"
                  :showHandle="true"
                  @deleteItem="deleteItem"
                  :tabTagData="tabTagData">
          </tabTmp>
          <el-upload
            class="upload-content"
            action="#"
            accept=".xls,.xlsx,.txt,.doc,.docx,.pdf"
            :httpRequest="upLoad"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持上传文件:表格(*.xls;*.xlsx) 文档(*.txt,*.doc,*.docx,*.pdf)</div>
          </el-upload>
        </el-col>
      </div>
    </flowSteps>
    <el-dialog title="选择订单" :visible.sync="showOrderDetail" class="choose">
      <el-form :model="formData" inline size="medium" class="formFlexBox">
        <el-form-item>
          <div class="tmpContent" v-if="showTodoInput">
            <el-input
              class="inline-input"
              v-model="searchformData.registrar"
              ref="enterInputA"
              name="enterInputA"
              placeholder="请输入项目号">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item class="search-button">
          <el-button type="primary" @click="searchHandle">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table align="center"
                :data="orderDtailData"
                @selection-change="chooseOrderSelect"
                :border="true" style="width:100%;height: 400px;overflow-y: auto;">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="fusenOrder" label="富森号" align="center" width="120"></el-table-column>
        <el-table-column property="partName" label="品名" align="center" width="120"></el-table-column>
        <el-table-column property="model" label="型号" align="center" width="110"></el-table-column>
        <el-table-column property="quantity" label="订单数量" align="center"></el-table-column>
        <el-table-column property="ksendQty" label="可派货数量" align="center" width="100"></el-table-column>
        <el-table-column property="declDate" label="订单日期" align="center"></el-table-column>
        <el-table-column prop="price" label="单价" align="center"></el-table-column>
        <el-table-column property="unit" label="单位" align="center"></el-table-column>
        <el-table-column property="carton" label="箱数" align="center"></el-table-column>
        <el-table-column property="grossWeight" label="毛重" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import flowSteps from '@/components/flowSteps'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  import cityData from '@/assets/js/cityData'
  // import data from '@/utils/cityData'
  export default {
    data() {
      return {
        cityData: cityData,
        selfLiftingGoods: true,
        logistics: false,
        sendNo: '',
        tabTagData: [
          {
            label: '富森订单号',
            prop: 'fusenOrder',
            width: ''
          },
          {
            label: '品号',
            prop: 'partName',
            width: ''
          },
          {
            label: '型号',
            prop: 'model',
            width: ''
          },
          {
            label: '订单数量',
            prop: 'quantity',
            width: ''
          },
          {
            label: '可派货数量',
            prop: 'ksendQty',
            width: ''
          },
          {
            label: '毛重',
            prop: 'grossWeight',
            width: ''
          }
        ],
        titleArr: [
          '选择出货方式',
          '提交基本信息',
          '提交发货明细'
        ],
        orderDtailData: [
          {
            orderId: '',
            goodsId: '',
            sendOrderId: '',
            fusenOrder: '',
            partName: '',
            model: '',
            quantity: '',
            sendQty: '',
            price: '',
            declDate: '',
            grossWeight: '',
            unit: '',
            carton: ''
          }
        ],
        activeIndex: 1,
        formData: {
          id: '',
          sendNo: this.sendNo,
          fusenOrder: '',
          shipmentType: '自提',
          sendCompany: '',
          linkMan: '',
          linkPhone: '',
          iDCard: '',
          provinceName: '',
          cityName: '',
          countyName: '',
          address: '',
          signOrder: '',
          bill: '',
          insure: '',
          custId: '',
          fcDate: '',
          basb001FkWl: '',
          shipFeeType: '',
          carFreight: '',
          rcvAmt: '',
          currency: '',
          remark: '',
          customId: '',
          shipmentTypeFk: '',
          goods: '',
          file: []
        },
        provinceNameArr: cityData.data,
        cityNameArr: [],
        countyNameArr: [],
        shipFeeType0ptions: [
          {
            value: '1',
            label: '垫付'
          }, {
            value: '2',
            label: '到付'
          }, {
            value: '3',
            label: '第三方付'
          }
        ],
        carFreightOptions: [
          {
            value: '1',
            label: '免收'
          },
          {
            value: '2',
            label: '平均收费'
          }, {
            value: '3',
            label: '固定收费'
          }
        ],
        searchformData: {
          registrar: ''
        },
        chooseOrderSelectArr: [],
        currencyOptions: [], // 币别下拉数据
        logisticsCompanyArr: [], // 物流公司提示
        sendCompanyArr: [], // 自送公司/送达公司
        fileList: [],
        chooseTitle: '',
        showOrderDetail: false,
        showTodoInput: true
      }
    },
    created() {
      // console.log(data)
      this.getCurrency()
      this.sendCompany()
      req.get('api/import/order/orderinfo/getid').then((res) => {
        this.orderDtailData.sendOrderId = res.orderId
      }).catch((error) => {
        console.log(error)
      })
      req.get('api/import/logistics/baseinfo/oddumber').then((res) => {
        this.sendNo = res.value
      }).catch((error) => {
        console.log(error)
      })
    },
    mounted() {
      // 物流公司列表
      this.logisticsCompanyArr = this.logisticsCompany()
      // 派送公司列表
      this.sendCompanyArr = this.sendCompany()
    },
    methods: {
      saveHandle(type) {
        // console.log(type)
        if (type === '保存') {
          console.log(this.sendNo)
          this.formData.status = 0
          this.orderMessage()
        } else if (type === '提交') {
          this.formData.status = 1
          this.orderMessage()
        }
      },
      orderMessage() {
        this.formData.goods = this.chooseOrderSelectArr
        this.formData.sendNo = this.sendNo
        let jsonStr = JSON.stringify(this.formData)
        req.post('api/import/logistics/sendorder/save', { jsonStr }).then((res) => {
          // console.log(res)
        }).catch((error) => {
          console.log(error)
        })
      },
      logisticsCompanyQuerySearch(queryString, cb) {
        var restaurants = this.logisticsCompanyArr
        var results = queryString ? restaurants.filter(this.logisticsCompanycreateFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      logisticsCompanycreateFilter(queryString) {
        return (logisticsCompanyArr) => {
          return (logisticsCompanyArr.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      // 物流公司列表
      logisticsCompany() {
        req.get('api/import/logistics/baseinfo/logisticscompany', {
          params: {
            customId: '000293BC-0000-0000-0000-0000F07BD17E'
          }
        }).then((res) => {
          this.logisticsCompanyArr = res.data
        }).catch((error) => {
          console.log(error)
        })
      },
      logisticsCompanySelect(item) {
        this.formData.basb001FkWl = item.id
        this.formData.logisticsCompany = item.name
      },

      sendCompanyQuerySearch(queryString, cb) {
        var restaurants = this.sendCompanyArr
        var results = queryString ? restaurants.filter(this.sendCompanyCreateFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      sendCompanyCreateFilter(queryString) {
        return (logisticsCompanyArr) => {
          return (logisticsCompanyArr.sendCompany.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      // 送达公司列表
      sendCompany(val = '自提') {
        req.get('api/import/logistics/baseinfo/sendorderlinkman', {
          params: {
            customId: '000293BC-0000-0000-0000-0000F07BD17E',
            shipmentType: val,
            company: ''
          }
        }).then((res) => {
          this.sendGoodsFilterArr = res.data
          // console.log(res.data)
          let arr = []
          res.data.forEach((v, i) => {
            arr.push({
              'sendCompany': v.sendCompany,
              'index': i
            })
          })
          this.sendCompanyArr = arr
        }).catch((error) => {
          console.log(error)
        })
      },
      sendCompanySelect(item) {
        // console.log(item)
        this.formData.sendCompany = item.sendCompany
        this.formData = this.sendGoodsFilterArr[item.index]
      },
      // 获取币别列表
      getCurrency() {
        req.get('api/import/baseinfo/currency', {
          params: {
            customId: '060B44BC-E51D-4543-865A-F595F20C392D',
            businessCode: 1
          }
        }).then((res) => {
          this.currencyOptions = res.currencyLst
        }).catch((error) => {
          console.log(error)
        })
      },
      selfLifting(val) {
        this.sendCompany(val)
        if (val === '自提') {
          this.selfLiftingGoods = true
          this.logistics = false
        } else {
          this.selfLiftingGoods = false
          this.logistics = true
        }
      },
      provinceChange(e) {
        for (let i = 0; i < this.provinceNameArr.length; i++) {
          if (e === this.provinceNameArr[i].value) {
            this.formData.cityName = ''
            this.formData.countyName = ''
            this.cityNameArr = this.provinceNameArr[i].children
          }
        }
      },
      cityChange(e) {
        for (let i = 0; i < this.cityNameArr.length; i++) {
          if (e === this.cityNameArr[i].value) {
            this.countyNameArr = this.cityNameArr[i].children
          }
        }
      },
      chooseOrderSelect(arr) {
        this.chooseOrderSelectArr = arr
      },
      searchHandle() {
        this.chooseOrder()
      },
      deleteItem(index) {
        this.chooseOrderSelectArr.splice(index, 1)
      },
      chooseOrder() {
        let jsonStr = {
          'pageSize': 0,
          'pageCount': 20,
          'customId': '000293BC-0000-0000-0000-0000F07BD17E',
          'gatherSelcondition': this.searchformData.registrar
        }
        jsonStr = JSON.stringify(jsonStr)
        req.post('api/import/logistics/sendordergoods/list', { jsonStr }).then((res) => {
          this.orderDtailData = res.data.list
          // console.log(this.orderDtailData)
          this.showOrderDetail = true
          console.log(res)
        }).catch((error) => {
          console.log(error)
        })
      },
      handleRemove(file) { // 删除对应显示文件
        this.fileList = this.fileList.filter((item) => {
          return item.name !== file.name
        })
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file) {
        return this.$confirm(`确实要删除${file.name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      upLoad(item) { // 上传方法
        // 处理item,获取文件名
        let formData = new FormData()
        formData.append('file', item.file)
        formData.append('name', '测试文本')
        let orderId = this.formData.orderId
        formData.append('orderId', orderId)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$http.post('http://203.86.26.27:9982/file/upload', formData, config).then((result) => {
          if (result.status !== 200) {
            this.$message({
              message: '网络故障请重试!',
              type: 'warning'
            })
            return
          }
          // 上传完需要的字段,文件id,文件上传后下载地址,文件名,文件后缀,
          let res = result.data
          let fileName = item.file.name
          let fileType = fileName.split('.')
          fileType = fileType[fileType.length - 1]
          let fileId = res.fileId
          let fileDownloadUrl = 'http://10.1.1.42:9982/file/download/' + fileId
          // 上传完文件,则重新修改查询文件列表,重新渲染页面
          this.fileList.push(
            {
              name: fileName,
              url: fileDownloadUrl
            }
          )
          // 修改提交要提交表单数据中的file数组
          let uuid = this.$getid()
          // fileName 不能重复------------------
          this.formData.file.push({
            'id': uuid,
            'fileName': fileName,
            'fileType': fileType,
            'fTypeName': fileType.length,
            'fileId': fileId
          })
          // todo 删除操作还未完成可暂时不处理
          // 修改显示文件lisit,并修改对应网址,进行删除操作
          // 删除请求,删除对应form中的file数组内容
          // todo 保存业务信息后,初次进入页面进行根据订单号查询文件列表
          // 查询文件列表
        })
      }
    },
    components: {
      flowSteps,
      tabTmp
    }
  }
</script>

<style scoped lang="scss">
  .container-wrapper{
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 15px 0 90px 20px;
    min-height: 794px;
    .orderNum{
      margin-top: 15px;
      text-align: right;
      margin-right: 20px;
    }
    .formFlexBox{
      text-align: right;
      .inline-input{
        width: 360px;
      }
    }
    .stepContent {
      .takeGoodsDetail{
        margin: 20px 0;
      }
      .title-wrapper{
        text-align: right;
      }
      .form-content {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 20px;
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
          .inputTel{
            width: 235px;
          }
        }
        .Shipments{
           flex: 0 0 100%;
          .el-checkbox{
            margin-right: 30px;
          }
        }
      }
    }
    .upload-content{
      margin-bottom:10px;
      .el-upload__tip{
        display: inline-block;
        margin-left: 10px;
      }
    }
  }
</style>
<style lang="scss">
  .choose .el-dialog__header{
    border-bottom: 1px solid #e0e0e0;
  }
</style>
