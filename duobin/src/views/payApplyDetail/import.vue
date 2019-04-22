<template>
  <div class="content">
    <baseLayout v-loading="loadState">
      <div slot="msg1">
        <div class="title">基本信息</div>
        <el-form :model="formData"
                 :rules="formRules"
                 ref="formMain"
                 label-position="right"
                 label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="收款公司：" prop="u_033">
                <el-select v-model="formData.u_033"
                           v-if="editStatus"
                           @change="gatCompanyChange"
                           filterable
                           placeholder="请选择收款公司">
                  <el-option
                    v-for="(item, index) in CompanyData"
                    :key="index"
                    :label="item.vendorname"
                    :value="item.vendorname">
                  </el-option>
                </el-select>
                <div v-else>{{formData.u_033}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付方式："
                            prop="modeofpay">
                <el-select v-model="formData.modeofpay"
                           v-if="editStatus"
                           placeholder="请选择">
                  <el-option
                    v-for="(item,i) in payTypeOptions"
                    :key="i"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <div v-else>{{formData.modeofpay}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收款银行：">
                <el-input v-model="formData.bankname"
                          v-if="editStatus"
                          disabled
                          placeholder="收款银行名称"></el-input>
                <div v-else>{{formData.bankname}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收款账号：">
                <el-input v-model="formData.bankno"
                          v-if="editStatus"
                          disabled
                          placeholder="收款账号"></el-input>
                <div v-else>{{formData.bankno}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="金额：">
                <el-input v-model="formData.foreignmoney"
                          v-if="editStatus"
                          disabled
                          placeholder="金额"></el-input>
                <div v-else>{{formData.foreignmoney}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="币别：">
                <el-input v-model="formData.currencytype"
                          v-if="editStatus"
                          disabled
                          placeholder="币别类型">
                </el-input>
                <div v-else>{{formData.currencytype}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="formData.modeofpay === '2'">
              <el-form-item label="期票到期日："
                            prop="leeffectivedate">
                <el-input v-model.number="formData.leeffectivedate"
                          v-if="editStatus"
                          @input="changeValue1"
                          type="number"
                          class="inputBox"
                          placeholder="天数（天）"></el-input>
                <div v-else>{{formData.leeffectivedate}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="formData.modeofpay === '2'">
              <el-form-item label="期票天数">
                <el-date-picker
                  class="picker"
                  v-if="editStatus"
                  @input="changeValue2"
                  v-model="formData.zdqpdate"
                  type="date"
                  placeholder="期票天数"
                  :picker-options="pickerOptions1">
                </el-date-picker>
                <div v-else>{{formData.zdqpdate}}</div>
              </el-form-item>
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
                     @click="chooseOrder('选择订单')"
                     size="small">选择订单</el-button>
        </div>
        <el-table align="center"
                  :data="detailListData"
                  show-summary
                  :summary-method="getSummaries">
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="onumber" label="富森订单号" align="center"></el-table-column>
          <el-table-column prop="cvalue" label="可付款金额" align="center"></el-table-column>
          <el-table-column prop="cur" label="币别" align="center"></el-table-column>
          <el-table-column prop="amountrmb" label="本次付款金额" align="center">
            <template slot-scope="prop">
              <el-input size="mini"
                        v-if="editStatus"
                        type="number"
                        v-model.number="prop.row.amountrmb"
                        @input="payInputHandle($event, prop.row)"
                        placeholder="请输入付款金额"></el-input>
              <div v-else>
                {{prop.row.amountrmb}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           v-if="editStatus"
                           align="center">
            <template slot-scope="prop">
              <div delete @click="deleteItem(prop.$index)"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="msg3" v-if="editStatus || (attachFile && attachFile.length)">
        <div class="title">
          附件信息
        </div>
        <mUpload :file-list-data="attachFile || []"
                 :disabled="!editStatus"
                 @success="fileUploadSuccess"></mUpload>
      </div>
      <div slot="button" v-if="editStatus">
        <div style="text-align: right;">
          <el-button type="info"
                     :loading="btnLoading"
                     @click="submitHandle(0)">暂存</el-button>
          <el-button type="success"
                     :loading="btnLoading"
                     @click="submitHandle(1)">提交</el-button>
        </div>
      </div>
    </baseLayout>
    <!--选择订单dialog-->
    <el-dialog title="选择订单"
               :visible.sync="showOrderDetail"
               top="20px"
               width="1200px">
      <div class="top-msg">
        <div class="text">已选中<span class="oColor"> {{orderListData.length}} </span>个订单</div>
        <div class="search-container">
          <el-input v-model="searchOrderNumber"
                    @keydown.native.13="searchHandle"
                    class="search-input"
                    placeholder="请输入订单号">
          </el-input>
          <div class="searchIcon"
               @click="searchHandle">
            <i class="search el-icon-search"></i>
          </div>
        </div>
      </div>
      <el-table align="center"
                :data="dialogData"
                @selection-change="chooseOrderSelect"
                height="400px"
                width="100%"
                ref="selectInput">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="onumber" label="付款订单号" align="center"></el-table-column>
        <el-table-column property="cvalue" label="订单金额" align="center"></el-table-column>
        <el-table-column property="amountrmb" label="可付款金额(原币)" align="center" width="130"></el-table-column>
        <el-table-column property="docdate" label="订单日期" align="center"></el-table-column>
      </el-table>
      <div class="choose-page" v-show="pageTotal">
        <el-pagination background
                       @current-change="takeGoodsCurrentChange"
                       :page-size="pageSize"
                       :current-page.sync="currentPage"
                       layout="prev, pager, next"
                       :total="pageTotal"></el-pagination>
      </div>
      <div class="choose-button">
        <el-button size="small"
                   type="info"
                   @click="showOrderDetail = false">取 消</el-button>
        <el-button size="small"
                   type="warning"
                   @click="chooseBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import baseLayout from '@/components/detailsBaseLayout'
  import mUpload from '@/components/mUpload'
  import req from '@/utils/req'
  import api from '@/utils/apiUtil'
  import tabTmp from '@/components/tabTemplate'
  import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        loadState: false, // 全局加载状态
        btnLoading: false, // 提交按钮状态
        editStatus: true, // 可编辑状态
        currentPage: 1,
        pageTotal: 0,
        pageSize: 10,
        showOrderDetail: false, // 弹框
        orderListData: [], // 付款明细数据数组
        attachFile: [], // 文件列表
        CompanyTagData: [
          {
            label: '收款公司',
            prop: 'vendorname',
            width: ''
          },
          {
            label: '收款银行',
            prop: 'bankname',
            width: ''
          },
          {
            label: '收款账号',
            prop: 'bankno',
            width: ''
          }
        ],
        CompanyData: [], // 当前显示的弹框收款公司数据
        allCompanyData: [], // 所有收款公司的数据
        formRules: {
          modeofpay: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          u_033: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
        },
        parameter: {
          orderId: '0006C275-0000-0000-0000-00000E97FDBC',
          customId: '736CA29F-0B32-409C-9159-64F1C3EDD949'
        },
        payTypeOptions: [ // 支付方式数据
          {
            value: '1',
            label: '垫汇'
          },
          {
            value: '2',
            label: '期票'
          },
          {
            value: '3',
            label: '现票'
          }
        ],
        searchOrderNumber: '', // dialog搜索关键字
        dialogData: [],
        formData: {
          u_033: '', // 收款公司
          bankname: '', // 收款银行
          bankno: '', // 收款账号
          foreignmoney: 0, // 付款金额
          currencytype: '', // 币种
          modeofpay: '', // 付款方式
          zdqpdate: '', // 期限天
          leeffectivedate: '', // 自动计算
          summary: '', // 备注
          recstatus: '', // 状态
          caccountoid: '',
          rectype: 'FHD',
          file: []
        },
        companyArr: [],
        detailListData: [],
        pickerOptions1: { disabledDate(time) { return time.getTime() < Date.now() - 8.64e7 } },
        pageData: {
          'sessionId': Cookies.get('sessionid'),
          'pageSize': 10,
          'pageIndex': 1,
          'totalPage': '',
          'onumber': ''
        },
        detailJson: {
          'sessionId': Cookies.get('sessionid'),
          caccountoid: ''
        }
      }
    },
    components: {
      tabTmp,
      baseLayout,
      mUpload
    },
    activated() {
      this.detailJson.caccountoid = this.$route.query.caccountoid
      this.formData.caccountoid = this.$route.query.caccountoid
      this.selectShouKuanGS()
      this.detailDataFn()
    },
    methods: {
      /**
       * 选择公司对应信息
       * */
      gatCompanyChange(item) {
        this.formData.bankname = item.bankname
        this.formData.bankno = item.bankno
      },
      /**
       * 文件上传成功
       * */
      fileUploadSuccess(fileItem) {
        this.attachFile.push({
          filename: fileItem.name,
          filetype: fileItem.raw.type,
          ftypename: '',
          fileid: fileItem.response.fileId
        })
      },
      /**
       * 输入本次付款金额处理
       * */
      payInputHandle(val, row) {
        let target = parseFloat(val)
        let maxValue = parseFloat(row.cvalue)
        if (target > maxValue) {
          row.amountrmb = maxValue
        }
      },
      takeGoodsCurrentChange(val) {
        this.pageData.pageIndex = val - 1
        this.chooseOrder()
      },
      chooseBtn() {
        this.showOrderDetail = false
        this.detailListData = this.detailListData.concat(this.orderListData)
      },
      detailDataFn() {
        if (this.detailJson.caccountoid) {
          this.loadState = true
          req.post('import/finance/getCAccountDetail', this.detailJson).then((res) => {
            if (Array.isArray(res.data)) {
              this.formData = res.data[0]
              if (this.formData.recstatus === '0' || this.formData.recstatus === 'SQ') {
                this.editStatus = true
              } else {
                this.editStatus = false
              }
              this.formData.currencytype = res.data[0].cur
              res.data.forEach((item) => {
                this.detailListData.push({
                  'amountrmb': item.amountrmb,
                  'onumber': item.onumber,
                  'cvalue': item.cvalue,
                  'cur': item.cur,
                  'caccountsuboid': item.caccountsuboid
                })
              })
            }
            this.loadState = false
          }).catch((error) => {
            this.loadState = false
            console.log(error)
          })
        }
      },
      addPay() {
        let jsonStr = JSON.stringify(this.formData)
        let dtail = JSON.stringify(this.detailListData)
        let File = JSON.stringify(this.attachFile)
        req.post('import/finance/addCAccount', {
          'sessionId': Cookies.get('sessionid'),
          'mainData': jsonStr,
          'detailData': dtail,
          'attachFile': File
        }).then((res) => {
          if (res.result === 'success') {
            // 数据重置
            Object.assign(this.formData, this.$options.data().formData)
            this.$store.dispatch('delVisitedViews', { fullPath: this.$route.fullPath })
            this.$router.replace({ path: '/import/payApply/payApplySearch' })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      submitHandle(status) {
        if (status === 0) {
          this.formData.recstatus = '0'
          this.addPay()
        } else if (status === 1) {
          // 校验是否选择订单
          if (this.detailListData.length === 0) {
            this.$message({
              type: 'warning',
              message: '请选择订单后,再进行提交'
            })
            return false
          }
          // 校验表单必填项
          const _this = this
          this.$refs.formMain.validate((result) => {
            if (result) {
              _this.formData.recstatus = '1'
              _this.addPay()
            }
          })
        }
      },
      selectShouKuanGS() {
        req.post('import/finance/selectShouKuanGS', { sessionId: Cookies.get('sessionid') }).then((res) => {
          this.CompanyData = res.data
          this.allCompanyData = res.data
        }).catch((error) => {
          console.log(error)
        })
      },
      chooseOrderSelect(val) {
        this.orderListData = val
        this.formData.currencytype = val[0].cur
        val.forEach((row, index) => {
          let cruType = this.formData.currencytype
          if (cruType !== this.orderListData[index].cur && cruType !== '') {
            this.$refs.selectInput.toggleRowSelection(row, false)
            this.$message('请选择币别相同的单据')
          }
        })
      },
      searchHandle() {
        this.chooseOrder()
        this.pageData.pageIndex = 1
      },
      sureBtn() {
        this.formData.u_033 = this.companyArr[0].vendorname
        this.formData.bankname = this.companyArr[0].bankname
        this.formData.bankno = this.companyArr[0].bankno
      },
      chooseOrder() {
        this.showOrderDetail = true
        this.pageData.onumber = this.searchOrderNumber
        this.pageData.pageIndex = this.currentPage
        req.post('import/finance/getOrders', this.pageData).then((res) => {
          if (res.data && Array.isArray(res.data.content)) {
            this.dialogData = res.data.content
            this.dialogData.forEach((v) => {
              v.docdate = api.getDate(v.docdate)
            })
            this.pageTotal = Number(res.data.total)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /* 合计 */
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (index === 4) {
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
              sums[index] += ' '
            } else {
              sums[index] = ''
            }
          }
        })
        let num = sums[4]
        this.formData.foreignmoney = parseFloat(num) || ''
        return sums
      },
      deleteItem(index) {
        let caccountsuboid = this.detailListData[index].caccountsuboid
        req.post('/import/finance/delCAccountSub', {
          caccountsuboid: caccountsuboid
        }).then((res) => {
          this.detailListData.splice(index, 1)
          console.log(res)
        }).catch((error) => {
          console.log(error)
        })
      },
      changeValue1() {
        let d1 = new Date().getTime()
        let d2 = this.formData.leeffectivedate * 86400000
        let d3 = d1 + d2
        this.formData.zdqpdate = api.getDate(d3)
      },
      changeValue2() {
        let d1 = new Date().getTime()
        let d3 = new Date(this.formData.zdqpdate).getTime()
        let d2 = d3 - d1
        this.formData.leeffectivedate = Math.ceil(d2 / 86400000)
        if (d1 > d3) {
          this.formData.leeffectivedate = '0'
        }
      },
      deleteTableItem(res) {
        this.$confirm('确实要删除该条目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(res.$index, 1)
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .content{
    width: 100%;
    height: 100%;
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
    .picker.el-input{
      width: 276px;
    }
  }
</style>
