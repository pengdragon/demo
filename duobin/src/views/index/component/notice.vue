<template>
  <div>
    <el-table height="240" :data="noticeData" style="width: 100%" :show-header="false">
      <el-table-column prop="text" label="内容">
      </el-table-column>
      <el-table-column prop="date" label="日期222" width="120">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      noticeData: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style scoped lang="scss">
  .grid-content {
    border-radius: 4px;
    min-height: 110px;
  }
  .purple{
    background: url("/src/assets/index/bg-purple.png") no-repeat;
    background-size: 100% 100%;
  }
  .orange{
    background: url("/src/assets/index/bg-orange.png") no-repeat;
    background-size: 100% 100%;
  }
  .green{
    background: url("/src/assets/index/bg-green.png") no-repeat;
    background-size: 100% 100%;
  }
  .advertisement{
    background: url("/src/assets/index/ad.png");
    background-size: 100% 100%;
  }
  .left-icon{
    height: 110px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .right-text{
    height: 110px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    p{
      margin: 0;
      padding: 0;
    }
    .money{
      font-size: 22px;
    }
    .title{
      font-size: 14px;
      margin-top: 5px;
    }
  }
</style>
