<template>
  <!--拖拽上传组件-->
    <div>
      <el-dialog title="导入文件"
                 :visible="showDialog"
                 :before-close="closeEvent"
                 width="650px"
                 class="upload-dialog dialog-content">
        <el-upload
          class="upload-content"
          :accept="acceptType"
          :data="parameter"
          :action="`${ baseUrl }/file/upload`"
          :before-upload="beforeUpload"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-preview="handlePreview"
          :file-list="currentFileList"
          :multiple="false"
          drag
          multiple>
          <div class="clickBtn">选择文件上传</div>
          <div class="bottom-tip-1">也可拖拽文件到该区域,完成上传</div>
          <div class="bottom-tip-2">只支持 ({{acceptType}})格式文件上传</div>
          <div class="bottom-tip-3">*只能上传模板格式文件,不可进行删除或修改,否则导致匹配错误,上传失败</div>
        </el-upload>
        <div class="download-model"
             v-show="downloadModelUrl"
             @click="downloadModel">下载模板</div>
      </el-dialog>
    </div>
</template>

<script>
  import req from '@/utils/req'
  import XLSX from 'xlsx'
  export default {
    name: 'uploadCmp',
    props: {
      /**
       * 显示上传弹框
       * */
      showDialog: {
        type: Boolean,
        default: false
      },
      /**
       * 上传后关闭弹框
       * */
      uploadClose: {
        type: Boolean,
        default: false
      },
      /**
       * 导入时所需的列表标题数据
       * 格式:
       * [
       *   {
       *     label: '品名',
       *     prop: 'productName',
       *     width: ''
       *   },
       *   .....
       * ]
       * */
      importTabTagData: {
        type: Array,
        default() {
          return []
        }
      },
      /**
       * 当前文件列表
       * */
      currentFileList: {
        type: Array,
        default() {
          return []
        }
      },
      /**
       * 允许上传的格式
       * */
      acceptType: {
        type: String,
        default: '.xls,.xlsx,.txt,.doc,.docx,.pdf'
      },
      /**
       * 模板下载的URL地址
       * */
      downloadModelUrl: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        parameter: {
          orderId: '0006C275-0000-0000-0000-00000E97FDBC',
          customId: '736CA29F-0B32-409C-9159-64F1C3EDD949'
        },
        baseUrl: window.g.baseUrl, // 请求基础地址
        fileList: []
      }
    },
    methods: {
      /**
       * 点击下载模板文件
       * */
      downloadModel() {
        let link = document.createElement('a')
        let downloadModelUrl = this.downloadModelUrl
        link.setAttribute('href', downloadModelUrl)
        link.setAttribute('target', '_blank')
        link.click()
      },
      /**
       * dialog关闭事件
       * */
      closeEvent() {
        this.$emit('closeHandle')
      },
      /**
       * 处理导入表格订单读取
       * 只允许导入xlsx文件
       * 文件表头需与传入的表头数据对应,才可得到正确数据
       * */
      handleImportTableData(files, tagData = []) {
        if (!files) { return }
        const _this = this
        var fileReader = new FileReader()
        fileReader.onload = function(ev) {
          try {
            var data = ev.target.result
            var workbook = XLSX.read(data, {
              type: 'binary'
            })
            var excelData = []
          } catch (e) {
            this.$message({
              type: 'warning',
              message: '文件类型不正确'
            })
            console.log('文件类型不正确')
            return
          }
          for (let sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              excelData = excelData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
            }
          }
          // 序列化excel数据
          let parserList = []
          excelData.map((v) => {
            const resultItem = {}
            Object.keys(v).map((excelKey) => {
              tagData.map((parserItem) => {
                if (excelKey === parserItem.label) {
                  resultItem[parserItem.prop] = v[excelKey]
                }
              })
            })
            parserList.push(resultItem)
          })
          // 数据校验
          if (parserList.length === 0 || typeof parserList[0] !== 'object') {
            _this.$message({
              type: 'warning',
              message: '文件内容解析失败'
            })
          } else {
            // 返回数据
            _this.$emit('importFileHandle', parserList)
            // 关闭dialog弹框
            _this.closeEvent()
          }
        }
        fileReader.readAsBinaryString(files)
      },
      /**
       * 上传文件前
       * */
      beforeUpload(file) {
        // 判断是否为导入文件,上传后立即关闭
        if (this.uploadClose && this.importTabTagData.length) {
          // 处理file对象,并返回数据
          this.handleImportTableData(file, this.importTabTagData)
          return false
        }
        return true
      },
      /**
       * 上传文件后
       * */
      handleChange(file) {
        if (file.response && this.uploadClose) {
          this.$emit('closeHandle', file)
        } else if (file.response) {
          this.$emit('success', file)
        }
      },
      /**
       * 删除对应文件
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
        }
      },
      /**
       * 预览下载对应文件
       * */
      handlePreview(file) {
        let fileId = file.response.fileId
        let baseUrl = window.g.baseUrl
        let link = document.createElement('a')
        let url = `${baseUrl}file/download/${fileId}`
        link.setAttribute('href', url)
        link.click()
      }
    }
  }
</script>

