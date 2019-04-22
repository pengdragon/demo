<template>
  <!-- 提货申请新增 -->
  <div class="view-main">
    <layout :order="formData"
            :showStatus="true" @submitHandle='submitHandle' @uploadConfim='handleChange'
            :fileListProp="formData.fileList">
      <template slot="baseInfo">
        <el-row class="content-wrapper">
          <el-col class="sendGoods form-wrapper">
            <div class="title">填写提货基本信息</div>
            <el-form :label-width="'110px'"
                     :model="formData"
                     size="small"
                     class="form-content">


              <div class="logistics form-content" v-if="logistics">
                <el-form-item label="提货公司：" class="formItem">
                  <el-input v-model="formData.pickGoodsCompany"
                            class="inputBox"
                            suffix-icon="el-icon-search"
                            placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="联系人：" class="formItem">
                  <div style="width: 360px;">
                    <el-input v-model="formData.contactsName"
                              class="inputName"
                              placeholder="姓名"></el-input>
                    <el-input v-model="formData.contactsPhone"
                              class="inputTel"
                              placeholder="联系电话"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="提货地址：" class="formItem Shipments">


                  <el-input v-model="formData.pickGoodsAddress"
                            class="inputBox"
                            placeholder="请输入详细地址"></el-input>

                </el-form-item>

                <el-form-item label="可提货时间：" class="formItem">
                  <div style="width: 360px;">
                    <el-date-picker
                      v-model="formData.predictPickGoodsTime"
                      type="date"
                      class="inputTel"
                      placeholder="选择日期">
                    </el-date-picker>
                    <!-- <el-time-select
                      v-model="formData.time"
                      :picker-options="{
                          start: '08:30',
                          step: '00:15',
                          end: '18:30'
                        }"
                      class="inputName"
                      placeholder="选择时间">
                    </el-time-select> -->

                  </div>
                </el-form-item>
                <el-form-item label="数量：" class="formItem">
                  <div style="width: 360px;">
                    <el-input v-model="formData.sumBoard"
                              class="inputName2"
                              placeholder=""></el-input>
                    板
                    <el-input v-model="formData.sumCartons"
                              class="inputTel2"
                              placeholder=""></el-input>
                    箱
                  </div>
                </el-form-item>


              </div>
            </el-form>
          </el-col>

          <el-col class="tableView-wrapper">
            <div class="title-wrapper">
              <div class="title">提货明细</div>
              <span class="handleButton">
            <el-button type="primary" size="small" @click="chooseOrder('选择订单')">选择订单</el-button>
                <!-- <el-button type="primary" size="small" plain @change="addDetails" style="position: relative">导入
                 <input style="width: 100%;position: absolute;top:0;left: 0;right: 0;bottom: 0;opacity: 0;" type="file" @change="addDetails"></input>
              </el-button>
              <el-button type="primary" size="small" plain>新增</el-button> -->

          </span>
            </div>


            <el-table
              :data="formData.pickGoodsDetailList"
              border
              style="width: 100%" align="center">
              <el-table-column

                prop="orderNumber"
                label="富森订单号"
                width="150">
              </el-table-column>
              <el-table-column
                prop="productName"
                label="品名"
                width="160">
              </el-table-column>
              <el-table-column
                prop="typeNumber"
                label="型号"
                width="160">
              </el-table-column>
              <el-table-column
                prop="orderAmount"
                label="订单数量"
                width="120">
              </el-table-column>
              <el-table-column
                prop="pickGoodsAmount"
                label="提货数量"
                width="100">
              </el-table-column>
              <el-table-column
                prop="sumCartons"
                label="箱数"
                width="100">
              </el-table-column>
              <el-table-column
                prop="unit"
                label="单位"
                width="60">
              </el-table-column>
              <el-table-column
                prop="roughWeight"
                label="毛重"
                width="100">
              </el-table-column>
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row,scope.$index)" type="text" size="small">删除</el-button>

                </template>
              </el-table-column>
            </el-table>
          </el-col>

          <el-col class="upload-wrapper">
            <div class="title">附件上传</div>
            <!-- <el-upload
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
            </el-upload> -->
          </el-col>


          <!-- <el-col class="submit-wrapper">

            <el-col class="btnBox">

              <el-button type="primary" @click="submitHandle(0)">暂存</el-button>
              <el-button style="background: #42B983;color: #fff;" @click="submitHandle(1)">提交</el-button>
            </el-col>

          </el-col> -->
        </el-row>
        <el-dialog :title="chooseTitle" :visible.sync="showOrderDetail" class="chooseOrder">

          <tabTmp :tabData="dialogData"
                  :showSelection="true"
                  @getSelectResult="getSelectResult"
                  :showHandle="true"

                  :tabTagData="dialogTabTagData">
          </tabTmp>
          <el-button type="primary" @click="selectList()">确认</el-button>
        </el-dialog>
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
      // let _this = this
      return {
        selectArray: '',
        dialogTabTagData: [ // 弹框表格表头数据
          {
            label: '订单号',
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
            prop: 'orderDate',
            width: ''
          },
          {
            label: '箱数',
            prop: 'sumCartons',
            width: ''
          },
          {
            label: '单位',
            prop: 'unit',
            width: ''
          },
          {
            label: '毛重',
            prop: 'roughWeight',
            width: ''
          }
        ],
        dialogData: [],
        showOrderDetail: false, // 弹框
        chooseTitle: '', // 弹框标题
        options: [{
          value: '选项1',
          label: '北京'
        }, {
          value: '选项2',
          label: '上海'
        }, {
          value: '选项3',
          label: '天津'
        }, {
          value: '选项4',
          label: '深圳'
        }],
        sendGoods: false,
        selfLiftingGoods: false,
        logistics: true,
        orderListData: [ // 付款明细数据数组

        ],
        tabTagData: [ // 付款明细表头数据

        ],
        currencyOptions: [ // 币别选项数据

        ],
        formData: {
          sumCartons: 0,
          sumBoard: 0,
          customOrder: '', // 我的订单号
          currency: '', // 币别
          supplier: '', // 供应商
          operateType: '', // 操作类型
          outwarehouseType: '', // 进口或者本地
          fileList: [],
          pickGoodsDetailList: []
        },
        fileList: [],

        orderNumberOptions: []
      }
    },
    components: {
      tabTmp,
      layout
    },
    created() {
      // this.getCurrency()
      this.getOrder()
      let orderId = this.$route.query.id
      orderId && this.getOrderObj(orderId)
    },
    methods: {
      handleClick(row, index) {
        console.log(row.id)
        if (row.id) {
          let data = {
            'businessType': 'TH',
            'id': row.id
          }
          this.$axios.post('/api/purchase/order/deleteDetailRow', data).then((res) => {
            this.formData.pickGoodsDetailList.splice(index, 1)
          }).catch((error) => {
            console.log(error)
          })
        } else {
          this.formData.pickGoodsDetailList.splice(index, 1)
        }
      },
      // 确认选择列表
      selectList() {
        if (this.formData.pickGoodsDetailList) {
          this.formData.pickGoodsDetailList = this.selectArray
        } else {
          this.formData.pickGoodsDetailList = this.selectArray
        }
        this.showOrderDetail = false
      },
      // 获取弹框订单数据
      getOrder() {
        let data = {
          'pageSize': 0,
          'pageCount': 10
        }
        this.$axios.post('/api/purchase/order/selectPickOrders', data).then((res) => {
          this.dialogData = res.data.list
        }).catch((error) => {
          console.log(error)
        })
      },
      // 开启选择订单弹框
      chooseOrder(title) {
        this.showOrderDetail = true
        this.chooseTitle = title
      },
      // 文件上传后
      handleChange(file) {
        console.log(file)
        if (file.response) {
          let theFile = {
            fileName: file.name.split('.')[0],
            fileType: file.name.split('.')[1],

            fileId: file.response.fileId
          }
          console.log(theFile)
          console.log(this.formData)
          if (this.formData.fileList) {
            this.formData.fileList.push(theFile)
          } else {
            this.formData.fileList = []
            this.formData.fileList.push(theFile)
          }
        }
      },
      // 获取订单对象
      getOrderObj(orderId) {
        let data = {
          id: orderId
        }
        this.$axios.post('/api/purchase/order/queryPickApply', data).then((res) => {
          this.formData = res.data
        }).catch((error) => {
          console.log(error)
        })
      },
      // 获取币别列表
      getCurrency() {
        req.get('api/import/baseinfo/currency', {
          params: {

            businessCode: 1
          }
        }).then((res) => {
          this.currencyOptions = res.currencyLst
        }).catch((error) => {
          console.log(error)
        })
      },
      // 保存
      submitHandle(v) {
        console.log(v)
        if (v === '保存') {
          this.formData.operateType = 'ADD'

          console.log(this.formData)

          this.$axios.post('/api/purchase/order/addPickApply', this.formData)
            .then((response) => {
              this.$router.push({ path: '/substitute/pickoutIndex' })
            })
        } else {
          this.formData.operateType = 'SUBMIT'
          this.$axios.post('/api/purchase/order/addPickApply', this.formData)
            .then((response) => {
              this.$router.push({ path: '/substitute/pickoutIndex' })
            })
        }
      },
      selfLifting(val) {
        if (val === '自提') {
          this.selfLiftingGoods = true
          this.logistics = false
        } else {
          this.selfLiftingGoods = false
          this.logistics = true
        }
      },
      selecteChange(val) {
        if (val === true) {
          this.sendGoods = true
        } else {
          this.sendGoods = false
        }
      },
      getSelectResult(val) {
        this.selectArray = val
      },
      handleRemove(file) { // 删除对应显示文件
        this.fileList = this.fileList.filter((item) => {
          return item.name !== file.name
        })
      },
      handleCurrentChange(val) {
        this.currentRow = val
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
      saveHandle() {
        this.$notify({
          title: '保存成功',
          message: '该订单已保存',
          type: 'success'
        })
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
      },
      upLoad(item) { // 上传方法
        // 处理item,获取文件名
        let formData = new FormData()
        formData.append('file', item.file)

        let orderId = this.formData.orderId
        formData.append('orderId', orderId)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$axios.post('/file/upload', formData, config).then((result) => {
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
          let fileDownloadUrl = '/file/download/' + fileId
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
            var pickGoodsDetailList = []
          } catch (e) {
            console.log('文件类型不正确')
            return
          }

          for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              pickGoodsDetailList = pickGoodsDetailList.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
            }
          }
          that.showData(pickGoodsDetailList)
          console.log(pickGoodsDetailList)
          pickGoodsDetailList.forEach((g) => {
            that.formData.pickGoodsDetailList.push(g)
          })
        }
        fileReader.readAsBinaryString(files[0])
      },
      // 修改导入数据字段名
      showData(data) {
        data.forEach((d) => {
          d['brandName'] = d['入库订单号']
          d['brandName'] = d['品名']
          d['model'] = d['型号']
          d['unitPrice'] = d['单价']
          d['amount'] = d['数量']
          d['money'] = d['金额']
          d['brand'] = d['品牌']
          d['origin'] = d['产地']
          d['packageNo'] = d['箱号']
          d['packageNum'] = d['箱数']
          d['pureWeight'] = d['净重']
          d['weight'] = d['毛重']
          delete d['入库订单号']
          delete d['品名']
          delete d['型号']
          delete d['单价']
          delete d['数量']
          delete d['金额']
          delete d['品牌']
          delete d['产地']
          delete d['箱号']
          delete d['箱数']
          delete d['净重']
          delete d['毛重']
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .view-main {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    min-height: 898px;
    padding-bottom: 90px;

    .payMoney {
      .el-input {
        width: 119px !important;
      }

      .el-select {
        width: 232px !important;
        margin-left: 5px;
      }
    }

    .term {
      flex: 0 0 100% !important;

      .inputBox {
        width: 120px !important;
      }

      .el-date-editor {
        width: 232px !important;
        margin-left: 5px;
      }
    }
  }

  .content-wrapper {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 22px;
    padding-bottom: 0;
    font-size: 0;

    .orderState-wrapper {
      .tagContent {
        display: flex;
        justify-content: flex-start;

        .tagItem {
          width: 134px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 15px;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAAoCAYAAAA7b4IPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAADIUlEQVR42u3cwWsjdRTA8e/vl6F0OpsyCC0tmTiFdDy2l7qnwasI2pt686y4yOp1vSgueDIXBVH8A3S9rX/CO1mhtHhrL9OSHtZLIGuGyiTxYAKhzLYZTRgzvA8Ekkze5P34Pd5MfhPGMCYibwEfA68C91DL7DlwBHwVx/Ev/2YHBkBEvnBd91EYhvi+T61WK3tg6j8YDAZ0u12SJCFN08dxHH9adB9GRN50Xffp3t4ejuOUPSY1R1mWcXp6Spqmh3EcPy0Sa4FPwjDUoqggx3EIwxD+OUUoxAIHvu+XPQa1IOO5PSgaZ4G6nlNU13hu60XjbNmJq/8nLQyVSwtD5dLCULm0MFQuLQyVywJcX1+XnYdaoLW1NUTkRxHZmDXGAo+Oj4/TTqfDaDQqewxqAfb39wmC4B1jzO8i8vYsMZOLaC3gG8/zXm+1WtTrhddD1BLo9XqcnZ2RpukT4EEcx89e9Fkz/UJE3gXaW1tb23r9pJqGwyEXFxdcXV09G41GD+I4fpL3OXPzDRHxgccrKyvv7+zs2I2NmQ9Laonc1T3MiwJF5D7wne/7+61Wi9XV1bLHoubstu5hbgsUEQf4yFr7WRAE94IgwBhz5xeq5ZLXPWaaZRFpAl+7rnu4u7vL+vp62WNRc3aze8y6wPXX+KEdo8LGc2uAu2dZRN4zxrQbjcZLzWYTa3WxtGp6vR7n5+f0+/2fgQ9vPZSIyMvAt57nvRFFEZ7nlZ2/mrPhcMjl5SWdTueP8cnnT5NteT9XDfCBtfbLZrNZbzQaeviooLwuMb395gLXK8D39Xr9tSiKcF237PzVnN3WJaZNlsQd4GGtVvs8DEN3e3u77PzVAtzVJaYZEdkDfvB9/0AXsqpp1i4xzQGOoiha2dzcLDt/tSAnJyczdYlpDqBFUXH9fp84jme63D6hixIqlxaGyqWFoXJpYahcWhgqlxaGymWB3mAwKDsPtSDjuX1eNM4Cv3W73bLzVwsyntujonEWaCdJQpZlZY9BzVmWZSRJAtAuGqs3Z6ugudycbfJERA6Bh8B9QP+Vs9z+BH4F2kVvyjbxN+xXR0mzMB99AAAAAElFTkSuQmCC");
          background-size: 100% 100%;

          &.active {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAAoCAYAAAA7b4IPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAC8UlEQVR42u3cz2sTQRQH8Dezm902Ta1QaYjQqrVRLBFFxagtpP6IldqLRPAqXrwqgt79AzwU9OBBEE8N/kDQtulWaGFFevAgFGtNaKuCBQVR0nSzk+zEQ1VimKZJ6rJ2+z63/JjkDfPl7WYzLIFfQlpqMEhZ2Ed4gAIogNYtDsAWC3QhyZXJqWjHhVo+gwAA9IzN6CBJXROm6vSc0D8UUU0Ay3o5fmp3d7VjaUhLDWIo3GnCVAEkqSukpQarHUuDlIUxFO41YaoQpCxc7TjqIzzgdPHIXrWsMcUTTferZY2p00Wj/xMGAwlhMJAQBgMJYTCQEAYDCWEwNoCPpA76X0y/bUp8uFXpGDrLPePnlEze6eKRfcZNFZ7nfHuinszlfVrqUSVjCACAPzF3+6hsnPlC6tpfMY/T80A2iqgm+HhuWs97E997t11d6X2k+MF+Lfm4k7LoEN/k+2E5PQVkp5iSXkpaysibaEdM9DopfULX9c03s1vGVIkeeGbWk9W/Aq1X5brHigu/Y3T23iEp2/eOeP1TTHJ6DshGou5RtiPoui5fz7YMt9J8JM4a8eTDxUq7R0WHiubE/MAx2ehNU88u3LvhbjElvXRF+XaxousYFhCrAICnoxsAWT6KkFU7xkEt+bRdyp1+yBrrnC4a2adHNaGhkkNJc2J+oFs2+r4SdSde23C380raeG8pw2VPPnVdJ9eMlqHtUv5EnDXi7i4XK+0Sxa/9FYxAYu7OEdk4+4nUt71mstN1IxuJukQxArD8s/RGtmXET3nkCWvARLhYuS5RjLSOzt0NS0b/DPEG8EKWu63WJYrJx+XMpQesCRPhYr+7hJZrKNsliskEAEPhcm2FLNw/GeqsZgxu1EFCGAwkhMFAQhgMJITBQEIYDCREOQBzughkr1rWmC4W6ILThSN71bLGNMmVyYhqOl07sklENSHJlclqx+HN2VxsLTdn+/O3+14tFe+g7LCP8K0UAHfmrGMcILdYoJ/XcjvHn2YVIUQUlLueAAAAAElFTkSuQmCC");
            background-size: 100% 100%;
            color: #fff;
          }

          &:first-child {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAAoCAYAAAA7b4IPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAA/ElEQVR42u3cQQqDMBBG4UnpqcbzT65lF9Yi+CtpaFEy71uJKCg8ZmNMsbeImA3Dmaap9NxXzJYo3P3qd8Af1Fq74ihEMb6eOB5XPzTuiTAgEQYkwoBEGJAIAxJhQCIMSIQBiTAScHeLiPmb72GEkYS7fwJpuZ4wkmmdHoSRUMv0IIzEzqYHYSR3ND0IA2a2nx7Pqx8I97Eu2IqImYkBiYmBj1qrmS0LiAkDZrZfF0oYyW2nxPY8YSR2tnqcMBI6mhJbhJFM6z8mhJFEy5TYIowE+BMNP0MYkAgDEmFAIgxIhAGJMCARBiTCgMTmbIPr3pxtPWA7xzH1buf4Ap78ZKD578QFAAAAAElFTkSuQmCC");
            background-size: 100% 100%;

            &.active {
              background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAAoCAYAAAA7b4IPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABkUlEQVR42u3cP07DMBzF8a8tNmBkzC2AM2SAbuUSdKCsMNKVnoM/Gww+A2WDG3grI2UOA20VFVNqkHGR32eM7OoX+emlaqUYpozzh0Af2AO2kP9sAoyAy6au7n/yAQbAOH8BnOW+G0li0NTVeewmY5w/AO5yTy9JdZq6ijpjC5zmnlqS68dusMBu7qkluegztsB27qkluegztrknlvWkYEiQgiFBCoYEKRgSpGBIkIJRCOP8lXF+Z9X1CkY5joBn43x3lcXGON/knlj+3A3Qa+pq/NUCNUaZusDTsvZQY0iwPdQYEmwPNYa0zdtDwZBFY6CnR4ksMoDZyD2FrJVb4Lipq7GCIQAvfHy3uJ5dUDBk3hLtiwpGuT61RJuCUaZgS7QpGGVZ2hJtCkY5vm2JNgWjEE1drfR3+4x+4JIgBUOCFAwJUjAkSMGQIAVDgizwmnsISW4Su8ECj7mnluRGsRssMMw9tSQXfcZ2+m6mQe7JJZlB7Pu3YPrWPgDjfAc4AfaBzdx3I7/yBjwAw5+EAuAdymBgRHKwaFUAAAAASUVORK5CYII=");
              background-size: 100% 100%;
            }
          }

          &:last-child {
            width: 122px;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAAoCAYAAAAxH+4YAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAACcElEQVR42u3cv2vUYBzH8XeeC9JwXgkO5Y7jzNDGQfBczk4P7oJ2dXN3a3Wsk6g4eYuIKP4BznVx/3ZphdD+BQ2lUOgSuMpRSazLCa21Wu2dj3f5viBDeDJ84JMfTx5CPAZE5A6wBNwALqLG2T6wDryw1n4A8ABE5EkQBMtRFBGGIZVKxXVQdQ5FUZBlGWma0u/3n1prH3kicjsIgpV2u43v+64zqiHK85zNzU36/f6CAR5EUaQlTyDf94miCGDJAJ0wDF1nUiMy6LZjgJo+kyfXoNuacR1E/RtadElo0SWhRZeEFl0SWnRJGICDgwPXOdSIGWA5SZL+zs4Oh4eHrvOoETHW2mdFUVzb2tr6uLGxQa/Xc51JjYB3dEdE7gLder3e0PXvybG6unp8MmatfQ9c3d3dfZUkyde9vT3XGdWQeKcNiMg88CYMw+uzs7NMTU25zqr+0okr+ihr7RrQybLsYZIk+9vb2zpZG2PeWQ4SkRbwMgiChbm5Oaanp13nVn/gl1f0D74MNjzvTOeG+s/8dlotIvc8z+s2m81LrVYLY3QxbRydWrSIXAZeV6vVW3EcU61WXWdV53CiaBHxgPvGmOetVqvWbDb1dj0BjhUtIleAt7Va7WYcxwRB4DqfGhIfQER8YLFSqTyOoihoNBquc6kh80WkDbwLw7CjCyOTywfW4zi+MDMz4zqLGiEDaMkloC/FJaFFl4QWXRJadElo0SWhRZeEAXpFUbjOoUZk0O2+AT5lWeY6jxqRQbfrBuimaUqe564zqSHL85w0TQG6+rOaCfTTn9V8HxSRBWARmAf0K4Px9hlYA7rW2hWAb0jVu/FGwKsnAAAAAElFTkSuQmCC");
            background-size: 100% 100%;

            &.active {
              background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAAoCAYAAAAxH+4YAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAACXklEQVR42u3csWsTURwH8N/73eVOJdGh0hKxorWxIBUEpUEtnJWmQi2IDnVz6OjSwcG/QpAODh1cnBqK4lJM06HFq5BBcOigXEg6mUFRahKv99J756KQUGql5nzcvd9nu7s3fOHL4z3ujsfgl+FieSGDPJtkIo0ABpDIEgC8EWDNEUZpIzd4DwCAAQBcX/log6ZdW/NM2RlJF1mmB+D766vjQ6NsuFheOK7DNJUcT5bpwZcdyGMGeZZKjq81z4QM8iwmmUjLDkPClWQijbTxij8EMFB2CPJ/UNGKoKIVQUUrgopWBBWtCCpaEVgRidU7RnNHdhASLnwzPjS23jLnbyfqlStGS3YeEhLWfnGx6Lw4jzy3JI4mt3zZ0Ui33De2Otfo97nM3Qfmt/4R1nw3ZbqB7ICke9heD84sV55d1rYnP7AjfRtck52T/INdM7pddWJgZtb8ejIl+Mq0UafFO+LY3wzqKWzOXdXdm3VMnKNv19HzxxndzgfmBwC0PYswfb8Bl4rOqwGtObHIU4dkhyUHt2fRPYXNuVHdnfzMtLOLnDqOul1F27bNHrq9S6e1HzfyPEV/n8RER9HpQvXpY8+95WuJU3l+WHY20kU6AIBt2/qj7d7XfehZL3lq33WbRI/ev1ydf+K5U9/RSL+lFyOxpY/pzZnn/Bg1HHPIAKhkBdCPB4qgohVBRSuCilYEFa0IKloRKAC47BAkXAKAYyPAmuwgJFyNAGvoCKNkmZ7sLCQklumBI4wSHVYTYx2H1fy+eaFYzg8iH0kycQIBErJDkoMTAK1GgJ/aj5/6CTbVuYJPaGqgAAAAAElFTkSuQmCC");
              background-size: 100% 100%;
            }
          }
        }
      }
    }

    .form-content {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 20px;

      .radioBox {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 40%;
        flex: 0 0 100%;
      }

      .formItem {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 40%;
        flex: 0 0 40%;

        .inputBox {
          width: 360px;
        }

        .inputName {
          width: 120px;
        }

        .inputTel {
          width: 235px;
        }

        .inputName2 {
          width: 80px;
        }

        .inputTel2 {
          width: 80px;
        }
      }

      .Shipments {
        flex: 0 0 100%;
      }
    }

    .title {
      display: block;
      height: 22px;
      line-height: 22px;
      padding-left: 12px;
      border-left: 2px solid #01B8E1;
      font-size: 17px;
      font-weight: 600;
      color: #09BAE3;
    }

    .tableView-wrapper {
      .title-wrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
    }

    .sendGoods {
      width: 100%;
      margin-top: 20px;
      margin-bottom: 10px;

      .title {
        margin-bottom: 10px;
      }
    }

    .upload-wrapper {
      width: 530px;
      margin-top: 30px;

      .title {
        font-size: 17px;
      }

      .upload-content {
        margin-top: 20px;

        .el-upload__tip {
          display: inline-block;
          padding-left: 15px;
        }
      }

      .make-content {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 30px;
        font-size: 14px;
      }
    }

    .submit-wrapper {
      display: flex;
      line-height: 40px;
      margin-top: 20px;

      .make {
        display: flex;
        justify-content: flex-start;
        margin-left: 22px;

        .makeTime {
          font-size: 14px;
        }

        .maker {
          font-size: 14px;
          margin-left: 30px;
        }
      }

      .btnBox {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
<style lang="scss">
  .el-dialog__header {
    border-bottom: 1px solid #e0e0e0 !important;
  }

  /*修改table-footer总计样式*/
  .el-table__footer-wrapper {
    td {
      &:not(:first-child) {
        color: red;
      }
    }
  }

  /*table Item样式*/
  .orderTable {
    .el-table__row {
      & > td {
        padding: 0;
      }
    }

    .formInnerInput {
      & > .el-input__inner {
        width: 100%;
        height: 100%;
        text-align: center;
        border: none;
        border-radius: 0;
      }
    }
  }

  .tableView-wrapper {
    td, th {
      padding: 8px 0;
    }
  }

</style>
