<template>
  <!--通用上传组件-->
  <div>
    <div class="mUpload-content">
      <el-upload
        class="upload-content"
        :accept="acceptType"
        :data="parameter"
        :action="`${ baseUrl }/file/upload`"
        :before-upload="beforeUpload"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-preview="handlePreview"
        :file-list="handledFileList"
        multiple>
        <el-button v-if="!disabled" size="medium">附件上传</el-button>
        <div v-if="!disabled"
             slot="tip"
             class="tip-text">支持上传格式: {{acceptType}}</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
  import req from '@/utils/req'
  export default {
    name: 'mUpload',
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
    props: {
      /**
       * 传入的需显示的文件列表
       * */
      fileListData: {
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
        default: '.xls,.xlsx,.txt,.doc,.docx,.pdf,.png,.jpg'
      },
      /**
       * 是否禁止编辑
       * */
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      /**
       * 序列化文件列表
       * */
      handledFileList() {
        const arr = []
        const _this = this
        this.fileListData.map((file) => {
          arr.push({
            id: file.id,
            name: file.fileName,
            url: `${_this.baseUrl}file/download/${file.fileId}`
          })
        })
        return arr
      }
    },
    methods: {
      /**
       * 上传文件控制
       * */
      beforeUpload() {
        return !this.disabled
      },
      /**
       * 上传文件后
       * */
      handleChange(file) {
        if (file.response) {
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
        link.setAttribute('target', '_blank')
        link.click()
      }
    }
  }
</script>

<style scoped lang="scss">
  .mUpload-content{
    display: inline-block;
    min-width: 200px;
    .tip-text{
      display: inline-block;
      margin-left: 18px;
      font-size: 12px;
      color: #bbb;
    }
  }
</style>
<style lang="scss">
  .el-upload-list{
  }
</style>
