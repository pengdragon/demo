<template>
  <div class="container-wrapper" v-loading="loadState">
    <flowSteps :titleArr="titleArr"
               :propsActiveIndex="activeIndex"
               :hideContrl="editStatus"
               :saveBtnState="saveBtnState"
               @nextStepHandle="nextStepHandle"
               @saveHandle="saveHandle"
               class="flow">
      <div slot="step1">
        <el-form :label-width="'120px'"
                 :model="formData"
                 :rules="formRules"
                 ref="formMain1"
                 size="small"
                 class="form-content">
          <!--选择出货方式单选-->
          <el-form-item label="出货方式：" prop="shipmentTypeFk" class="formItem Shipments">
            <el-select v-model="formData.shipmentTypeFk" placeholder="请选择出货方式"
                       @change="shipmentTypeChange"
                       v-if="editStatus"
                       class="inputBox">
              <el-option v-for="item in shipmentTypeList"
                         :label="item.label"
                         :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
            <div v-else>{{formData.shipmentType}}</div>
          </el-form-item>
          <!--自提-->
          <div class="self form-content" v-if="formData.shipmentTypeFk === '000756ff-0000-0000-0000-0000aa3616f5'">
            <el-form-item label="提货人" prop="linkMan" class="formItem">
              <el-input v-model="formData.linkMan"
                        v-if="editStatus"
                        class="inputBox"
                        placeholder="请输入姓名"></el-input>
              <div v-else>{{formData.linkMan}}</div>
            </el-form-item>
            <el-form-item label="电话" prop="linkPhone" class="formItem">
              <el-input v-model="formData.linkPhone"
                        v-if="editStatus"
                        class="inputBox"
                        placeholder="请输入联系电话"></el-input>
              <div v-else>{{formData.linkPhone}}</div>
            </el-form-item>
            <el-form-item label="身份证号" prop="iDCard" class="formItem">
              <el-input v-model="formData.iDCard"
                        v-if="editStatus"
                        class="inputBox"
                        placeholder="请输入身份证号"></el-input>
              <div v-else>{{formData.iDCard}}</div>
            </el-form-item>
          </div>
          <div class="logistics form-content" v-else>
            <el-form-item label="送达公司：" prop="sendCompany" class="formItem">
              <el-select v-model="formData.sendCompany"
                         v-if="editStatus"
                         placeholder="请输入送达公司"
                         filterable
                         class="inputBox">
                <el-option v-for="(item, index) in sendCompanyList"
                           :key="index"
                           :label="item.label"
                           :value="item.label"></el-option>
              </el-select>
              <div v-else>{{formData.sendCompany}}</div>
            </el-form-item>
            <el-form-item label="联系人：" class="formItem star">
              <div style="width: 360px;">
                <el-form-item prop="linkMan" style="display: inline-block">
                  <el-input v-model="formData.linkMan"
                            v-if="editStatus"
                            class="inputName"
                            placeholder="请输入姓名"></el-input>
                  <div v-else>{{formData.linkMan}}</div>
                </el-form-item>
                <el-form-item prop="linkPhone" style="display: inline-block">
                  <el-input v-model="formData.linkPhone"
                            v-if="editStatus"
                            class="inputTel"
                            placeholder="请输入联系电话"></el-input>
                  <div v-else>{{formData.linkPhone}}</div>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="地址：" class="formItem Shipments star">
              <el-form-item prop="provinceName" style="display: inline-block" v-if="editStatus">
                <el-select v-model="formData.provinceName"
                           placeholder="省"
                           class="inputName" @change="provinceChange">
                  <el-option
                    v-for="item in provinceNameArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="cityName" style="display: inline-block" v-if="editStatus">
                <el-select v-model="formData.cityName"
                           placeholder="市" class="inputName" @change="cityChange">
                  <el-option
                    v-for="item in cityNameArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="countyName" style="display: inline-block" v-if="editStatus">
                <el-select v-model="formData.countyName"
                           placeholder="区" class="inputName">
                  <el-option
                    v-for="item in countyNameArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="address" style="display: inline-block" v-if="editStatus">
                <el-input v-model="formData.address"
                          class="inputBox"
                          placeholder="请输入详细地址"></el-input>
              </el-form-item>
              <div v-else>{{`${formData.provinceName} ${formData.cityName} ${formData.countyName} ${formData.address}`}}</div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="step2">
        <!--自提-->
        <div v-if="formData.shipmentTypeFk === '000756ff-0000-0000-0000-0000aa3616f5'">
          <el-form :label-width="'120px'"
                   :model="formData"
                   :rules="formRules"
                   ref="formMain2"
                   size="small"
                   class="form-content">
            <el-form-item label="预计送达日期：" class="formItem star">
              <div style="width: 360px;">
                <el-form-item prop="fcDate" style="display: inline-block" v-if="editStatus">
                  <el-date-picker
                    v-model="formData.fcDate"
                    type="date"
                    class="inputTel"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop="fcTime" style="display: inline-block" v-if="editStatus">
                  <el-select v-model="formData.fcTime"
                             class="inputName"
                             placeholder="选择时间">
                    <el-option
                      v-for="item in timeOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div v-else>{{formData.fcDate}}</div>
              </div>
            </el-form-item>
            <el-form-item label="备注：" prop="remark" class="formItem">
              <el-input v-model="formData.remark"
                        v-if="editStatus"
                        autosize
                        type="textarea"
                        class="inputBox"
                        placeholder="请输入备注"></el-input>
              <pre v-else>{{formData.remark}}</pre>
            </el-form-item>
          </el-form>
        </div>
        <!--快递-->
        <div v-else-if="formData.shipmentTypeFk === '00071f15-0000-0000-0000-00000c456ffd'">
          <el-form :label-width="'120px'"
                   :model="formData"
                   :rules="formRules"
                   ref="formMain2"
                   size="small"
                   class="form-content">
            <el-form-item label="运费方式：" prop="shipFeeType" class="formItem">
              <el-select v-model="formData.shipFeeType"
                         v-if="editStatus"
                         placeholder="请选择运费方式" class="inputBox">
                <el-option
                  v-for="item in shipFeeType0ptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div v-else>{{shipFeeTypeLabel}}</div>
            </el-form-item>
            <el-form-item label="清关：" prop="passNameType" class="formItem">
              <el-select v-model="formData.passNameType"
                         v-if="editStatus"
                         placeholder="请选择清关方式" class="inputBox">
                <el-option label="智龙" value="1"></el-option>
                <el-option label="非智龙" value="2"></el-option>
              </el-select>
              <div v-else>{{passNameTypeLabel}}</div>
            </el-form-item>
            <el-form-item label="发货方：" prop="shipperType" class="formItem">
              <el-select v-model="formData.shipperType"
                         v-if="editStatus"
                         placeholder="请选择发货方" class="inputBox">
                <el-option label="智龙" value="1"></el-option>
                <el-option label="非智龙" value="2"></el-option>
              </el-select>
              <div v-else>{{shipperTypeLabel}}</div>
            </el-form-item>
            <el-form-item label="快递月结卡号：" prop="custId" class="formItem">
              <el-input v-model="formData.custId"
                        v-if="editStatus"
                        class="inputBox"
                        placeholder="请输入月结卡号"></el-input>
              <div v-else>{{formData.custId}}</div>
            </el-form-item>
            <el-form-item label="物流公司：" prop="basb001FkWl" class="formItem">
              <el-select filterable
                         v-if="editStatus"
                         v-model="formData.basb001FkWl"
                         placeholder="请选择物流公司"
                         class="inputBox">
                <el-option
                  v-for="item in logisticsCompanyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div v-else>{{basb001FkWlLabel}}</div>
            </el-form-item>
            <el-form-item label="预计送达日期：" class="formItem star">
              <div style="width: 360px;" v-if="editStatus">
                <el-form-item prop="fcDate" style="display: inline-block">
                  <el-date-picker
                    v-model="formData.fcDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    class="inputTel"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop="fcTime" style="display: inline-block">
                  <el-select v-model="formData.fcTime"
                             class="inputName"
                             placeholder="选择时间">
                    <el-option
                      v-for="item in timeOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-else>{{formData.fcDate}}</div>
            </el-form-item>
            <el-form-item label="备注：" prop="remark" class="formItem">
              <el-input v-model="formData.remark"
                        v-if="editStatus"
                        autosize
                        type="textarea"
                        class="inputBox"
                        placeholder="请输入备注"></el-input>
              <pre v-else>{{formData.remark}}</pre>
            </el-form-item>
          </el-form>
        </div>
        <!--送货及其他-->
        <div v-else>
          <el-form :label-width="'120px'"
                   :model="formData"
                   :rules="formRules"
                   ref="formMain2"
                   size="small"
                   class="form-content">
            <el-form-item label="运费方式："
                          prop="shipFeeType" class="formItem">
              <el-select v-model="formData.shipFeeType"
                         v-if="editStatus"
                         placeholder="请选择运费方式" class="inputBox">
                <el-option
                  v-for="item in shipFeeType0ptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div v-else>{{shipFeeTypeLabel}}</div>
            </el-form-item>
            <el-form-item label="清关："
                          prop="passNameType" class="formItem">
              <el-select v-model="formData.passNameType"
                         v-if="editStatus"
                         placeholder="请选择清关方式" class="inputBox">
                <el-option label="智龙" value="1"></el-option>
                <el-option label="非智龙" value="2"></el-option>
              </el-select>
              <div v-else>{{passNameTypeLabel}}</div>
            </el-form-item>
            <el-form-item label="发货方："
                          prop="shipperType" class="formItem">
              <el-select v-model="formData.shipperType"
                         v-if="editStatus"
                         placeholder="请选择发货方" class="inputBox">
                <el-option label="智龙" value="1"></el-option>
                <el-option label="非智龙" value="2"></el-option>
              </el-select>
              <div v-else>{{shipperTypeLabel}}</div>
            </el-form-item>
            <el-form-item label="预计送达日期：" class="formItem star">
              <div style="width: 360px;" v-if="editStatus">
                <el-form-item prop="fcDate" style="display: inline-block">
                  <el-date-picker
                    v-model="formData.fcDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    class="inputTel"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop="fcTime" style="display: inline-block">
                  <el-select v-model="formData.fcTime"
                             class="inputName"
                             placeholder="选择时间">
                    <el-option
                      v-for="item in timeOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-else>{{formData.fcDate}}</div>
            </el-form-item>
            <el-form-item label="备注：" class="formItem">
              <el-input v-model="formData.remark"
                        v-if="editStatus"
                        autosize
                        type="textarea"
                        class="inputBox"
                        placeholder="请输入备注"></el-input>
              <pre v-else>{{formData.remark}}</pre>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="step3">
        <el-col class="tableView-wrapper">
          <div class="title-wrapper" v-if="editStatus">
            <span class="handleButton">
              <el-button type="primary" size="small" @click="showDialog">选择订单</el-button>
            </span>
          </div>
          <!--商品明细列表-->
          <el-table
            :data="formData.goods"
            class="table-main"
            border
            show-summary
            :summary-method="getSum"
          >
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="fusenOrder" label="富森单号" align="center">
              <template slot-scope="prop">
                {{prop.row.fusenOrder}}
              </template>
            </el-table-column>
            <el-table-column prop="partName" label="品名" align="center">
              <template slot-scope="prop">
                {{prop.row.partName}}
              </template>
            </el-table-column>
            <el-table-column prop="model" label="型号" align="center">
              <template slot-scope="prop">
                {{prop.row.model}}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="订单数量" align="center">
              <template slot-scope="prop">
                {{prop.row.quantity}}
              </template>
            </el-table-column>
            <el-table-column prop="ksendQty" label="可发货数量" align="center">
              <template slot-scope="prop">
                {{prop.row.ksendQty}}
              </template>
            </el-table-column>
            <el-table-column prop="sendQty" label="发货数量" align="center">
              <template slot-scope="prop">
                <el-input v-model.number="prop.row.sendQty"
                          v-if="editStatus"
                          @input="sendQtyHandle($event, prop.row)"
                          type="number"
                          placeholder="请输入发货数量"></el-input>
                <div v-else>{{prop.row.sendQty}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="grossWeight" label="毛重" align="center">
              <template slot-scope="prop">
                {{prop.row.grossWeight}}
              </template>
            </el-table-column>
            <el-table-column v-if="editStatus" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" style="color: #85ce61" @click="deleteItem(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--文件上传-->
          <div class="uploadTitle" v-if="editStatus">
            附件上传
          </div>
          <el-upload
            class="upload-content"
            accept=".xls,.xlsx,.txt,.doc,.docx,.pdf"
            :data="parameter"
            :action="`${ baseUrl }/file/upload`"
            :on-change="handleChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            multiple
            :file-list="fileList">
            <el-button v-if="editStatus" size="small" type="primary">点击上传</el-button>
            <div v-if="editStatus" slot="tip" class="el-upload__tip">支持上传文件:表格(*.xls;*.xlsx) 文档(*.txt,*.doc,*.docx,*.pdf)</div>
            <div v-else slot="tip" style="font-size: 16px;font-weight: bold;color: #1F9BD6;">附件列表:</div>
          </el-upload>
        </el-col>
      </div>
    </flowSteps>
    <!--明细选择弹框-->
    <el-dialog title="选择订单" :visible.sync="showOrderDetail" class="choose">
      <el-form  inline size="medium" class="formFlexBox">
        <el-form-item>
          <div class="tmpContent">
            <el-input
              class="inline-input"
              v-model="searchOptions.gatherSelcondition"
              @keydown.native.13="chooseOrder"
              placeholder="请输入订单号">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item class="search-button">
          <el-button type="primary" @click="chooseOrder">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table align="center"
                :data="orderDetailData"
                @selection-change="chooseOrderSelect"
                v-loading="tabLoading"
                :border="true" style="width:100%;">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="fusenOrder" label="富森号" align="center" width="120"></el-table-column>
        <el-table-column property="partName" label="品名" align="center" width="120"></el-table-column>
        <el-table-column property="model" label="型号" align="center" width="110"></el-table-column>
        <el-table-column property="quantity" label="订单数量" align="center"></el-table-column>
        <el-table-column property="sendQty" label="派货数量" align="center" width="100"></el-table-column>
        <el-table-column property="createDate" label="订单日期" align="center"></el-table-column>
        <el-table-column property="unit" label="单位" align="center"></el-table-column>
        <el-table-column property="grossWeight" label="毛重" align="center"></el-table-column>
      </el-table>
      <div class="orderDetail-pagination">
        <el-pagination
          :page-size="searchOptions.pageCount"
          layout="prev, pager, next"
          :current-page.sync="searchOptions.pageSize"
          @current-change="pageCountChange"
          background
          :total="orderDetailTotal">
        </el-pagination>
      </div>
      <div slot="footer">
        <el-button type="primary"
                   :disabled="exportTableDataButton_state"
                   @click="exportTableDataHandle">导出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import flowSteps from '@/components/flowSteps'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  import cityData from '@/assets/js/cityData'
  import _ from 'lodash'
  export default {
    data() {
      const timeOptions = []
      for (let i = 9; i <= 20; i++) {
        timeOptions.push({
          value: i === 9 ? '09' : i + '',
          label: i
        })
      }
      return {
        cityData: cityData,
        baseUrl: window.g.baseUrl, // 请求基础地址
        parameter: { // 文件上传配置ID
          orderId: '0006C275-0000-0000-0000-00000E97FDBC',
          customId: '736CA29F-0B32-409C-9159-64F1C3EDD949'
        },
        titleArr: [
          '选择出货方式',
          '提交基本信息',
          '提交发货明细'
        ],
        orderDetailTotal: 0, // 弹框内订单明细列表总数
        orderDetailData: [], // 弹框中订单明细列表
        searchOptions: { // 弹框内搜索明细
          pageCount: 2,
          pageSize: 1,
          gatherSelcondition: ''
        },
        formRules: {
          shipmentTypeFk: [{ required: true, message: '请选择出货方式', trigger: 'blur' }], // 出货方式
          iDCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }], // 身份证号
          sendCompany: [{ required: true, message: '请选择送达公司', trigger: 'blur' }], // 送达公司
          linkMan: [{ required: true, message: '请输入姓名', trigger: 'blur' }], // 联系人姓名
          linkPhone: [{ required: true, message: '请输入电话', trigger: 'blur' }], // 联系人电话
          provinceName: [{ required: true, message: '请选择省份', trigger: 'change' }], // 省份
          cityName: [{ required: true, message: '请选择城市', trigger: 'change' }], // 城市
          countyName: [{ required: true, message: '请选择区', trigger: 'change' }], // 区
          address: [{ required: true, message: '请输入地址', trigger: 'blur' }], // 地址
          shipFeeType: [{ required: true, message: '请选择运费方式', trigger: 'blur' }], // 运费方式
          shipperType: [{ required: true, message: '请选择发货方', trigger: 'blur' }], // 发货方
          passNameType: [{ required: true, message: '请选择清关', trigger: 'blur' }], // 清关
          custId: [{ required: true, message: '请输入快递月结卡号', trigger: 'blur' }], // 快递月结卡
          basb001FkWl: [{ required: true, message: '请选择物流公司', trigger: 'blur' }], // 物流公司外键
          fcDate: [{ required: true, message: '请选择送货时间', trigger: 'blur' }], // 预计送货时间
          fcTime: [{ required: true, message: '请选择时', trigger: 'blur' }], // 预计送货时
          remark: [] // 备注
        },
        activeIndex: 1, // 步进器激活的进度
        formData: { // 表单数据
          status: '', // 保存状态
          id: '',
          documentNumber: '', // 单据编码
          shipmentType: '', // 出货方式
          shipmentTypeFk: '000756ff-0000-0000-0000-0000aa3616f5', // 出货方式外键
          iDCard: '', // 身份证号
          sendCompany: '', // 送达公司
          basb001d6fk: '', // 送达公司外键
          linkMan: '', // 联系人姓名
          linkPhone: '', // 联系人电话
          provinceName: '', // 省份
          cityName: '', // 城市
          countyName: '', // 区
          address: '', // 地址
          shipFeeType: '', // 运费方式
          shipperType: '', // 发货方
          passNameType: '', // 清关
          custId: '', // 快递月结卡
          basb001FkWl: '', // 物流公司外键
          fcDate: '', // 预计送货时间
          fcTime: '', // 预计送货时
          remark: '', // 备注
          file: [], // 文件列表
          goods: [ // 派货明细列表
          ]
        },
        shipFeeTypeLabel: '', // 运费方式文本值
        shipperTypeLabel: '', // 发货方文本值
        passNameTypeLabel: '', // 清关文本值
        basb001FkWlLabel: '', // 物流公司文本值
        timeOptions, // 时列表
        provinceNameArr: cityData.data, // 省份下拉数据
        cityNameArr: [], // 城市下拉数据
        countyNameArr: [], // 地区下拉数据
        shipmentTypeList: [ // 出货方式列表
          { label: '自提', value: '000756ff-0000-0000-0000-0000aa3616f5' },
          { label: '送货', value: '000756ff-0000-0000-0000-0000aa3616f1' },
          { label: '快递', value: '00071f15-0000-0000-0000-00000c456ffd' },
          { label: '内部转交', value: '000ead95-0000-0000-0000-00000e86ea34' },
          { label: '不经智龙送货', value: '000f1b15-0000-0000-0000-000005a39057' },
          { label: '转福保', value: '00069f11-0000-0000-0000-0000b6599d8f' },
          { label: '福保转智龙', value: '000809f0-0000-0000-0000-00003d63584c' }
        ],
        shipFeeType0ptions: [ // 运费方式数据
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
        chooseOrderSelectArr: [], // 弹框内当前选中的订单明细选项
        currencyOptions: [], // 币别下拉数据
        logisticsCompanyList: [], // 物流公司提示
        sendCompanyList: [], // 送达公司列表
        fileList: [], // 显示的文件列表
        showOrderDetail: false, // 显示弹框控制
        editStatus: true, // 当前页面是否可编辑
        loadState: false, // 当前页面加载状态
        tabLoading: false, // 列表加载状态
        saveBtnState: false // 保存提交按钮状态
      }
    },
    computed: {
      /**
       * 导出按钮状态控制
       * */
      exportTableDataButton_state() {
        return !(this.chooseOrderSelectArr.length !== 0)
      }
    },
    mounted() {
      // 判断当前是否为查看
      if (this.$route.query.id) {
        this.getOrderDetail()
      } else {
        // 获取送达公司
        this.getSendCompany()
        // 获取物流公司
        this.getLogisticsCompany()
      }
    },
    methods: {
      /**
       * 可派货数计算
       * */
      sendQtyHandle(val, row) {
        if (parseFloat(val) > parseFloat(row.ksendQty)) {
          row.sendQty = row.ksendQty
        }
      },
      /**
       * 查看详情时,匹配文本值
       * */
      parserText() {
        // 发货方
        if (this.formData.shipperType === '1') {
          this.shipperTypeLabel = '智龙'
        } else if (this.formData.shipperType === '2') {
          this.shipperTypeLabel = '非智龙'
        }
        // 清关
        if (this.formData.passNameType === '1') {
          this.passNameTypeLabel = '智龙'
        } else if (this.formData.passNameType === '2') {
          this.passNameTypeLabel = '非智龙'
        }
        // 运费方式
        this.shipFeeType0ptions.map((val) => {
          if (val.value === this.formData.shipFeeType) {
            this.shipFeeTypeLabel = val.label
          }
        })
      },
      /**
       * 改变送货方式,清除校验结果
       * */
      shipmentTypeChange() {
        this.$refs.formMain1.clearValidate()
        this.$refs.formMain2.clearValidate()
        // 清除送货公司及物流公司数据
        this.formData.sendCompany = ''
        this.formData.basb001FkWl = ''
        // 重新拉取送货公司数据
        this.getSendCompany()
        // 重新拉取物流公司
        this.getLogisticsCompany()
      },
      /**
       * 步进器下一步的处理
       * */
      nextStepHandle(currentStepNumber) {
        const _this = this
        if (currentStepNumber === 1) {
          // 第一步校验表单输入必填项
          this.$refs.formMain1.validate((v) => {
            if (v) {
              _this.activeIndex += 1
            }
          })
        } else if (currentStepNumber === 2) {
          // 第一步校验表单输入必填项
          this.$refs.formMain2.validate((v) => {
            if (v) {
              _this.activeIndex += 1
            }
          })
        } else {
          this.activeIndex += 1
        }
      },
      /**
       * 获取订单详情
       * */
      getOrderDetail() {
        this.loadState = true
        const id = this.$route.query.id
        this.$axios.get('/api/export/logistics/sendgoods/object', { params: { id }}).then((res) => {
          for (let key in res.data) {
            this.formData[key] = res.data[key]
          }
          // 序列化文件列表
          this.parseFileList()
          // 判断可编辑状态
          if (this.formData.status !== '' && this.formData.status !== '0') {
            this.editStatus = false
            // 匹配文本值数据
            this.parserText()
          }
          // 小写shipmentTypeFk
          this.formData.shipmentTypeFk = this.formData.shipmentTypeFk.toLowerCase()
          // 匹配时间
          this.formData.fcTime = this.formData.fcTime ? this.formData.fcTime.trim().slice(0, 2) : ''
          // 打开步进器
          this.activeIndex = 3
          // 获取送达公司
          this.getSendCompany()
          // 获取物流公司
          this.getLogisticsCompany()
          // 结束加载动画
          this.loadState = false
        }).catch((err) => {
          this.loadState = false
          console.log(err)
        })
      },
      /**
       * 序列化fileList
       * */
      parseFileList() {
        let baseUrl = this.baseUrl
        if (Array.isArray(this.formData.file)) {
          this.formData.file.map((file) => {
            this.fileList.push({
              id: file.id,
              name: file.fileName,
              url: `${baseUrl}file/download/${file.fileId}`
            })
          })
        }
      },
      /**
       * 获取商品明细表格总和方法
       * */
      getSum(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计:'
            return
          }
          if (index === 4 || index === 5 || index === 6) {
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
       * 获取订单ID
       * */
      async getOrderId() {
        return await req.get('api/import/order/orderinfo/getid').catch((error) => {
          console.log(error)
        })
      },
      /**
       * 保存提交操作
       * */
      async saveHandle(type) {
        this.saveBtnState = true
        // 校验表单
        let checkout = false
        this.$refs.formMain1.validate((v) => {
          checkout = !v
        })
        if (checkout) {
          this.saveBtnState = false
          return
        }
        this.$refs.formMain2.validate((v) => {
          checkout = !v
        })
        if (checkout) {
          this.saveBtnState = false
          return
        }
        // 判断是否不存在ID
        let formData = _.cloneDeep(this.formData)
        if (formData.id === '') {
          let result = await this.getOrderId()
          formData.id = result.orderId
        }
        // 判断保存类型
        if (type === '保存') {
          formData.status = '0'
        } else if (type === '提交') {
          formData.status = '1'
        }
        // 处理fusenOrder单号
        let fusenOrderArr = _.cloneDeep(formData.goods)
        fusenOrderArr = _.uniqBy(fusenOrderArr, 'fusenOrder')
        let handleArr = []
        fusenOrderArr.map((val) => {
          handleArr.push(val.fusenOrder)
        })
        formData.fusenOrder = handleArr.join(',')
        // 匹配shipmenttype
        this.shipmentTypeList.map((val) => {
          if (val.value === formData.shipmentTypeFk) {
            formData.shipmentType = val.label
          }
        })
        // 匹配basb001d6fk
        this.sendCompanyList.map((val) => {
          if (val.label === formData.sendCompany) {
            formData.basb001d6fk = val.value
          }
        })
        // 发送保存请求
        this.$axios.post('/api/export/logistics/sendgoodsobject/save', formData).then((res) => {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          })
          this.saveBtnState = false
          // 清除当前表单数据,及提示
          Object.assign(this.$data.formData, this.$options.data().formData)
          // 清除提示
          this.$refs.formMain1.resetFields()
          this.$refs.formMain2.resetFields()
          // 关闭当前页签
          this.$store.dispatch('delVisitedViews', { fullPath: this.$route.fullPath })
          // 重定向列表页
          this.$router.replace('/export/logistics/sendGoods')
        }).catch((err) => {
          this.saveBtnState = false
          console.log(err)
        })
      },
      /**
       * 获取物流公司列表
       * */
      getLogisticsCompany() {
        // 匹配文本
        let shipmenttype
        this.shipmentTypeList.map((v) => {
          if (v.value === this.formData.shipmentTypeFk) {
            shipmenttype = v.label
          }
        })
        this.$axios.get('api/import/logistics/baseinfo/logisticscompany', {
          params: {
            shipmenttype
          }
        }).then((res) => {
          if (Array.isArray(res.data)) {
            let handleArr = []
            res.data.map((val) => {
              handleArr.push({ value: val.id, label: val.name })
            })
            // 需要序列化
            this.logisticsCompanyList = handleArr
            // 匹配物流公司
            this.logisticsCompanyList.map((val) => {
              if (val.value === this.formData.basb001FkWl) {
                this.basb001FkWlLabel = val.label
              }
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 获取送达公司列表
       * */
      getSendCompany() {
        // 匹配文本
        let shipmentType
        this.shipmentTypeList.map((v) => {
          if (v.value === this.formData.shipmentTypeFk) {
            shipmentType = v.label
          }
        })
        this.$axios.get('/api/import/logistics/baseinfo/sendorderlinkman', {
          params: {
            shipmentType,
            company: ''
          }
        }).then((res) => {
          if (Array.isArray(res.data)) {
            let handleArr = []
            res.data.map((val) => {
              handleArr.push({ value: val.id, label: val.sendCompany })
            })
            // 需要序列化
            this.sendCompanyList = handleArr
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
          this.currencyOptions = res.currencyLst
        }).catch((error) => {
          console.log(error)
        })
      },
      selfLifting(val) {
        this.sendCompany(val)
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
      /**
       * 导出弹框内的列表数据
       * */
      exportTableDataHandle() {
        // 校验重复项
        let filterList = _.differenceBy(this.chooseOrderSelectArr, this.formData.goods, 'goodsId')
        // 导出操作
        filterList.map((v) => {
          this.formData.goods.push(v)
        })
      },
      /**
       * 获取弹框内选中的订单明细数组
       * */
      chooseOrderSelect(arr) {
        this.chooseOrderSelectArr = arr
      },
      /**
       * 商品明细列表删除操作
       * */
      deleteItem(rowData, index) {
        // 判断行ID是否存在,存在则发送删除请求
        if (rowData.id) {
          this.$axios.post('/api/export/logistics/sendgoodsdetails/delete', { id: rowData.id }).catch((err) => {
            console.log(err)
          })
        }
        this.$delete(this.formData.goods, index)
      },
      /**
       * 分页组件当前页改变事件
       * */
      pageCountChange(currentSize) {
        this.searchOptions.pageSize = currentSize
        this.chooseOrder()
      },
      /**
       * 获取弹框内的订单列表数据
       * */
      chooseOrder() {
        this.tabLoading = true
        let jsonData = JSON.parse(JSON.stringify(this.searchOptions))
        jsonData.pageSize -= 1
        this.$axios.post('/api/export/logistics/sendgoods/maylist', jsonData).then((res) => {
          // 获取列表数据
          this.orderDetailData = res.data.list
          // 总数赋值
          this.orderDetailTotal = res.data.total
          this.tabLoading = false
        }).catch((error) => {
          this.tabLoading = false
          console.log(error)
        })
      },
      /**
       * 展示dialog弹框
       * */
      showDialog() {
        this.showOrderDetail = true
        this.chooseOrder()
      },
      /**
       * 删除文件
       * */
      handleRemove({ response }) { // 删除对应显示文件
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
          this.formData.fileList = this.formData.fileList.filter((v) => {
            return v.fileId !== id
          })
        }
      },
      /**
       * 预览下载
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
      },
      /**
       * 文件上传后
       * */
      handleChange(file) {
        if (file.response) {
          this.formData.file.push({
            fileName: file.raw.name,
            fileType: file.raw.name.split('.')[1],
            fileId: file.response.fileId
          })
        }
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
      .title-wrapper{
        text-align: right;
        margin-bottom: 20px;
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
  /*附件上传标题*/
  .uploadTitle{
    margin: 40px 0 15px 0;
    font-size: 18px;
    color: #1F9BD6;
    font-weight: 600;
  }
  /*分页容器*/
  .orderDetail-pagination{
    margin-top: 20px;
    text-align: right;
  }
</style>
<style lang="scss">
  .upload-content{
    .el-upload-list{
      width: 400px;
    }
  }
  .choose .el-dialog__header{
    border-bottom: 1px solid #e0e0e0;
  }
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
  .star{
    .el-form-item__label{
      &:before{
        display: inline-block;
        margin-right: 2px;
        content: '*';
        font-size: 14px;
        color: red;
      }
    }
  }
</style>
