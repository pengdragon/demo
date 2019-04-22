<template>
  <div class="content">
    <baseLayout v-loading="loadState">
      <div slot="msg1">
        <div class="title">
          <div style="float: right;" v-show="formData.sendNo">单据编号：{{formData.sendNo}}</div>
          基本信息
        </div>
        <div class="mButton" v-if="editStatus">
          <mButton :active="formData.shipmentType === '自提'"
                   class="item"
                   @click="selfLifting('自提')">自提</mButton>
          <mButton :active="formData.shipmentType === '送货'"
                   class="item"
                   @click="selfLifting('送货')">送货</mButton>
          <mButton :active="formData.shipmentType === '快递'"
                   class="item"
                   @click="selfLifting('快递')">快递</mButton>
          <mButton :active="formData.shipmentType === '物流'"
                   class="item"
                   @click="selfLifting('物流')">物流</mButton>
        </div>
        <el-form :model="formData"
                 label-position="right"
                 label-width="110px">
          <el-row v-if="formData.shipmentType === '自提'">
            <el-col :span="12">
              <!--todo-->
              <el-form-item label="自提公司：" prop="sendCompany">
                <el-autocomplete
                  v-if="editStatus"
                  popper-class="my-autocomplete"
                  v-model="formData.sendCompany"
                  :fetch-suggestions="sendCompanyQuerySearch"
                  placeholder=""
                  class="inputBox"
                  @select="sendCompanySelect">
                  <i class="el-icon-search el-input__icon" slot="suffix"></i>
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.sendCompany }}</div>
                  </template>
                </el-autocomplete>
                <div v-else>{{formData.sendCompany}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="linkMan">
                <el-input v-model="formData.linkMan"
                          v-if="editStatus"
                          placeholder="请输入姓名"></el-input>
                <div v-else>{{formData.linkMan}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="linkPhone">
                <el-input v-model="formData.linkPhone"
                          v-if="editStatus"
                          placeholder="请输入联系电话"></el-input>
                <div v-else>{{formData.linkPhone}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号" prop="iDCard">
                <el-input v-model="formData.iDCard"
                          v-if="editStatus"
                          placeholder="请输入身份证号"></el-input>
                <div v-else>{{formData.iDCard}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注：" prop="remark">
                <el-input v-model="formData.remark"
                          v-if="editStatus"
                          type="textarea"
                          placeholder="请输入备注"></el-input>
                <div v-else>{{formData.remark}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :span="12">
              <el-form-item label="送达公司：" prop="sendCompany">
                <!--todo-->
                <el-autocomplete
                  v-if="editStatus"
                  v-model="formData.sendCompany"
                  :fetch-suggestions="sendCompanyQuerySearch"
                  placeholder=""
                  @select="sendCompanySelect">
                  <i class="el-icon-search el-input__icon" slot="suffix"></i>
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.sendCompany }}</div>
                  </template>
                </el-autocomplete>
                <div v-else>{{formData.sendCompany}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="linkMan">
                <el-input v-model="formData.linkMan"
                          v-if="editStatus"
                          placeholder="姓名"></el-input>
                <div v-else>{{formData.linkMan}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="linkPhone">
                <el-input v-model="formData.linkPhone"
                          v-if="editStatus"
                          placeholder="联系电话"></el-input>
                <div v-else>{{formData.linkPhone}}</div>
              </el-form-item>
            </el-col>
            <template v-if="formData.shipmentType === '快递'">
              <el-col :span="12">
                <el-form-item label="运费方式：">
                  <el-select v-model="formData.shipFeeType" v-if="editStatus" placeholder="请选择">
                    <el-option
                      v-for="item in shipFeeType0ptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div v-else>{{formData.shipFeeType}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="快递月结卡号："
                              v-if="thirdParty">
                  <el-input v-model="formData.custId"
                            v-if="editStatus"
                            class="inputBox"
                            placeholder=""></el-input>
                  <div v-else>{{formData.custId}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="物流公司：">
                  <el-cascader
                    v-if="editStatus"
                    :options="logisticsArr"
                    @change="logisticsChange"
                    expand-trigger="hover"
                    v-model="logisticsCompanyArr">
                  </el-cascader>
                  <div v-else>{{formData.logisticsway}}</div>
                </el-form-item>
              </el-col>
            </template>
            <template v-else-if="formData.shipmentType === '物流'">
              <el-col :span="12">
                <el-form-item label="运费方式：">
                  <el-select v-model="formData.shipFeeType"
                             v-if="editStatus"
                             placeholder="请选择">
                    <el-option
                      v-for="item in shipFeeType0ptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div v-else>{{formData.shipFeeType}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="物流公司：">
                  <el-cascader
                    v-if="editStatus"
                    :options="logisticsArr"
                    ref="cascaderAddr"
                    @change="logisticsChange"
                    expand-trigger="hover"
                    v-model="logisticsCompanyArr">
                  </el-cascader>
                  <div v-else>{{formData.logisticsway}}</div>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="12" v-if="formData.shipmentType === '送货' || formData.shipmentType === '快递'">
              <el-form-item label="预计送达日期：">
                <el-date-picker
                  v-if="editStatus"
                  v-model="formData.fcDate"
                  class="dateItem"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <el-time-select
                  v-if="editStatus"
                  v-model="formData.fcTime"
                  class="timeItem"
                  :picker-options="{
                    start: '09:00',
                    step: '00:60',
                    end: '20:00'
                   }"
                  placeholder="选择时间">
                </el-time-select>
                <div v-else>{{formData.fcDate}}{{formData.fcTime}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="地址：">
                <el-select v-if="editStatus" v-model="formData.provinceName" class="addressItem" placeholder="省" @change="provinceChange">
                  <el-option
                    v-for="(item,index) in provinceNameArr"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-if="editStatus" v-model="formData.cityName" class="addressItem" placeholder="市" @change="cityChange">
                  <el-option
                    v-for="(item,index) in cityNameArr"
                    :key="index"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
                <el-select v-if="editStatus" v-model="formData.countyName" class="addressItem" placeholder="区">
                  <el-option
                    v-for="item in countyNameArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-model="formData.address"
                          v-if="editStatus"
                          class="addressLongItem"
                          placeholder="请输入详细地址"></el-input>
                <div v-else>{{formData.provinceName}}{{formData.cityName}}{{formData.countyName}}{{formData.address}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="formData.remark"
                            v-if="editStatus"
                            type="textarea"
                            placeholder="请输入备注"></el-input>
                  <div v-else>{{formData.remark}}</div>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="msg2">
        <div class="title">
          付款明细
          <el-button v-if="editStatus"
                     style="float: right;"
                     type="primary"
                     @click="chooseOrder"
                     size="small">选择订单</el-button>
        </div>
        <el-table align="center"
                  :data="sendGoodsDetail"
                  width="100%"
                  show-summary
                  :summary-method="getSummaries"
                  sum-text="总计">
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="fusenOrder" label="富森订单号" align="center">
          </el-table-column>
          <el-table-column prop="partName" label="品名" align="center">
          </el-table-column>
          <el-table-column prop="model" label="型号" align="center">
          </el-table-column>
          <el-table-column prop="quantity" label="订单数量" align="center">
          </el-table-column>
          <el-table-column prop="ksendQty" label="可派货数量" align="center">
          </el-table-column>
          <el-table-column prop="sendQty" label="派货数量" width="200px" align="center">
            <template slot-scope="prop">
              <el-input-number v-model.number="prop.row.sendQty"
                               v-if="editStatus"
                               type="number"
                               :min="0"
                               :max="parseFloat(prop.row.ksendQty) || 0"
                               label="提货数量"></el-input-number>
              <div v-else>{{prop.row.sendQty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="declDate" label="订单日期" align="center">
          </el-table-column>
          <el-table-column prop="unit" label="单位" align="center">
          </el-table-column>
          <el-table-column prop="carton" label="箱数" align="center">
          </el-table-column>
          <el-table-column prop="grossWeight" label="毛重" align="center"></el-table-column>
          <el-table-column label="操作" align="center" v-if="editStatus">
            <template slot-scope="prop">
              <div delete @click="deleteItem(prop.$index)"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="msg3" v-if="editStatus || (formData.file && formData.file.length)">
        <div class="title">
          附件信息
        </div>
        <mUpload :file-list-data="formData.file || []"
                 :disabled="!editStatus"
                 @success="fileUploadSuccess"></mUpload>
      </div>
      <div slot="button" v-if="editStatus">
        <div style="text-align: right;">
          <el-button type="info"
                     :loading="btnLoading"
                     @click="saveHandle('保存')">暂存</el-button>
          <el-button type="success"
                     :loading="btnLoading"
                     @click="saveHandle('提交')">提交</el-button>
        </div>
      </div>
    </baseLayout>
    <!--选择订单-->
    <el-dialog title="选择订单" :visible.sync="showOrderDetail" class="choose">
      <div class="top-msg">
        <div class="text">已选中<span class="oColor"> {{chooseOrderSelectArr.length}} </span>个订单</div>
        <div class="search-container">
          <el-input v-model="searchOption.gatherSelcondition"
                    @keydown.native.13="chooseOrder"
                    class="search-input"
                    placeholder="请输入订单号">
          </el-input>
          <div class="searchIcon"
               @click="chooseOrder">
            <i class="search el-icon-search"></i>
          </div>
        </div>
      </div>
      <el-table align="center"
                :data="orderDtailData"
                @selection-change="chooseOrderSelect"
                height="400px"
                width="100%">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="fusenOrder" label="富森号" align="center" width="120"></el-table-column>
        <el-table-column property="partName" label="品名" align="center" width="120"></el-table-column>
        <el-table-column property="model" label="型号" align="center" width="110"></el-table-column>
        <el-table-column property="quantity" label="订单数量" align="center"></el-table-column>
        <el-table-column property="ksendQty" label="派货数量" align="center" width="100"></el-table-column>
        <el-table-column property="declDate" label="订单日期" align="center"></el-table-column>
        <el-table-column prop="price" label="单价" align="center"></el-table-column>
        <el-table-column property="unit" label="单位" align="center"></el-table-column>
        <el-table-column property="carton" label="箱数" align="center"></el-table-column>
        <el-table-column property="grossWeight" label="毛重" align="center"></el-table-column>
      </el-table>
      <div class="choose-page" v-show="pageTotal">
        <el-pagination background
                       @current-change="takeGoodsCurrentChange"
                       :page-size="searchOption.pageCount"
                       :current-page.sync="searchOption.pageSize"
                       layout="prev, pager, next"
                       :total="pageTotal"></el-pagination>
      </div>
      <div class="choose-button">
        <el-button size="small"
                   type="info"
                   @click="showOrderDetail = false">取 消</el-button>
        <el-button size="small"
                   type="warning"
                   @click="sureBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import baseLayout from '@/components/detailsBaseLayout'
  import mUpload from '@/components/mUpload'
  import req from '@/utils/req'
  import cityData from '@/assets/js/cityData'
  import api from '@/utils/apiUtil'
  import _ from 'lodash'
  export default {
    data() {
      return {
        loadState: false,
        editStatus: true,
        btnLoading: false,
        cityData: cityData,
        sendNo: '',
        thirdParty: false,
        pickerOptions1: { disabledDate(time) { return time.getTime() < Date.now() - 8.64e7 } },
        logisticsArr: [],
        logisticswayArr: [
          {
            label: '汽运上门'
          },
          {
            label: '汽运自提'
          },
          {
            label: '空运上门'
          },
          {
            label: '空运自提'
          },
          {
            label: '卡车上门'
          },
          {
            label: '卡车自提'
          },
          {
            label: '铁路运输'
          },
          {
            label: '汽运上楼'
          },
          {
            label: '空运上楼'
          },
          {
            label: '卡车上楼'
          }
        ],
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
            label: '派货数量',
            prop: 'sendQty',
            width: '',
            type: 'input'
          }
        ],
        // 币别
        orderDtailData: [
          // {
          //   orderId: '',
          //   goodsId: '',
          //   sendOrderId: '',
          //   fusenOrder: '',
          //   partName: '',
          //   model: '',
          //   quantity: '',
          //   sendQty: '',
          //   price: '',
          //   declDate: '',
          //   grossWeight: '',
          //   unit: '',
          //   carton: ''
          // }
        ],
        formData: {
          id: '',
          sendNo: this.sendNo,
          fusenOrder: '',
          shipmentType: '自提',
          sendCompany: '',
          logisticsCompany: '',
          linkMan: '',
          linkPhone: '',
          iDCard: '',
          provinceName: '',
          cityName: '',
          countyName: '',
          address: '',
          logisticsway: '', // 物流方式
          signOrder: '',
          custId: '',
          fcDate: '',
          basb001FkWl: '',
          express_type: '',
          shipFeeType: '',
          rcvAmt: '',
          currency: '',
          remark: '',
          fcTime: '',
          customId: '',
          shipmentTypeFk: '',
          goods: [],
          file: []
        },
        rules: {
          logisticsway: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ]
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
        shipments: '',
        pageTotal: 0,
        searchOption: {
          pageSize: 1,
          pageCount: 20,
          customId: '000293BC-0000-0000-0000-0000F07BD17E',
          gatherSelcondition: ''
        },
        chooseOrderSelectArr: [],
        // 币别下拉数据
        currencyOptions: [
          { label: 'RMB', value: '1' },
          { label: 'USD', value: '2' },
          { label: 'HKD', value: '3' },
          { label: 'SGD', value: '4' },
          { label: 'EUR', value: '5' },
          { label: 'JPY', value: '6' },
          { label: 'GBP', value: '7' },
          { label: 'CHF', value: '8' },
          { label: 'AUD', value: '9' },
          { label: 'CAD', value: '10' },
          { label: 'SEK', value: '11' }
        ],
        logisticsCompanyArr: [], // 物流公司提示
        sendCompanyArr: [], // 自送公司/送达公司
        showOrderDetail: false,
        sendGoodsDetail: []
      }
    },
    watch: {
      /* todo */
      'formData.shipmentType'(v) {
        this.tabTagData = this.tabTagData.filter((val) => {
          return val.label !== '毛重'
        })
        if (v === '物流' || v === '快递') {
          this.tabTagData.push({
            label: '毛重',
            prop: 'grossWeight',
            width: ''
          })
        }
      }
    },
    created() {
      this.sendCompany()
      this.sendGoodsFn()
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
    activated() {
      // 获取详情
      if (this.$route.query.id) {
        this.sendGoodsData()
      }
      // 判断当前是否需要读取派货车数据
      if (this.$route.query.getCarData === '1') {
        this.getCarData()
      }
    },
    methods: {
      /**
       * dialog页数改变
       * */
      takeGoodsCurrentChange(val) {
        this.searchOption.pageSize = val
        this.chooseOrder()
      },
      /**
       * 导出dialog数据
       * */
      sureBtn() {
        this.showOrderDetail = false
        this.sendGoodsDetail = this.chooseOrderSelectArr.concat(this.sendGoodsDetail)
      },
      /**
       * 文件上传成功
       * */
      fileUploadSuccess(fileItem) {
        this.formData.file.push({
          fileName: fileItem.name,
          fileType: fileItem.raw.type,
          ftypename: '',
          fileId: fileItem.response.fileId
        })
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计'
            return
          } else if (index === 1 || index === 2 || index === 3) {
            sums[index] = ''
            return
          }
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
            sums[index]
          }
        })
        return sums
      },
      /**
      * 获取派货单详情
      * */
      sendGoodsData() {
        req.get('api/import/logistics/sendorder/object', {
          params: {
            orderId: this.$route.query.id
          }
        }).then((res) => {
          if (res.data.shipFeeType === '3') {
            this.thirdParty = true
          } else {
            this.thirdParty = false
          }
          this.logisticsCompanyArr[0] = res.data.basb001FkWl
          this.logisticsCompanyArr[1] = res.data.express_type
          this.formData = res.data
          this.sendGoodsDetail = res.data.goods
          this.formData.file = res.data.file
          this.selfLifting(res.data.shipmentType)
          this.logisticsFn(res.data.shipmentType)
          this.formData.fcDate = api.getDate(res.data.fcDate)
          if (this.formData.status === '0') {
            this.editStatus = true
          } else {
            this.editStatus = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 获取派货车数据赋值给当前数组内
       * */
      async getCarData() {
        let res = await this.$axios.get('/api/import/logistics/sendgoodscar/list').catch((err) => {
          console.log(err)
        })
        if (res && Array.isArray(res.data)) {
          this.sendGoodsDetail = res.data
        }
      },
      logisticsChange(val) {
        let test = this.formData.shipmentType
        if (test === '快递') {
          this.formData.basb001FkWl = val[0]
          this.formData.express_type = val[1]
        } else if (test === '物流') {
          this.formData.basb001FkWl = val[0]
          this.formData.express_type = val[1]
          this.formData.logisticsway = this.$refs.cascaderAddr.currentLabels && this.$refs.cascaderAddr.currentLabels[1]
        }
      },
      logisticsFn(val) {
        val = this.formData.shipmentType
        req.get('api/import/logistics/baseinfo/expresstype', {
          params: {
            shipmenttype: val
          }
        }).then((res) => {
          this.logisticsArr = res.data
        }).catch((error) => {
          console.log(error)
        })
      },
      saveHandle(type) {
        if (type === '保存') {
          this.formData.status = '0'
          this.orderMessage()
        } else if (type === '提交') {
          this.formData.status = '1'
          this.orderMessage()
        }
      },
      sendGoodsFn() {
        if (this.$route.query.id) {
          req.get('api/import/logistics/baseinfo/sendgoodsdetails', {
            params: {
              'id': this.$route.query.id
            }
          }).then((res) => {
            this.chooseOrderSelectArr = res.data || []
          }).catch((error) => {
            console.log(error)
          })
        }
      },
      orderMessage() {
        this.btnLoading = true
        this.formData.goods = this.chooseOrderSelectArr
        this.formData.sendNo = this.sendNo
        let jsonStr = JSON.stringify(this.formData)
        req.post('api/import/logistics/sendorder/save', { jsonStr }).then((res) => {
          this.btnLoading = false
          // 数据重置
          Object.assign(this.formData, this.$options.data().formData)
          this.$store.dispatch('delVisitedViews', { fullPath: this.$route.fullPath })
          this.$router.replace({ path: '/import/sendGoods/sendGoodsSearch' })
        }).catch((error) => {
          this.btnLoading = false
          console.log(error)
        })
      },
      sendCompanyQuerySearch(queryString, cb) {
        var restaurants = this.sendCompanyArr
        var results = queryString ? restaurants.filter(this.sendCompanyCreateFilter(queryString)) : restaurants
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
          this.shipments = this.formData.shipmentType
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
        this.formData.sendCompany = item.sendCompany
        this.formData = this.sendGoodsFilterArr[item.index]
        this.formData.file = []
        this.formData.shipmentType = this.shipments
      },
      selfLifting(val) {
        this.Shipments = val
        this.formData.shipmentType = val
        this.sendCompany(val)
        this.logisticsFn()
      },
      provinceChange(e) {
        for (let i = 0; i < this.provinceNameArr.length; i++) {
          if (e === this.provinceNameArr[i].label) {
            this.formData.cityName = ''
            this.formData.countyName = ''
            this.cityNameArr = this.provinceNameArr[i].children
          }
        }
      },
      cityChange(e) {
        for (let i = 0; i < this.cityNameArr.length; i++) {
          if (e === this.cityNameArr[i].label) {
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
        this.sendGoodsDetail.splice(index, 1)
      },
      chooseOrder() {
        this.showOrderDetail = true
        let jsonStr = _.clone(this.searchOption)
        jsonStr.pageSize -= 1
        jsonStr = JSON.stringify(jsonStr)
        req.post('api/import/logistics/sendordergoods/list', { jsonStr }).then((res) => {
          this.orderDtailData = res.data.list
          this.pageTotal = res.data.total
          this.showOrderDetail = true
        }).catch((error) => {
          console.log(error)
        })
      },
      handleChange(file) {
        if (file.response) {
          let theFile = {
            fileName: file.raw.name,
            fileType: file.raw.type,
            fTypeName: '',
            fileId: file.response.fileId
          }

          this.formData.file.push(theFile)
        }
      }
    },
    components: {
      baseLayout,
      mUpload
    }
  }
</script>

<style scoped lang="scss">
  .content{
    width: 100%;
    height: 100%;
    .mButton{
      margin-bottom: 30px;
      .item{
        margin-right: 20px;
      }
    }
    /*标题*/
    .title{
      font-size: 15px;
      font-weight: 600;
      color: #272727;
      margin-bottom: 25px;
    }
  }
</style>
<style lang="scss">
  .content {
    .top-msg{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 36px;
      margin-bottom: 20px;
      .text{
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        .oColor{
          color: #E78C0B;
        }
      }
      /*搜索框*/
      .search-container {
        position: relative;
        height: 36px;
        width: 302px;
        margin-left: 20px;
        font-size: 0;
        .search-input {
          vertical-align: top;
          display: inline-block;
          height: 36px;
          width: 262px;
          .el-input__inner {
            height: 36px;
            border-radius: 4px 0 0 4px;
            border-right: 0;
          }
        }
        .searchIcon {
          display: inline-block;
          width: 40px;
          height: 36px;
          text-align: center;
          background: #F6890A;
          cursor: pointer;
          .search {
            display: inline-block;
            margin-top: 8px;
            color: #fff;
            font-size: 20px;
          }
        }
      }
    }
    .choose-page{
      margin-top: 30px;
      text-align: right;
    }
    .choose-button{
      margin-top: 30px;
      text-align: right;
    }
    .dateItem, .timeItem{
      width: 138px;
    }
    .addressItem{
      width: 134px;
      .el-input{
        width: 134px;
      }
    }
  }
</style>