<style lang="scss">
.dialog-content.upload-dialog{
  font-family: "Microsoft YaHei";
  .el-dialog__body{
    padding-bottom: 45px;
  }
  .upload-content{
    width: 575px;
    margin: 0 auto;
    text-align: center;
    .el-upload-dragger{
      width: 575px;
      height: auto;
      .clickBtn{
        width: 160px;
        height: 55px;
        line-height: 55px;
        margin: 44px auto 0;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        color: #333333;
        background: #EDEDED;
        cursor: pointer;
      }
      .bottom-tip-1{
        width: 100%;
        margin-top: 30px;
        text-align: center;
        font-size: 16px;
        color: #333;
      }
      .bottom-tip-2{
        width: 100%;
        margin-top: 12px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
      .bottom-tip-3{
        width: 100%;
        margin-top: 56px;
        margin-bottom: 27px;
        text-align: center;
        font-size: 12px;
        color: #f89569;
      }
    }
    .el-upload-list{
      width: 50%;
      .el-upload-list__item-name{
        text-align: left;
      }
    }
  }
  /*模板下载*/
  .download-model{
    position: absolute;
    right: 40px;
    top: 374px;
    font-size: 14px;
    font-weight: bold;
    color: #82BCF2;
    cursor: pointer;
    &:after{
      display: block;
      content: '';
      position: absolute;
      left: -18px;
      top: 2px;
      width: 16px;
      height: 16px;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFXUlEQVRYR8WWXWwUVRTH///ZLR+lM1VEDMSgvGgQeBBDrMZGtjubQoIPRkOIQEQEEzVojBEV7ezMVgRiYkxBiIEAYoCE+KQGwdm2ikiDmGj4MjWKxhDEEqo72/LR7swxM7tbtu3utktCvE+TzPn43f8599xL/M+LleT/6AepupBKz6fgEQCTRWQKSEchT8PDSTfMo2ak5kIlMUcFELcvTwvRfVXEW0py4ggJTkPwpYvwJitW/edIMGUB1h3unZK55loklgOoGhJMAPwikF6AUyGYTEIpsOkH8HEIyttv6TV/lwIpCWDaqToF/AzE7XlnETlEKEdE2CHahONmHZ38P7Ndauj1PkbPWyzAwjyMAOckVFVvRsb/UQyiKEBzMv2kB9lHIOw7CXBGiFVmVDs6kqT+/+ZDV6ZLqD8BYGngL+iSMKNmRD011H8YQMLuvR9wO0CMzSaXPRLSlpsRZkaTvNDGSqaWANyV28glV8JzhvbFIADzYGqiEuIpEFOy5GLFY7VmpYkHQXzVEyW9QyBCAjkrGcw159d2520GAVh2qoXk6pxsO+MxbUWp5Ga73ELX+T2wDWnTzQj/LWWbaHVWQrAt+58thq6+PAzAbL9yt5Lp/zVLihMzutU5ixbRLRW02U7PE0p7EFIYaYqpX5dTyrJTB0k2AuinW3VvU+P4AH5AActObSH5fBBE4TyjQf2mXMBKAcxW52FF8F2utFvjsdoXBgBEhM2t6YsAboPgmBHT6kaqe6UAfjzLdjpI1EHwlxHTpg4ABGee7MjVfk08pr13MwASSWcNgI1ZlaXOaKg9FpTAslOrSbb4316Is4ud16FAN6KA2Z6epbhyMtuLXG1E1c0BQMJ21oN4IwugqmaEPTdDgY1HRL12NR1MTwHWx3VtbU4BZzeJZX6HGro2Zmhyy069A6COIcaNBi1opFIKWMl0BJAmAl8Yuvb+0FiJpNMX3CuC3UZMezqrQNLZCWC5AFfjujZ+GEDSuUhgkohcZggNfu2KATS3phvEkwPBFC1otMJ4lp3qJVkNYIeha8/mAdYBWBuUwOUdZqPaVeiUSKYXA7I3OPKQHirQ6SrjC+dABpIJAclcchfgU0ZM3V8Yp7AEgCQMvTaeLUEy/SIhm7O9wWhTVG0brkJqCcFP8hCKKGuEsiV3rl8CsCHYmcAlubhJVz8dJr/dMxv0TmSbEKuMqLY9r0A9gMNZh8GjcpAStrMCxPbcALsCIFcuXgVkXLnkwUZbndcp2JBt9qrp/hUdAPiDKNHqdBGcJMCFuK4Fl1GxlRgMUWgiBBcV23neKJFMfQ9wrn+9x3VtZlaI3LKSzgEACyDsM/SacST9F8/oIAQilGVxvXZPSZ+29KPwJHdfMG7oqv9euA7gPyK8UL8/pX6M69r6UoEGdmOnPwQlmOeecJMZU/0+KLr275fQz7emfyIxS0S6qz1t2muN7B0EMFLCYv/Ntp53PVeuJWKqVc7fsp0dJJ4JbEReMWK1H+TtR/UqvhG4grpbAI0gN3B4RrfaUHjNlwVItKUeFA91Sj8PNi3QOisBMdslTNfZRXBJduM4L67MLnwNjViCRNLxH5Ez/QkI4jkjqu0t15x5QP/up2AbgftyOz8nYKOpq2eGbqKsApbtdJK4J+/kv+kAZRcFnQgpv1VVVZ9ViExfX3oqRLnLg8yF59XnXj55t2/DwONrde1SMQXLApjtcicy6a0KsbAS+XO2nQJplqi2zyS9Uv6jasJE9gyvBPDE9elXNGS/CPx5slN09fNyiW/oFLQckLHdY9MPUPAQRNSgiUi/P7oI5Xx4zITjb9bzn0rUGpUClQSs1PY/Kjt9P/NsRTwAAAAASUVORK5CYII=");
      background-size: 100%;
    }
  }
}
</style>
