<template>
  <div class="container-wrapper">
    <!--<div class="orderNum">单据编号：987655</div>-->
    <flowSteps :titleArr="titleArr" :activeIndex="activeIndex" class="flow" @saveHandle="saveHandle">
      <div slot="step1">
        <el-form :label-width="'110px'"
                 :model="formData"
                 size="small"
                 class="form-content">
          <el-form-item label="自提公司：" class="formItem">
            <el-input v-model="formData.deliverycompany"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="联系人：" class="formItem">
            <div style="width: 360px;">
              <el-input v-model="formData.attn"
                        class="inputName"
                        placeholder="姓名"></el-input>
              <el-input v-model="formData.tel"
                        class="inputTel"
                        placeholder="联系电话"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="地址：" class="formItem term">
            <el-input v-model="formData.address"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="数量：" class="formItem term">
            <el-input v-model="formData.sumboard"
                      class="inputNum"
                      :disabled="boardDisabled"
                      @focus="board(boardDisabled)"
                      @blur="blurNum()"
                      placeholder=""></el-input>板
            <el-input v-model="formData.sumcartons"
                      class="inputNum"
                      :disabled="boxDisabled"
                      @focus="box(boxDisabled)"
                      @blur="blurNum()"
                      placeholder=""></el-input>箱
          </el-form-item>
          <el-form-item label="预计提货时间：" class="formItem">
            <div style="width: 360px;">
              <el-date-picker
                v-model="formData.yjthtime"
                type="date"
                class="inputTel"
                placeholder="选择日期">
              </el-date-picker>
              <el-select v-model="formData.takeGoodsTime" placeholder="选择时" class="inputName">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="备注：" class="formItem">
            <el-input v-model="formData.remark"
                      class="inputBox"
                      placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="step2">
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
      </div>
      <div slot="step3">
        <el-col class="tableView-wrapper">
          <div class="title-wrapper">
            <span class="handleButton">
            <el-button type="primary" size="small" @click="chooseOrder('选择订单')">选择订单</el-button>
          </span>
          </div>
          <tabTmp :tabData="tableData"
                  class="takeGoodsDetail"
                  :showHandle="true"
                  :tabHeight="'200px'"
                  @deleteItem="deleteItem"
                  :tabTagData="tabTagData">
          </tabTmp>
        </el-col>
      </div>
    </flowSteps>
    <el-dialog title="选择订单" :visible.sync="showOrderDetail" class="choose">
      <el-form :model="formData" inline size="medium" class="formFlexBox">
        <el-form-item>
          <div class="tmpContent" v-if="showTodoInput">
            <el-input
              class="inline-input"
              v-model="formData.registrar"
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
                @selection-change="chooseOrderSelect"
                :data="orderDtailData" :border="true" style="width:100%">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="fsno" label="富森号" align="center"></el-table-column>
        <el-table-column property="partname" label="品名" align="center"></el-table-column>
        <el-table-column property="spec" label="型号" align="center"></el-table-column>
        <el-table-column property="quantity" label="订单数量" align="center"></el-table-column>
        <el-table-column property="usableqty" label="可提货数量" align="center"></el-table-column>
        <el-table-column property="sys_created" label="订单日期" align="center"></el-table-column>
        <el-table-column property="unit" label="单位" align="center"></el-table-column>
        <el-table-column property="originalpacnum" label="箱数" align="center"></el-table-column>
        <el-table-column property="grossweight" label="毛重" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import flowSteps from '@/components/flowSteps'
  import tabTmp from '@/components/tabTemplate'
  import Cookies from 'js-cookie'
  import req from '@/utils/req'
  export default {
    data() {
      return {
        showTodoInput: true,
        chooseTitle: '',
        boardDisabled: false,
        boxDisabled: false,
        showOrderDetail: false,
        orderDtailData: [
          {
            orda001oid: '',
            orda001d1oid: '',
            fsno: '',
            partname: '',
            spec: '',
            quantity: '',
            usableqty: '',
            sys_created: '',
            unit: '',
            originalpacnum: '',
            grossweight: ''
          }
        ],
        formData: {
          sessionId: Cookies.get('sessionid'),
          deliverycompany: '', // 自提公司
          attn: '', // 姓名
          tel: '', // 电话
          address: '', // 地址
          sumboard: '', // 数量板
          sumcartons: '', // 数量箱
          yjthtime: '', // 预计提货日期
          hours: '', // 预计题或时间
          remark: '', // 备注
          detailData: '',
          attachid: '' // 附件id
        },
        tabTagData: [
          {
            label: '富森订单号',
            prop: 'fsno',
            width: ''
          },
          {
            label: '品号',
            prop: 'partname',
            width: ''
          },
          {
            label: '型号',
            prop: 'spec',
            width: ''
          },
          {
            label: '订单数量',
            prop: 'quantity',
            width: ''
          },
          {
            label: '提货数量',
            prop: 'usableqty',
            width: ''
          }
        ],
        tableData: [],
        titleArr: [
          '填写提货基本信息',
          '提交附件信息',
          '提交提货明细'
        ],
        searchformData: {
          registrar: ''
        },
        activeIndex: 1,
        options: [{
          value: '选项1',
          label: '1'
        }, {
          value: '选项2',
          label: '2'
        }, {
          value: '选项3',
          label: '3'
        }, {
          value: '选项4',
          label: '4'
        }, {
          value: '选项5',
          label: '5'
        }],
        fileList: []
      }
    },
    methods: {
      deleteItem(index) {
        this.tableData.splice(index, 1)
      },
      chooseOrderSelect(val) {
        console.log(val)
        this.tableData = val
      },
      chooseOrder() {
        let sessionId = Cookies.get('sessionid')
        req.post('api/import/logistics/queryOrderDetails', {
          'sessionId': sessionId,
          'fsno': this.searchformData.registrar
        }).then((res) => {
          this.orderDtailData = res.data
          this.showOrderDetail = true
          console.log(res)
        }).catch((error) => {
          console.log(error)
        })
      },
      searchHandle() {
        this.chooseOrder()
      },
      board(val) {
        if (val === false) {
          this.boxDisabled = true
        }
      },
      box(val) {
        if (val === false) {
          this.boardDisabled = true
        }
      },
      blurNum(val1, val2) {
        this.boardDisabled = false
        this.boxDisabled = false
      },
      saveHandle(type) {
        if (type === '保存') {
          console.log(type)
        } else if (type === '提交') {
          console.log(type)
          this.save()
        }
      },
      save() {
        // this.formData.detailData = this.takeGoodsData
        let mainData = this.formData
        let jsonStr = JSON.stringify(mainData)
        let dtail = JSON.stringify(this.tableData)
        req.post('api/import/logistics/generateTiHuoDan', {
          'sessionId': Cookies.get('sessionid'),
          'mainData': jsonStr,
          'detailData': dtail
        }).then((res) => {
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
  }
</style>
<style lang="scss">
  .choose .el-dialog__header{
    border-bottom: 1px solid #e0e0e0;
  }
</style>
