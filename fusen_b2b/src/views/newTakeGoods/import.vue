<template>
  <div class="content">
    <baseLayout v-loading="loadState">
      <div slot="msg1">
        <div class="title">基本信息</div>
        <el-form :model="formData"
                 ref="formMain"
                 label-position="right"
                 label-width="110px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="提货公司：" prop="deliverycompany">
                <el-select v-model="formData.deliverycompany"
                           v-if="editStatus"
                           filterable
                           @change="companyChange"
                           placeholder="请选择提货公司">
                  <el-option
                    v-for="item in companyArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <div v-else>{{formData.deliverycompany}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人：" prop="attn">
                  <el-input v-model="formData.attn"
                            v-if="editStatus"
                            placeholder="请输入姓名"></el-input>
                  <div v-else>{{formData.attn}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="tel">
                  <el-input v-model="formData.tel"
                            v-if="editStatus"
                            placeholder="请输入联系电话"></el-input>
                <div v-else>{{formData.tel}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址：" prop="address">
                <el-input v-model="formData.address"
                          v-if="editStatus"
                          placeholder="请输入地址"></el-input>
                <div v-else>{{formData.address}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="(editStatus || formData.sumboard)">
              <el-form-item label="板数：" prop="sumboard">
                <el-input v-model="formData.sumboard"
                          v-if="editStatus"
                          class="inputNum"
                          :readonly="boardDisabled"
                          @focus="board"
                          @blur="blurNum"
                          placeholder="请输入板数"></el-input>
                <div v-else>{{formData.sumboard}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="(editStatus || formData.sumcartons)">
              <el-form-item label="箱数：" prop="sumcartons">
                <el-input v-model="formData.sumcartons"
                          v-if="editStatus"
                          class="inputNum"
                          :readonly="boxDisabled"
                          @focus="box"
                          @blur="blurNum"
                          placeholder="请输入箱数"></el-input>
                <div v-else>{{formData.sumcartons}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计提货时间：">
                <el-date-picker
                  v-if="editStatus"
                  class="datePick"
                  v-model="formData.yjthtime"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions1">
                </el-date-picker>
                <el-select v-model="formData.ytime"
                           class="datePick"
                           v-if="editStatus"
                           placeholder="选择时">
                  <el-option
                    v-for="item in options"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
                <div v-else>
                  {{formData.yjthtime}} {{formData.ytime}}
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="msg2">
        <div class="title">
          提货明细
          <el-button v-if="editStatus"
                     style="float: right;"
                     type="primary"
                     @click="chooseOrder"
                     size="small">选择订单</el-button>
        </div>
        <el-table align="center"
                  :data="tableData"
                  show-summary
                  :summary-method="getSummaries">
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="fsno" label="富森订单号" align="center"></el-table-column>
          <el-table-column prop="partname" label="品号" align="center"></el-table-column>
          <el-table-column prop="spec" label="型号" align="center"></el-table-column>
          <el-table-column prop="quantity" label="订单数量" align="center"></el-table-column>
          <el-table-column prop="qty" label="提货数量" align="center">
            <template slot-scope="prop">
              <el-input size="mini"
                        v-if="editStatus"
                        type="number"
                        v-model.number="prop.row.qty"
                        @input="payInputHandle($event, prop.row)"
                        placeholder="请输入提货数量"></el-input>
              <div v-else>
                {{prop.row.qty}}
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
                     @click="saveHandle('保存')">暂存</el-button>
          <el-button type="success"
                     :loading="btnLoading"
                     @click="saveHandle('提交')">提交</el-button>
        </div>
      </div>
    </baseLayout>
    <!--选择订单dialog-->
    <el-dialog title="选择订单"
               :visible.sync="showOrderDetail"
               top="20px"
               width="1200px">
      <div class="top-msg">
        <div class="text">已选中<span class="oColor"> {{selectTabData.length}} </span>个订单</div>
        <div class="search-container">
          <el-input v-model="searchKeyword"
                    class="search-input"
                    ref="enterInputA"
                    placeholder="请输入订单号">
          </el-input>
          <div class="searchIcon"
               @click="chooseOrder">
            <i class="search el-icon-search"></i>
          </div>
        </div>
      </div>
      <el-table align="center"
                @selection-change="chooseOrderSelect"
                :data="orderDtailData"
                height="400px"
                width="100%">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column property="fsno" label="富森号" align="center"></el-table-column>
        <el-table-column property="partname" label="品名" align="center"></el-table-column>
        <el-table-column property="spec" label="型号" align="center"></el-table-column>
        <el-table-column property="quantity" label="订单数量" align="center"></el-table-column>
        <el-table-column property="qty" label="提货数量" align="center"></el-table-column>
        <el-table-column property="sys_created" label="订单日期" align="center"></el-table-column>
        <el-table-column property="unit" label="单位" align="center"></el-table-column>
        <el-table-column property="originalpacnum" label="箱数" align="center"></el-table-column>
        <el-table-column property="grossweight" label="毛重" align="center"></el-table-column>
      </el-table>
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
  import tabTmp from '@/components/tabTemplate'
  import Cookies from 'js-cookie'
  import req from '@/utils/req'
  import api from '@/utils/apiUtil'
  export default {
    data() {
      return {
        btnLoading: false,
        loadState: false,
        editStatus: true,
        boardDisabled: false,
        boxDisabled: false,
        showOrderDetail: false,
        orderDtailData: [
          // {
          //   orda001oid: '',
          //   orda001d1oid: '',
          //   fsno: '',
          //   partname: '',
          //   spec: '',
          //   quantity: '',
          //   usableqty: '',
          //   sys_created: '',
          //   unit: '',
          //   originalpacnum: '',
          //   grossweight: ''
          // }
        ],
        companyArr: [],
        attachFile: [],
        formData: {
          deliverycompany: '', // 自提公司
          attn: '', // 姓名
          tel: '', // 电话
          address: '', // 地址
          sumboard: '', // 数量板
          status: '',
          sumcartons: '', // 数量箱
          yjthtime: '', // 预计提货日期
          hours: '', // 预计题或时间
          remark: '', // 备注
          ytime: '',
          attachid: '', // 附件id
          docno: '' // 单据编码对应thno
        },
        tableData: [],
        searchKeyword: '',
        options: [{
          value: '选项1',
          label: '9时'
        },
        {
          value: '选项2',
          label: '10时'
        },
        {
          value: '选项3',
          label: '11时'
        },
        {
          value: '选项4',
          label: '12时'
        },
        {
          value: '选项5',
          label: '13时'
        },
        {
          value: '选项6',
          label: '14时'
        },
        {
          value: '选项7',
          label: '15时'
        },
        {
          value: '选项8',
          label: '16时'
        },
        {
          value: '选项9',
          label: '17时'
        },
        {
          value: '选项10',
          label: '18时'
        },
        {
          value: '选项11',
          label: '19时'
        },
        {
          value: '选项12',
          label: '20时'
        }],
        pickerOptions1: { disabledDate(time) { return time.getTime() < Date.now() - 8.64e7 } },
        selectTabData: []
      }
    },
    created() {
      this.getCompany()
    },
    mounted() {
      if (this.$route.query.id) {
        this.getDetail()
      }
    },
    methods: {
      /**
       * 列表合计
       * */
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (index === 5) {
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
      /**
       * 提货数量限制
       * */
      payInputHandle(val, row) {
        let target = parseFloat(val)
        let maxValue = parseFloat(row.quantity)
        if (target > maxValue) {
          row.qty = maxValue
        }
      },
      /**
       * 获取详情
       * */
      getDetail() {
        let sessionId = Cookies.get('sessionid')
        let thno = this.$route.query.thno
        let id = this.$route.query.id
        req.post('api/import/logistics/queryTiHuoDanDetail', {
          'sessionId': sessionId,
          'thno': thno,
          'shpc002oid': id
        }).then((res) => {
          let baseUrl = window.g.baseUrl
          res.data.attachfile.forEach((file) => {
            this.attachFile.push({
              fileType: file.filetype,
              fileName: file.filename,
              fileId: file.docdataoid,
              ftypename: '',
              docdataoid: file.docdataoid,
              url: `${baseUrl}file/download/${file.fileId}`
            })
          })
          if (res.data.detail.length) {
            this.formData = res.data.detail[0]
          }
          if (this.formData.status === '0') {
            this.editStatus = true
          } else {
            this.editStatus = false
          }
          res.data.detail.forEach((item) => {
            // 板数
            if (res.data.detail[0].sumboard === 0) {
              this.boardDisabled = true
            }
            // 箱数
            if (res.data.detail[0].sumcartons === 0) {
              this.boxDisabled = true
            }
            this.tableData.push({
              'fsno': item.fsno,
              'partname': item.partname,
              'spec': item.spec,
              'quantity': item.quantity,
              'qty': item.qty,
              'shpc002d1oid': item.shpc002d1oid, // id
              'orda001d1oid': item.orda001d1oid // 订单明细id
            })
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 获取公司信息
       * */
      getCompany() {
        req.get('/api/import/logistics/querypickupgoodscompany').then((res) => {
          res.data.forEach((val, i) => {
            this.companyArr.push({
              label: val.deliverycompany,
              value: i,
              linkman: val.linkman,
              phone: val.phone,
              deliveryaddress: val.deliveryaddress
            })
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      sureBtn() {
        this.tableData = this.tableData.concat(this.selectTabData)
        this.showOrderDetail = false
      },
      companyChange(v) {
        this.formData.deliverycompany = this.companyArr[v].label
        this.formData.attn = this.companyArr[v].linkman
        this.formData.tel = this.companyArr[v].phone
        this.formData.address = this.companyArr[v].deliveryaddress
      },
      deleteItem(index) {
        this.tableData.splice(index, 1)
      },
      chooseOrderSelect(val) {
        this.selectTabData = val
      },
      chooseOrder() {
        let sessionId = Cookies.get('sessionid')
        req.post('api/import/logistics/queryOrderDetails', {
          'sessionId': sessionId,
          'fsno': this.searchKeyword
        }).then((res) => {
          this.orderDtailData = res.data
          res.data.forEach((v) => {
            v.sys_created = api.getTime(v.sys_created)
          })
          this.showOrderDetail = true
          console.log(res)
        }).catch((error) => {
          console.log(error)
        })
      },
      board() {
        this.formData.sumcartons = ''
        this.boxDisabled = true
        this.boardDisabled = false
      },
      box() {
        this.formData.sumboard = ''
        this.boardDisabled = true
        this.boxDisabled = false
      },
      blurNum() {
        if (this.formData.sumboard !== '') {
          this.boxDisabled = true
        } else if (this.formData.sumcartons !== '') {
          this.boardDisabled = true
        } else {
          this.boardDisabled = false
          this.boxDisabled = false
        }
      },
      /**
       * 保存提交操作
       * */
      saveHandle(type) {
        this.btnLoading = true
        if (type === '保存') {
          this.formData.status = '0'
          this.save()
        } else if (type === '提交') {
          this.formData.status = '1'
          this.formData.docno = this.$route.query.thno
          this.save()
        }
      },
      save() {
        let mainData = this.formData
        let jsonStr = JSON.stringify(mainData)
        let dtail = JSON.stringify(this.tableData)
        let file = JSON.stringify(this.attachFile)
        req.post('api/import/logistics/generateTiHuoDan', {
          'sessionId': Cookies.get('sessionid'),
          'mainData': jsonStr,
          'detailData': dtail,
          'attachFile': file
        }).then((res) => {
          if (res.result === 'success') {
            this.$notify({
              title: '成功',
              type: 'success',
              message: res.result
            })
            // 数据重置
            Object.assign(this.formData, this.$options.data().formData)
            this.$store.dispatch('delVisitedViews', { fullPath: this.$route.fullPath })
            // 关闭当前标签页
            this.$router.replace('/import/takeGoods/takeGoodsSearch')
          } else {
            this.$notify.error({
              title: '错误',
              message: res.result
            })
          }
          this.btnLoading = false
        }).catch((error) => {
          this.btnLoading = false
          console.log(error)
        })
      },
      /**
       * 文件上传成功
       * */
      fileUploadSuccess(fileItem) {
        this.attachFile.push({
          fileName: fileItem.name,
          fileType: fileItem.raw.type,
          fTypeName: '',
          fileId: fileItem.response.fileId
        })
      }
    },
    components: {
      baseLayout,
      mUpload,
      tabTmp
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
    .datePick{
      width: 150px;
      &.el-select{
        .el-input{
          width: 123px;
        }
      }
    }
  }
</style>
