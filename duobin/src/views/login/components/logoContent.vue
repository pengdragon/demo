<template>
  <div>
    <div class="product">
      <div class="container">
        <el-row  :gutter="10">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-card :body-style="{ padding: '0px' }">
                <el-button type="text" class="button btn-primary">进出口综合服务</el-button>
                <img src="../../../assets/img/card1.jpg" class="image">
                <div style="padding: 14px;">
                  <div v-for="o in 3" :key="o"  class="text item"><i class="el-icon-success" ></i>
                    {{'提供专业的进出口服务 '}}
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-card :body-style="{ padding: '0px' }">
                <el-button type="text" class="button btn-warning">仓储物流服务</el-button>
                <img src="../../../assets/img/card1.jpg" class="image">
                <div style="padding: 14px;">
                  <div v-for="o in 3" :key="o"  class="text item"><i class="el-icon-success" ></i>
                    {{'提供专业的进出口服务 '}}
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-card :body-style="{ padding: '0px' }">
                <el-button type="text" class="button btn-danger">全程供应链解决方案</el-button>
                <img src="../../../assets/img/card1.jpg" class="image">
                <div style="padding: 14px;">
                  <div v-for="o in 3" :key="o"  class="text item"><i class="el-icon-success" ></i>
                    {{'提供专业的进出口服务 '}}
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-card :body-style="{ padding: '0px' }">
                <el-button type="text" class="button btn-info">供应链金融服务</el-button>
                <img src="../../../assets/img/card1.jpg" class="image">
                <div style="padding: 14px;">
                  <div v-for="o in 3" :key="o"  class="text item"><i class="el-icon-success" ></i>
                    {{'提供专业的进出口服务 '}}
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="quickquery">
      <div class="container">
        <div class="">
          <h3 class="title">快速查询报关相关业务</h3>
          <div id="example-1">
            <div v-for="item in items"  class="text item">
              {{item.message }}<i class="el-icon-d-arrow-right" ></i>
            </div>
            <el-button type="success"  @click="goToHome">马上注册体验</el-button>
          </div>
        </div>
      </div>
    </div>
    <!--用数据决策业务发展-->
    <div class="dataDisplay">
      <div class="container">
        <div class="">
          <h3 class="title">用数据决策业务发展</h3>
          <img src="../../../assets/img/data.jpg"/>
        </div>
      </div>
    </div>
    <!--最新报关状态-->
    <div class="customsDeclarationState ">
      <div class="container">
        <div class="">
          <h3 class="title">最新报关状态</h3>
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="unify"
              label="统一编号">
            </el-table-column>
            <el-table-column
              prop="declare"
              label="报关编号">
            </el-table-column>
            <el-table-column
              prop="state"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="date"
              label="日期">
            </el-table-column>
          </el-table>
          <el-row>
            <el-button type="default"  @click="goToHome">马上注册体验</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          { message: 'HS编码查询' },
          { message: '品目注释' },
          { message: '子目注释' },
          { message: '实时汇率' },
          { message: '快递查询' },
          { message: '商品归类' }
        ],
        tableData: [{
          unify: '2016-05-02',
          declare: '王小虎',
          state: '上海市普陀区金沙江路 1518 弄',
          date: '王小虎'
        }, {
          unify: '2016-05-02',
          declare: '王小虎',
          state: '上海市普陀区金沙江路 1518 弄',
          date: '王小虎'
        }, {
          unify: '2016-05-02',
          declare: '王小虎',
          state: '上海市普陀区金沙江路 1518 弄',
          date: '王小虎'
        }, {
          unify: '2016-05-02',
          declare: '王小虎',
          state: '上海市普陀区金沙江路 1518 弄',
          date: '王小虎'
        }, {
          unify: '2016-05-02',
          declare: '王小虎',
          state: '上海市普陀区金沙江路 1518 弄',
          date: '王小虎'
        }, {
          unify: '2016-05-02',
          declare: '王小虎',
          state: '上海市普陀区金沙江路 1518 弄',
          date: '王小虎'
        }]
      }
    },
    methods: {
      goToHome() {
        this.$router.push({
          path: '/register'
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" >
  .product{
    background-color: #ffffff;
    padding-top: 40px;
    padding-bottom: 40px;
    .el-card{
      position: relative;
      font-size: 14px;
      border-color: #d2d2d2;
      .el-button--text{
        position: absolute;
        padding: 10px ;
        color: #fff;
        border-radius: 2px 0 0 0;
      }
      .btn-primary{
        background-color:#f9bf00 ;
      }
      .btn-warning{
        background-color:#f08519 ;
      }
      .btn-danger{
        background-color:#c92b2f ;
      }
      .btn-info{
        background-color:#1f9bd6 ;
      }
      .image{
        width: 100%;}
      .text {
        line-height: 30px;
        .el-icon-success {
          color: #1f9bd6;
        }
      }
    }
  }
  .quickquery{
    padding:10px 50px 50px;
    background-image: url('../../../assets/img/1551151.jpg');
    h3.title:before, h3.title:after{
      background: #000;
    }
    #example-1{
      float: right;
      width: 250px;
      margin-top: 100px;
      font-size: 26px;
      color: #1f9bd6;
      line-height: 70px;
      .el-icon-d-arrow-right{
        font-weight: 600;
      }
      .el-button--success{
        background: #1f9bd6;
        border-color: #1f9bd6;
        font-size: 20px;
      }
    }
  }
  .dataDisplay{
    padding:10px 50px 50px;
    background-color: #2f2f2f;
    h3.title{
      color: #ffffff;}
    h3.title:before, h3.title:after{
      background: #fff;
    }
  }
  .customsDeclarationState{
    padding:10px 50px 25px;
    background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAC0tAIdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANRJREFUeNqM0GkOgyAQBWAYcEm66Ql68N6r19Aaa12hIyId0DblhwmTb17k8evtzsg5x0ICK9pJk+EhglRC2Y4QUMG/UpxKN70kAlfLbocW7ajMdNYcUxMMDekxglhwRxEAN6n4fexR3F8oujwVMkuEYqzy6SmGCDyKbFBaKpP6o5aF9pOuBwX/0/lKKT6ANmj+VXYrtZ24WmiDuJalEvt4rtRmu1oozTf006AmDS60GfxU2qB7qwSOE6TN6FHbIAZWvUcx8rWhtsGA1sMUUFrLW4ABABnjqr3NzlU1AAAAAElFTkSuQmCC');
    h3.title{
      color: #ffffff;}
    h3.title:before, h3.title:after{
      background: #fff;
    }
    .el-table{
      background-color:transparent;
      color: #fff;
      text-align: center;
      thead{
        color: #fff;
        tr{ background-color:transparent;
          th{background-color:transparent;padding: 16px 0;font-size: 16px; text-align: center}
          th.is-leaf{border-bottom: 0px;border-right: 1px solid #fff}
        }
      }
      tr{background-color:transparent;
        td{
          padding: 15px 0;font-size: 16px;
          background: #57b4e0;
          border-bottom: 0px;
          border-right: 1px solid #fff;}
        }
      }
    .el-table--striped .el-table__body tr.el-table__row--striped td{background-color: transparent}
    &{text-align: center;}
    .el-button--default{
      margin-top: 50px;
      background-color: transparent;
      color: #fff;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  h3.title {
    font-size: 30px;
    text-align: center;
    font-weight: 500;
    line-height: 1.1;
    position: relative;
  }
  h3.title:before, h3.title:after {
    content: '';                 /*CSS伪类用法*/
    position: absolute;         /*定位背景横线的位置*/
    top: 52%;
    width: 28%;
    height: 2px;
  }
  h3.title:before{
    left: 8%;        /*调整背景横线的左右距离*/
  }
  h3.title:after {
    right: 8%;
  }
</style>


