<template>
  <div class="container-wrapper" v-loading="loadState">
    <flowSteps :titleArr="titleArr"
               :propsActiveIndex="activeIndex"
               :hideContrl="editState"
               class="flow"
               @nextStepHandle="nextStepHandle"
               @saveHandle="saveHandle">
      <div slot="step1" class="step1-content">
        <!--单据编码-->
        <div class="documentText" v-show="formData.documentNumber">
          单据编号：{{formData.documentNumber}}
        </div>
        <!--表单部分-->
        <el-form :label-width="'120px'"
                 ref="baseDataForm"
                 :model="formData"
                 size="small"
                 :rules="formRules"
                 class="form-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="提货公司：" prop="basb001d6oid" class="formItem">
                <el-select v-model="formData.basb001d6oid"
                           v-if="editState"
                           filterable
                           class="inputBox"
                           placeholder="请选择提货公司">
                  <el-option v-for="item in pickGoodsCompanyList"
                             :key="item.id"
                             :label="item.pickGoodsCompany"
                             :value="item.id"></el-option>
                </el-select>
                <div v-else>
                  {{formData.pickGoodsCompany}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人：" required class="formItem">
                <div style="width: 360px;">
                  <el-form-item label-width="0" style="display: inline-block;" prop="contactsName">
                    <el-input v-model="formData.contactsName"
                              v-if="editState"
                              class="inputName"
                              placeholder="姓名"></el-input>
                    <span v-else>
                      {{formData.contactsName}}
                    </span>
                  </el-form-item>
                  <el-form-item label-width="0" style="display: inline-block;" prop="contactsPhone">
                    <el-input v-model="formData.contactsPhone"
                              v-if="editState"
                              class="inputTel"
                              placeholder="联系电话"></el-input>
                    <span v-else>{{formData.contactsPhone}}</span>
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="提货地址：" prop="pickGoodsAddress" class="formItem">
                <el-input v-model="formData.pickGoodsAddress"
                          v-if="editState"
                          class="inputBox"
                          placeholder=""></el-input>
                <div v-else>{{formData.pickGoodsAddress}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量：" required class="formItem">
                <div class="inputBox">
                  <el-form-item label-width="0" style="display: inline-block" prop="sumBoard">
                    <el-input v-model.number="formData.sumBoard"
                              v-if="editState"
                              type="number"
                              class="inputNum"
                              placeholder="请输入板数"></el-input>
                    <span v-else>{{formData.sumBoard}}</span>板
                  </el-form-item>
                  <el-form-item label-width="0" style="display: inline-block" prop="sumCartons">
                    <el-input v-model.number="formData.sumCartons"
                              v-if="editState"
                              type="number"
                              class="inputNum"
                              placeholder="请输入箱数"></el-input>
                    <span v-else>{{formData.sumCartons}}</span>箱
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计提货时间：" required class="formItem">
                <div style="width: 360px;" v-if="editState">
                  <el-form-item label-width="0" prop="predictPickGoodsDate" style="display: inline-block">
                    <el-date-picker
                      v-model="formData.predictPickGoodsDate"
                      type="date"
                      class="inputTel"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label-width="0" prop="predictPickGoodsTime" style="display: inline-block">
                    <el-select v-model="formData.predictPickGoodsTime"
                               placeholder="选择时"
                               class="inputName">
                      <el-option
                        v-for="item in timeOptions"
                        :key="item.label"
                        :label="item.value"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div v-else>{{formData.predictPickGoodsDate + ' ' + formData.predictPickGoodsTime}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注：" class="formItem">
                <el-input v-model="formData.remarks"
                          v-if="editState"
                          type="textarea"
                          autosize
                          class="inputBox"
                          placeholder="请输入备注"></el-input>
                <pre v-else>{{formData.remarks}}</pre>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="step2">
        <el-col class="tableView-wrapper">
          <div class="title-wrapper" v-if="editState">
            <span class="handleButton">
              <el-button type="primary"
                         size="small"
                         @click="openSelectPanel">选择订单</el-button>
            </span>
          </div>
          <div class="tab-content">
            <el-table :data="formData.pickGoodsDetailList"
                      class="table-main"
                      v-if="editState"
                      border>
              <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
              <el-table-column prop="orderNumber" label="订单号" align="center">
                <template slot-scope="prop">
                  {{prop.row.orderNumber}}
                </template>
              </el-table-column>
              <el-table-column prop="typeNumber" label="型号" align="center">
                <template slot-scope="prop">
                  {{prop.row.typeNumber}}
                </template>
              </el-table-column>
              <el-table-column prop="orderAmount" label="订单数量" align="center">
                <template slot-scope="prop">
                  {{prop.row.orderAmount}}
                </template>
              </el-table-column>
              <el-table-column prop="mayPickGoodsAmount" label="可提货数量" align="center">
                <template slot-scope="prop">
                  {{prop.row.mayPickGoodsAmount}}
                </template>
              </el-table-column>
              <el-table-column prop="pickGoodsAmount" label="提货数量" align="center">
                <template slot-scope="prop">
                  <el-input v-model.number="prop.row.pickGoodsAmount"
                            type="number"
                            @input="pickGoodsNumberHandle($event ,prop.row)"
                            placeholder="请输入提货数量"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="sumCartons" label="箱数" align="center">
                <template slot-scope="prop">
                  {{prop.row.sumCartons}}
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" style="color: #85ce61" @click="deleteItem(formData.pickGoodsDetailList, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <tabTmp v-else
                    :tabData="formData.pickGoodsDetailList"
                    class="takeGoodsDetail"
                    :tabHeight="'200px'"
                    @deleteItem="deleteItem"
                    :tabTagData="orderDetailTabTagData"></tabTmp>
          </div>
        </el-col>
      </div>
      <div slot="step3">
        <el-upload
          class="upload-content"
          :action="`${ baseUrl }/file/upload`"
          accept=".xls,.xlsx,.txt,.doc,.docx,.pdf"
          :data="parameter"
          :on-change="handleChange"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList">
          <el-button v-if="editState" size="small" type="primary">点击上传</el-button>
          <div v-if="editState" slot="tip" class="el-upload__tip">支持上传文件:表格(*.xls;*.xlsx) 文档(*.txt,*.doc,*.docx,*.pdf)</div>
          <div v-else slot="tip" style="font-size: 16px;font-weight: bold;color: #1F9BD6;">附件列表:</div>
        </el-upload>
      </div>
    </flowSteps>
    <el-dialog title="选择订单"
               :visible.sync="showOrderDetail"
               width="1000px"
               class="choose">
      <el-form inline size="medium" class="formFlexBox">
        <el-form-item>
          <div class="tmpContent">
            <el-input
              class="inline-input"
              v-model="searchOptions.gatherSelcondition"
              @keydown.native.13="searchHandle"
              placeholder="请输入订单号/品名">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item class="search-button">
          <el-button type="primary"
                     @click="searchHandle">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table align="center"
                @selection-change="chooseOrderSelect"
                :data="orderDetailData"
                :border="true" style="width: 100%;">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="orderNumber" label="订单号" align="center"></el-table-column>
        <el-table-column property="productName" label="品名" align="center"></el-table-column>
        <el-table-column property="typeNumber" label="型号" align="center"></el-table-column>
        <el-table-column property="orderAmount" label="订单数量" align="center"></el-table-column>
        <el-table-column property="mayPickGoodsAmount" label="可提货数量" align="center"></el-table-column>
        <el-table-column property="orderDate" label="订单日期" align="center"></el-table-column>
        <el-table-column property="unit" label="单位" align="center"></el-table-column>
        <el-table-column property="roughWeight" label="毛重" align="center"></el-table-column>
      </el-table>
      <div class="orderDetail-pagination">
        <el-pagination
          :page-size="searchOptions.pageCount"
          layout="prev, pager, next"
          :current-page.sync="searchOptions.pageSize"
          @current-change="pageCountChange"
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
  import _ from 'lodash'
  export default {
    data() {
      const timeOptions = []
      for (let i = 9; i <= 20; i++) {
        timeOptions.push({
          value: i + '时',
          label: i
        })
      }
      return {
        formRules: { // 表单规则
          predictPickGoodsDate: [
            { required: true, message: '请选择预计日期', trigger: 'blur' }
          ],
          predictPickGoodsTime: [
            { required: true, message: '请选择预计时间', trigger: 'blur' }
          ],
          basb001d6oid: [
            { required: true, message: '请选择提货公司', trigger: 'blur' }
          ],
          contactsName: [
            { required: true, message: '请输入联系人名称', trigger: 'blur' }
          ],
          contactsPhone: [
            { required: true, message: '请输入联系人电话', trigger: 'blur' }
          ],
          pickGoodsAddress: [
            { required: true, message: '请输入提货地址', trigger: 'blur' }
          ]
        },
        showOrderDetail: false, // 展示订单明细弹框
        searchOptions: { // 订单明细列表搜索参数
          pageSize: 1,
          pageCount: 10,
          gatherSelcondition: ''
        },
        orderDetailTotal: 0, // 订单明细列表总条数
        orderDetailData: [ // 订单明细列表数据
          // {
          //   id: '',
          //   orderNumber: '', // 订单号
          //   typeNumber: '', // 型号
          //   orderAmount: '', // 订单数
          //   mayPickGoodsAmount: '', // 可提货数量
          //   orderDate: '', // 订单时间
          //   unit: '', // 单位
          //   roughWeight: '' // 毛重
          // }
        ],
        selectedPickGoodsList: [], // 弹框内选中的列表项
        pickGoodsCompanyList: [], // 提货公司列表
        formData: { // 页面表单数据
          status: '', // 保存状态
          orderNumber: '', // 提货单列表显示的订单号
          id: '', // 订单ID
          documentNumber: '', // 单据编码
          pickGoodsCompany: '', // 提货公司
          basb001d6oid: '', // 提货公司外键
          contactsName: '', // 联系人姓名
          contactsPhone: '', // 联系人电话
          pickGoodsAddress: '', // 提货地址
          sumBoard: '', // 板数
          sumCartons: '', // 箱数
          predictPickGoodsDate: '', // 预计提货时间
          predictPickGoodsTime: '', // 预计提货时间
          remarks: '', // 备注
          fileList: [], // 文件列表
          pickGoodsDetailList: [ // 提货明细列表
            // {
            //   id: '', // 单项ID
            //   orderNumber: '', // 订单号
            //   productName: '', // 品名
            //   typeNumber: '', // 型号
            //   orderAmount: '', // 订单数量
            //   mayPickGoodsAmount: '', // 可提货数量
            //   pickGoodsAmount: '' // 提货数量
            //   sumCartons: '' // 箱数
            // }
          ]
        },
        orderDetailTabTagData: [ // 订单明细列表表头
          {
            label: '富森订单号',
            prop: 'orderNumber',
            width: ''
          },
          {
            label: '品名',
            prop: 'productName',
            width: ''
          },
          {
            label: '型号',
            prop: 'typeNumber',
            width: ''
          },
          {
            label: '订单数量',
            prop: 'orderAmount',
            width: ''
          },
          {
            label: '提货数量',
            prop: 'pickGoodsAmount',
            width: ''
          }
        ],
        activeIndex: 1, // 当前步骤条激活项
        titleArr: [ // 步骤条标题数组
          '填写提货基本信息',
          '提交提货明细',
          '提交附件信息'
        ],
        timeOptions, // 小时时间下拉框数据
        fileList: [], // 当前预览列表
        baseUrl: window.g.baseUrl, // 请求基础地址
        parameter: { // 文件上传配置ID
          orderId: '0006C275-0000-0000-0000-00000E97FDBC',
          customId: '736CA29F-0B32-409C-9159-64F1C3EDD949'
        },
        editState: true, // 订单可编辑状态
        loadState: false // 加载动画
      }
    },
    computed: {
      exportTableDataButton_state() { // 判断订单明细弹框页面导入按钮是否可用
        return !(this.selectedPickGoodsList.length > 0)
      }
    },
    created() {
      // 拉取提货公司列表信息
      this.getPickGoodsCompany()
    },
    mounted() {
      // 判断ID是否存在,存在则拉取信息
      if (this.$route.query.id) {
        this.getOrderDetail()
      }
    },
    methods: {
      /**
       * 提货数量限制
       * */
      pickGoodsNumberHandle(val, row) {
        if (parseFloat(val) > parseFloat(row.mayPickGoodsAmount)) {
          row.pickGoodsAmount = row.mayPickGoodsAmount
        }
      },
      /**
       * 获取页面信息
       * */
      getOrderDetail() {
        this.loadState = true
        // 拉取页面信息赋值给formData
        const id = this.$route.query.id
        const pickingtype = this.$route.query.pickingType
        this.$axios.get('api/export/logistics/pickingorder/object', {
          params: {
            id,
            pickingtype
          }
        }).then((res) => {
          // 注意需要Key值替换,不能直接覆盖,否则可能引起table列表引用问题
          for (let key in res.data) {
            this.formData[key] = res.data[key]
          }
          // 匹配显示时间
          let date = this.formData.predictPickGoodsTime
          date = date.split(' ')
          this.formData.predictPickGoodsDate = date[0]
          this.formData.predictPickGoodsTime = date[1]
          // 序列化文件列表
          this.parseFileList()
          // 判断可编辑状态
          if (this.formData.status !== '' && this.formData.status !== '0') {
            this.editState = false
          }
          // 打开步进器
          this.activeIndex = 3
          // 结束加载动画
          this.loadState = false
        }).catch((err) => {
          this.loadState = false
          console.log(err)
        })
      },
      /**
       * 获取提货公司列表
       * */
      getPickGoodsCompany() {
        this.$axios.post('/api/export/logistics/pickingcompany/list').then((res) => {
          this.pickGoodsCompanyList = res.data
        }).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 导入订单明细操作
       * */
      exportTableDataHandle() {
        // 校验重复项
        let filterList = _.differenceBy(this.selectedPickGoodsList, this.formData.pickGoodsDetailList, 'orderDetailId')
        // 导出操作
        filterList.map((v) => {
          v.pickGoodsAmount = ''
          this.formData.pickGoodsDetailList.push(v)
        })
      },
      /**
       * 删除数组内对应项
       * */
      deleteItem(list, index) {
        // 判断当前订单是否为保存后的订单
        if (list[index].id) {
          const id = list[index].orderDetailId
          // 当订单为保存状态时,有一个当前订单的状态
          const type = this.formData.pickingType
          this.$axios.post('/api/export/logistics/pickingorderdetails/delete', {
            id,
            type
          }).catch((err) => {
            console.log(err)
          })
        }
        this.$delete(list, index)
      },
      /**
       * 获取列表选中项
       * */
      chooseOrderSelect(currentList) {
        this.selectedPickGoodsList = currentList
      },
      /**
       * 打开订单列表弹出框
       * */
      openSelectPanel() {
        // 打开弹框
        this.showOrderDetail = true
        // 拉取数据
        this.getChooseOrderList()
      },
      /**
       * 获取订单明细列表
       * */
      getChooseOrderList() {
        let searchOptions = _.clone(this.searchOptions)
        searchOptions.pageSize -= 1
        this.$axios.post('/api/export/logistics/maypickingorder/list', searchOptions).then((res) => {
          // 列表数据赋值
          this.orderDetailData = res.data.list
          // 列表总条数
          this.orderDetailTotal = res.data.total
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 订单明细列表内搜索
       * */
      searchHandle() {
        this.getChooseOrderList()
      },
      /**
       * 订单明细列表,当前页变化
       * */
      pageCountChange(currentCount) {
        this.searchOptions.pageSize = currentCount
        this.getChooseOrderList()
      },
      /**
       * 下一步处理
       * */
      nextStepHandle(currentStepNumber) {
        if (currentStepNumber === 1) {
          const _this = this
          // 第一步校验表单输入必填项
          this.$refs.baseDataForm.validate((v) => {
            if (v) {
              if (this.formData.sumBoard || this.formData.sumCartons) {
                _this.activeIndex += 1
              } else {
                _this.$message({
                  type: 'warning',
                  message: '请输入箱数或板数'
                })
              }
            }
          })
        } else {
          this.activeIndex += 1
        }
      },
      /**
       * 获取订单ID
       * */
      async getOrderId() {
        const result = await req.get('api/import/order/orderinfo/getid').catch((err) => {
          console.log(err)
        })
        return result
      },
      /**
       * 保存/提交操作
       * */
      async saveHandle(type) {
        // 判断是否为新增单,为新增单,则获取订单ID
        const formData = _.cloneDeep(this.formData)
        if (formData.id === '') {
          let result = await this.getOrderId()
          formData.id = result.orderId
        }
        // 判断保存类型
        if (type === '保存') {
          formData.status = '0'
        } else if (type === '提交') {
          formData.status = '1'
          // 表单校验
          let checkoutResult = false
          this.$refs.baseDataForm.validate((resultBoolean) => {
            checkoutResult = !resultBoolean
          })
          if (checkoutResult) { return }
        }
        // 序列化orderNumber字段
        let orderNumberArr = _.cloneDeep(formData.pickGoodsDetailList)
        orderNumberArr = _.uniqBy(orderNumberArr, 'orderNumber')
        let handleArr = []
        orderNumberArr.map((val) => {
          handleArr.push(val.orderNumber)
        })
        formData.orderNumber = handleArr.join(',')
        // 时间序列化
        formData.predictPickGoodsTime = `${formData.predictPickGoodsDate} ${formData.predictPickGoodsTime}`
        delete formData.predictPickGoodsDate
        // 提货公司匹配
        this.pickGoodsCompanyList.map((val) => {
          if (val.id === formData.basb001d6oid) {
            formData.pickGoodsCompany = val.pickGoodsCompany
          }
        })
        // 发送保存数据请求
        this.$axios.post('/api/export/logistics/pickingorder/save', formData).then((res) => {
          this.$notify({
            title: '成功',
            type: 'success',
            message: res.msg
          })
          // 清除当前表单数据,及提示
          Object.assign(this.$data.formData, this.$options.data().formData)
          // 清除提示
          this.$refs.baseDataForm.resetFields()
          // 关闭当前页签
          this.$store.dispatch('delVisitedViews', { fullPath: this.$route.fullPath })
          // 页面充定向提货单查询列表页面
          this.$router.replace('/export/logistics/takeGoods')
        }).catch((err) => {
          this.$message({
            type: 'warning',
            message: '操作失败,请重试!'
          })
          console.log(err)
        })
      },
      /**
       * 序列化fileList
       * */
      parseFileList() {
        let baseUrl = this.baseUrl
        if (Array.isArray(this.formData.fileList)) {
          this.formData.fileList.map((file) => {
            this.fileList.push({
              id: file.id,
              name: file.fileName,
              url: `${baseUrl}file/download/${file.fileId}`
            })
          })
        }
      },
      /**
       * 删除对应显示文件
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
          this.formData.fileList = this.formData.fileList.filter((v) => {
            return v.fileId !== id
          })
        }
      },
      /**
       * 文件上传后
       * */
      handleChange(file) {
        if (file.response) {
          this.formData.fileList.push({
            fileName: file.raw.name,
            fileType: file.raw.name.split('.')[1],
            fileId: file.response.fileId
          })
        }
      },
      /**
       * 文件下载预览
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
    /*单据编码样式*/
    .step1-content{
      position: relative;
      .documentText{
        position: absolute;
        left: 845px;
        top: -65px;
        font-size: 15px;
      }
    }
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
        text-align: left;
      }
      .form-content {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 20px;
        .inputName{
          width: 120px;
        }
        .formItem {
          -webkit-box-flex: 0;
          -ms-flex: 0 0 40%;
          flex: 0 0 40%;
          .inputBox{
            width: 360px;
          }
          .inputNum{
            width: 100px;
            margin-right: 5px;
          }
          .inputTel{
            width: 235px;
          }
        }
        .Shipments{
          flex: 0 0 100%;
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
    /*分页容器*/
    .orderDetail-pagination{
      margin-top: 20px;
      text-align: right;
    }
  }
  .tableView-wrapper{
    .tab-content{
      padding: 20px 0;
    }
  }
</style>
<style lang="scss">
  .choose .el-dialog__header{
    border-bottom: 1px solid #e0e0e0;
  }
</style>
<style lang="scss">
  .upload-content{
    .el-upload-list{
      width: 400px;
    }
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
</style>
