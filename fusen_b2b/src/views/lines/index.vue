<template>
  <div class="content-wrapper">
    <pageTmp>
      <template slot="button">
        <el-button type="primary" size="small">新增</el-button>
        <el-button size="small">删除</el-button>
        <el-button size="small">提交</el-button>
        <el-button size="small">查看</el-button>
      </template>
      <template slot="table">
        <tabTmp :tabData="tabData"
                :tabTagData="tabTagData">
        </tabTmp>
      </template>
    </pageTmp>
    <div class="clearFloat">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        background
        class="paginationContent"
        :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import pageTmp from '@/components/pageTemplate'
  import tabTmp from '@/components/tabTemplate'
  export default {
    data() {
      return {
        tabData: [
          {
            certificateNumber: 'XS13213254',
            BusinessDate: '2018-11-11',
            creditMain: '深圳市腾讯股份有限公司',
            currency: '美元',
            company: '商务部',
            state: '保存'
          }
        ],
        tabTagData: [
          {
            label: '单据编号',
            prop: 'certificateNumber',
            width: ''
          },
          {
            label: '业务日期',
            prop: 'BusinessDate',
            width: ''
          },
          {
            label: '授信主体',
            prop: 'creditMain',
            width: ''
          },
          {
            label: '币种',
            prop: 'currency',
            width: ''
          },
          {
            label: '公司',
            prop: 'company',
            width: ''
          },
          {
            label: '状态',
            prop: 'state',
            width: ''
          }
        ],
        currentPage: 1
      }
    },
    components: {
      pageTmp,
      tabTmp
    },
    methods: {
      handleCurrentChange(currentPage) {
        console.log(currentPage)
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    padding: 10px 22px 0;
    .clearFloat{
      height: 72px;
      .paginationContent{
        float: right;
        margin: 20px 10px 20px 0;
      }
    }
  }
</style>
