<template>
  <div class="content">
    <mSearchLayout v-show="$route.path==='/import/orderSearch'"
                   @searchEvent="searchEvent"
                   placeholder="请输入订单号/料号/品号/型号"
                   :statusList="statusList">
      <!--顶部切换按钮-->
      <div slot="top" class="top-button">
        <mButton :active="activeIndex === 1"
                 class="item"
                 @click="changeActiveIndex(1)">全部订单</mButton>
        <mButton :active="activeIndex === 2"
                 class="item"
                 @click="changeActiveIndex(2)">审核中订单 (<span class="oColor" :class="{active: activeIndex === 2}"> {{unconfirmedPageTotal}} </span>)</mButton>
        <mButton :active="activeIndex === 3"
                 class="item"
                 @click="changeActiveIndex(3)">待派货订单 (<span class="oColor" :class="{active: activeIndex === 3}"> {{waitSendPageTotal}} </span>)</mButton>
      </div>
      <div slot="button">
        <div v-show="activeIndex === 1">
          <el-button type="warning" size="small" @click="$router.push('/import/placeOrder')">申请下单</el-button>
          <el-button size="small" @click="lookForOrder" :disabled="selection.length!==1">编辑</el-button>
          <el-button size="small" @click="deleteOrder" :disabled="selection.length!==1">删除</el-button>
          <el-button size="small"
                     @click="sendBack"
                     :disabled="selection.length!==1">退回</el-button>
        </div>
        <div v-show="activeIndex === 2">
          <el-button size="small" type="warning" @click="$router.push('/import/placeOrder')">申请下单</el-button>
          <el-button size="small" :disabled="unDetailBtnState" @click="lookForOrder">查看</el-button>
          <el-button size="small" :disabled="unDetailBtnState" @click="deleteOrder">删除</el-button>
          <el-button size="small"
                     @click="sendBack"
                     :disabled="unDetailBtnState">退回</el-button>
        </div>
        <!--发货车待制作-->
        <div v-show="activeIndex === 3" class="send-content">
          <div class="shoppingCar-content">
            <div class="shoppingCar-img"
                 @click="showSendGoodsCarArr = true">
              <div class="number">{{sendGoodsCarArr.length}}</div>
            </div>
            <div class="shoppingCar-text">
              已加入<span style="color: #EF922A;">{{sendGoodsCarArr.length}}</span>个订单号
            </div>
          </div>
          <el-button type="success"
                     class="sendBtn"
                     :disabled="sendGoodsBtnState"
                     @click="sendGoodsHandle">去派货</el-button>
        </div>
      </div>
      <div slot="table" v-loading="loadState">
        <el-table height="485"
                  v-show="activeIndex === 1"
                  :data="orderData"
                  @cell-dblclick="dbClickCell"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column label="富森订单号" align="center" prop="fusenOrder">
            <template slot-scope="scope">
              <span style="color: #1F9BD6;cursor: pointer" @click="dbOrder(scope.row)">{{scope.row.fusenOrder}}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单日期" align="center" prop="createDate"></el-table-column>
          <el-table-column label="订单状态" align="center" prop="logisticsStatus">
            <template slot-scope="scope">
              <div v-if="scope.row.status === '已审核' && scope.row.logisticsStatus"
                   style="color: #1F9BD6;cursor: pointer"
                   @click="dbLogistics(scope.row)">
                已审核,查看物流
              </div>
              <div v-else>
                {{scope.row.status}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" align="center" width="280" prop="supplier"> </el-table-column>
          <el-table-column label="订单金额" align="center" width="120" prop="money"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="prop">
              <div class="handle-content">
                <!--订单关注-->
                <div class="follow-content">
                  <div v-show="prop.row.followStatus === 'unfollow'"
                       class="follow"
                       @click="addFollowStatus(prop.row)">关注
                  </div>
                  <div v-show="prop.row.followStatus === 'follow'"
                       class="unfollow"
                       @click="cancelFollowStatus(prop.row)">取消关注
                  </div>
                </div>
                <!--订单确认-->
                <div class="confirm-content">
                  <a target="_blank"
                     class="look"
                     v-show="parseInt(prop.row.statusValue) >= 3 && prop.row.affirmStatus"
                     :href="prop.row.comfirmbookUrl">
                    查看确认书
                  </a>
                  <div @click="showConfimDialog(prop.row)"
                       class="confirm"
                       v-show="parseInt(prop.row.statusValue) >= 3 && !prop.row.affirmStatus">
                    订单确认
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-table height="485"
                  v-show="activeIndex === 2"
                  :data="unconfirmedOrderListData"
                  @cell-dblclick="dbClickCell"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column label="富森订单号" align="center" prop="fusenOrder">
            <template slot-scope="scope">
              <span style="color: #1F9BD6;cursor: pointer" @click="dbOrder(scope.row)">{{scope.row.fusenOrder}}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单日期" align="center" prop="createDate"></el-table-column>
          <el-table-column label="订单状态" align="center" prop="logisticsStatus">
            <template slot-scope="scope">
              <div v-if="scope.row.status === '已审核' && scope.row.logisticsStatus"
                   style="color: #1F9BD6;cursor: pointer"
                   @click="dbLogistics(scope.row)">
                已审核,查看物流
              </div>
              <div v-else>
                {{scope.row.status}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" align="center" width="280" prop="supplier"> </el-table-column>
          <el-table-column label="订单金额" align="center" width="120" prop="money"></el-table-column>
          <el-table-column label="操作" align="center" width="200" prop="confirm">
            <template slot-scope="prop">
              <div class="handle-content">
                <!--订单关注-->
                <div class="follow-content">
                  <div v-show="prop.row.followStatus === 'unfollow'"
                       class="follow"
                       @click="addFollowStatus(prop.row)">关注
                  </div>
                  <div v-show="prop.row.followStatus === 'follow'"
                       class="unfollow"
                       @click="cancelFollowStatus(prop.row)">取消关注
                  </div>
                </div>
                <!--订单确认-->
                <div class="confirm-content">
                  <a target="_blank"
                     class="look"
                     v-show="parseInt(prop.row.statusValue) >= 3 && prop.row.affirmStatus"
                     :href="prop.row.comfirmbookUrl">
                    查看确认书
                  </a>
                  <div @click="showConfimDialog(prop.row)"
                       class="confirm"
                       v-show="parseInt(prop.row.statusValue) >= 3 && !prop.row.affirmStatus">
                    订单确认
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-show="activeIndex === 3"
                  width="100%"
                  :data="waitSendList"
                  height="500">
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="fusenOrder" label="富森订单号" align="center"></el-table-column>
          <el-table-column prop="partName" label="品名" align="center"></el-table-column>
          <el-table-column prop="model" label="型号" align="center"></el-table-column>
          <el-table-column prop="quantity" label="订单数量" align="center"></el-table-column>
          <el-table-column prop="ksendQty" label="可派货数量" align="center"></el-table-column>
          <el-table-column prop="sendQty" label="派货数量" align="center">
            <template slot-scope="prop">
              <el-input-number v-model.number="prop.row.sendQty"
                               size="mini"
                               type="number"
                               class="inputNumber"
                               @change="pickNumberChangeHandle($event, prop.row)"
                               :min="0"
                               :max="parseFloat(prop.row.ksendQty || 0)"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="grossWeight" label="毛重" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="prop">
              <div v-if="!prop.row.addStatus"
                   class="addCar"
                   @click="addCarData(prop.row)">加入派货车</div>
              <div v-else
                   class="removeCar"
                   @click="delCarData(prop.row)">移出派货车</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="page" v-if="total">
        <el-pagination
          v-show="activeIndex === 1 && total"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          background
          class="paginationContent"
          :total="total">
        </el-pagination>
        <el-pagination
          v-show="activeIndex === 2 && unconfirmedPageTotal"
          @current-change="handleCurrentChange"
          :current-page.sync="unconfirmedSendGoods.pageSize"
          :page-size="unconfirmedSendGoods.pageCount"
          layout="total, prev, pager, next, jumper"
          background
          :total="unconfirmedPageTotal">
        </el-pagination>
        <el-pagination
          v-show="activeIndex === 3 && waitSendPageTotal"
          @current-change="handleCurrentChange"
          :current-page.sync="waitSendSearchOptions.pageSize"
          :page-size="waitSendSearchOptions.pageCount"
          layout="total, prev, pager, next, jumper"
          background
          :total="waitSendPageTotal">
        </el-pagination>
      </div>
    </mSearchLayout>
    <!--产品明细列表-->
    <el-dialog title="产品明细"
               :visible.sync="dialogVisible"
               width="1000px">
      <div v-loading="goodLoadState">
        <tabTmp :tabData="goodData"
                :tabTagData="goodTagData"
                :tabHeight="'400'">
        </tabTmp>
      </div>
    </el-dialog>
    <!--订单确认弹框-->
    <uploadCmp :downloadModelUrl="currentConfimOrderData.comfirmbookUrl"
               acceptType="*"
               :currentFileList="[]"
               :showDialog="confimDialgState"
               @closeHandle="confimDialgState = false"
               @success="orderConfimHandle"></uploadCmp>
    <!--派货车dialog-->
    <el-dialog title="派货车"
               :visible.sync="showSendGoodsCarArr"
               top="50px"
               width="1300px">
      <el-table
        :data="sendGoodsCarArr"
        height="485">
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="fusenOrder" label="富森订单号" align="center">
        </el-table-column>
        <el-table-column prop="partName" label="品名" align="center">
        </el-table-column>
        <el-table-column prop="model" label="型号" align="center">
        </el-table-column>
        <el-table-column prop="quantity" label="订单数量" align="center">
        </el-table-column>
        <el-table-column prop="ksendQty" label="可派货数量" align="center">
        </el-table-column>
        <el-table-column prop="sendQty" label="派货数量" align="center" width="140px">
          <template slot-scope="prop">
            <el-input-number v-model.number="prop.row.sendQty"
                             type="number"
                             class="inputNumber reposition"
                             @change="pickNumberChangeHandle($event, prop.row)"
                             :min="0"
                             :max="parseFloat(prop.row.ksendQty || 0)"
                             label="提货数量"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="declDate" label="订单日期" align="center">
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center">
        </el-table-column>
        <el-table-column prop="carton" label="箱数" align="center">
        </el-table-column>
        <el-table-column prop="grossWeight" label="毛重" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="prop">
            <div delete @click="delCarData(prop.row)"></div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import mSearchLayout from '@/components/mSearchLayout'
  import uploadCmp from '@/components/uploadCmp'
  import tabTmp from '@/components/tabTemplate'
  import req from '@/utils/req'
  import api from '@/utils/apiUtil'
  import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        orderData: [],
        fileList: [],
        file: [],
        loadState: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        dialogVisible: false,
        goodData: [
          // {
          //   productName: '二极管',
          //   model: 'KV1221',
          //   brand: '雄光',
          //   unit: '个',
          //   amount: 2,
          //   recQty: 2,
          //   declareQty: 2,
          //   deliveryQty: 2,
          //   origin: '深圳'
          // }
        ],
        goodTagData: [
          {
            label: '品名',
            prop: 'productName',
            width: ''
          },
          {
            label: '型号',
            prop: 'model',
            width: ''
          },
          {
            label: '品牌',
            prop: 'brand',
            width: ''
          },
          {
            label: '单位',
            prop: 'unit',
            width: '75'
          },
          {
            label: '订单数量',
            prop: 'amount',
            width: '85'
          },
          {
            label: '收货数量',
            prop: 'recQty',
            width: '85'
          },
          {
            label: '报关数量',
            prop: 'declareQty',
            width: '85'
          },
          {
            label: '发货数量',
            prop: 'deliveryQty',
            width: '85'
          },
          {
            label: '产地',
            prop: 'origin',
            width: ''
          }
        ],
        goodLoadState: false,
        selection: [],
        requestDara: {
          'pageSize': 0,
          'pageCount': 10,
          'startDate': '',
          'endDate': '',
          'businessType': '1',
          'gatherSelcondition': ''
        },
        confimDialgState: false, // 订单确认弹框
        currentConfimOrderData: {}, // 当前订单确认的订单数据
        unconfirmedSendGoods: { // 待确认订单搜索项目
          pageSize: 1,
          pageCount: 10,
          startDate: '',
          endDate: '',
          gatherSelcondition: '',
          searchStatus: '1',
          businessType: '1'
        },
        unconfirmedPageTotal: 0, // 待确认的订单总页数
        unconfirmedOrderListData: [], // 待确认的订单数据
        unconfirmedGetSelectResultArr: [], // 获取待确认选中订单列表
        waitSendSearchOptions: { // 待派货搜索项
          pageSize: 1,
          pageCount: 10,
          startDate: '',
          endDate: '',
          gatherSelcondition: ''
        },
        waitSendList: [], // 派货车列表数据
        waitSendPageTotal: 0, // 当前派货总数
        sendGoodsCarArr: [], // 当前派货车数据数组
        showSendGoodsCarArr: false, // 展示派货车dialog状态
        activeIndex: 1
      }
    },
    components: {
      tabTmp,
      mSearchLayout,
      uploadCmp
    },
    computed: {
      /**
       * 根据当前的索引,决定枚举值列表
       * */
      statusList() {
        if (this.activeIndex === 1) {
          return [
            { label: '全部', value: '' },
            { label: '暂存', value: '0' },
            { label: '审核中', value: '1' },
            { label: '已审核', value: '3' }
          ]
        } else {
          return []
        }
      },
      /**
       * 全部订单按钮状态
       * */
      DetailBtnState() {
        return !(this.getSelectResultArr.length === 1)
      },
      /**
       * 待确认订单按钮状态
       * */
      unDetailBtnState() {
        return !(this.unconfirmedGetSelectResultArr.length === 1)
      },
      /**
       * 派货申请控制
       * */
      sendGoodsBtnState() {
        return !(this.sendGoodsCarArr.length >= 1)
      }
    },
    activated() {
      this.getOrderList()
      this.getWaitSendOrder()
      this.getUnconfirmedSendGoodsList()
    },
    methods: {
      /**
       * 退回
       * */
      sendBack() {
        this.$confirm('此操作将退回选中项目,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.activeIndex === 1 && this.selection[0].statusValue !== '1') {
            this.$notify({
              title: '警告',
              message: '该订单不能退回',
              type: 'warning'
            })
            return
          } else if (this.activeIndex === 2 && this.unconfirmedGetSelectResultArr[0].statusValue !== '1') {
            this.$notify({
              title: '警告',
              message: '该订单不能退回',
              type: 'warning'
            })
            return
          }
          let params = {}
          if (this.activeIndex === 1) {
            params = {
              busiCode: 1,
              id: this.selection[0].orderId
            }
          } else if (this.activeIndex === 2) {
            params = {
              busiCode: 1,
              id: this.unconfirmedGetSelectResultArr[0].orderId
            }
          }
          this.$axios.get('/api/import/order/sendback', {
            params
          }).then((res) => {
            this.$notify({
              title: '成功',
              message: '退回成功',
              type: 'success'
            })
            this.getOrderList()
            this.getUnconfirmedSendGoodsList()
          }).catch((err) => {
            console.log(err)
          })
        }).catch(() => {
        })
      },
      /**
       * 计数器数值变化
       * */
      pickNumberChangeHandle(val, row) {
        if (row.addStatus) {
          this.addCarData(row)
        }
      },
      /**
       * 加入派货车
       * */
      addCarData(row) {
        // 判断更新还是插入数据
        let checkResult = this.sendGoodsCarArr.some((val) => {
          return val.goodsId === row.goodsId
        })
        // 当无重复ID时,插入数据
        if (!checkResult) {
          this.sendGoodsCarArr.push(row)
        }
        this.$set(row, 'addStatus', true)
        this.$axios.post('/api/import/logistics/sendgoodscar/save', row).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 移除派货车
       * */
      delCarData(row) {
        // 移除购物车中对应
        let index = this.sendGoodsCarArr.findIndex((val) => {
          return val.goodsId === row.goodsId
        })
        this.$delete(this.sendGoodsCarArr, index)
        this.$set(row, 'addStatus', false)
        this.$axios.post('/api/import/logistics/sendgoodscar/delete', {
          id: row.goodsId
        }).then(() => {
          this.$notify({
            title: '成功',
            message: '移出成功',
            type: 'success'
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 派货申请
       * */
      sendGoodsHandle() {
        // 关闭当前页
        this.$store.dispatch('delVisitedViews', { fullPath: this.$route.fullPath })
        // 清除历史数据
        this.waitSendList = []
        this.activeIndex = 1
        // 页面重定向
        this.$router.replace({ path: '/import/sendGoods/newSendGoods', query: { getCarData: '1' }})
      },
      /**
       * 改变当前激活的页签
       * */
      changeActiveIndex(index) {
        this.activeIndex = index
      },
      /**
       * 获取派货车数据
       * */
      async getCarData() {
        let res = await this.$axios.get('/api/import/logistics/sendgoodscar/list').catch((err) => {
          console.log(err)
        })
        if (res) {
          this.sendGoodsCarArr = res.data
        }
      },
      /**
       * 获取待派货列表
       * */
      async getWaitSendOrder() {
        let jsonStr = JSON.parse(JSON.stringify(this.waitSendSearchOptions))
        jsonStr.pageSize -= 1
        jsonStr = JSON.stringify(jsonStr)
        // 首次获取数据时,先预读派货车数据
        if (this.waitSendList.length === 0) {
          await this.getCarData()
        }
        req.post('api/import/logistics/sendordergoods/list', { jsonStr }).then((res) => {
          this.waitSendPageTotal = res.data.total
          this.waitSendList = res.data.list || []
          // 匹配提货数量
          this.waitSendList.forEach((z) => {
            z.sendQty = parseFloat(z.ksendQty)
          })
          // 匹配已在派货车内的项目
          this.sendGoodsCarArr.map((val) => {
            this.waitSendList.forEach((z) => {
              if (val.goodsId === z.goodsId) {
                this.$set(z, 'addStatus', true)
              } else {
                this.$set(z, 'addStatus', false)
              }
            })
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 获取待确认订单列表
       * */
      getUnconfirmedSendGoodsList() {
        let jsonStr = JSON.parse(JSON.stringify(this.unconfirmedSendGoods))
        jsonStr.pageSize -= 1
        jsonStr = JSON.stringify(jsonStr)
        req.post('api/import/order/orderinfo/query', { jsonStr }).then((res) => {
          this.unconfirmedOrderListData = res.orderLst.list
          this.unconfirmedOrderListData.forEach((order) => {
            order.createDate = api.getDate(order.createDate)
          })
          this.unconfirmedPageTotal = res.orderLst.total
          res.orderLst.list.forEach((val) => {
            if (Number(val.statusValue) >= 2) {
              let baseUrl = window.g.baseUrl
              val.comfirmbookUrl = `${baseUrl}api/import/order/jasper/educe?fsno=${val.fusenOrder}&sessionid=${Cookies.get('sessionid')}`
            }
          })
          this.loadState = false
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 添加订单关注
       * */
      addFollowStatus(row) {
        this.$axios.post(`/api/import/order/setFoucusItem?orderId=${row.orderId}`).then(() => {
          this.$notify({
            type: 'success',
            message: '关注成功'
          })
          this.$set(row, 'followStatus', 'follow')
        }).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 取消订单关注
       * */
      cancelFollowStatus(row) {
        this.$axios.post(`/api/import/order/setFoucusItem?orderId=${row.orderId}`).then(() => {
          this.$notify({
            type: 'success',
            message: '取消关注成功'
          })
          this.$set(row, 'followStatus', 'unfollow')
        }).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 订单确认操作
       * */
      orderConfimHandle(file) {
        const id = this.currentConfimOrderData.orderId
        let json = {
          orderId: id,
          fileName: file.raw.name,
          fileType: file.raw.type,
          fileId: file.response.fileId
        }
        this.$axios.post('/api/import/order/orderinfo/customorderaffirm', json).then((res) => {
          if (res.result === 'success') {
            this.$notify({
              type: 'success',
              message: '订单确认成功',
              title: '成功'
            })
            // 关闭弹框
            this.confimDialgState = false
            // 重新拉取数据
            this.getOrderList()
            this.getUnconfirmedSendGoodsList()
          }
        }).catch((err) => {
          this.$message({
            type: 'warning',
            message: '订单确认失败, 请重试'
          })
          console.log(err)
        })
      },
      /**
       * 打开确认按钮
       * */
      showConfimDialog(row) {
        this.currentConfimOrderData = row
        this.confimDialgState = true
      },
      // 获取查询订单结果列表
      getOrderList() {
        this.loadState = true
        let jsonStr = JSON.stringify(this.requestDara)
        req.post('api/import/order/orderinfo/query', { jsonStr }).then((res) => {
          this.orderData = res.orderLst.list
          this.orderData.forEach((order) => {
            order.createDate = api.getDate(order.createDate)
          })
          this.total = res.orderLst.total
          res.orderLst.list.forEach((val) => {
            if (Number(val.statusValue) >= 2) {
              let baseUrl = window.g.baseUrl
              val.comfirmbookUrl = `${baseUrl}api/import/order/jasper/educe?fsno=${val.fusenOrder}&sessionid=${Cookies.get('sessionid')}`
            }
          })
          this.loadState = false
        }).catch((error) => {
          console.log(error)
          this.loadState = false
        })
      },
      // 点击查询事件
      searchEvent(val) {
        if (this.activeIndex === 1) {
          if (val.date) {
            this.requestDara.startDate = val.date[0]
            this.requestDara.endDate = val.date[1]
          } else {
            this.requestDara.startDate = ''
            this.requestDara.endDate = ''
          }
          this.requestDara.gatherSelcondition = val.registrar
          this.requestDara.searchStatus = val.status
          this.getOrderList()
        } else if (this.activeIndex === 2) {
          // 待确认订单
          if (val.date) {
            this.unconfirmedSendGoods.startDate = val.date[0]
            this.unconfirmedSendGoods.endDate = val.date[1]
          } else {
            this.unconfirmedSendGoods.startDate = ''
            this.unconfirmedSendGoods.startDate = ''
          }
          this.unconfirmedSendGoods.gatherSelcondition = val.registrar
          this.getUnconfirmedSendGoodsList()
        } else if (this.activeIndex === 3) {
          // 派货车数据
          if (val.date) {
            this.waitSendSearchOptions.startDate = val.date[0]
            this.waitSendSearchOptions.endDate = val.date[1]
          } else {
            this.waitSendSearchOptions.startDate = ''
            this.waitSendSearchOptions.startDate = ''
          }
          this.waitSendSearchOptions.gatherSelcondition = val.registrar
          this.getWaitSendOrder()
        }
      },
      // 表格选中数组发生变化事件
      handleSelectionChange(selection) {
        if (this.activeIndex === 1) {
          this.selection = selection
        } else if (this.activeIndex === 2) {
          this.unconfirmedGetSelectResultArr = selection
        }
      },
      // 当前显示页数改变事件
      handleCurrentChange(currentPage) {
        if (this.activeIndex === 1) {
          // 全部订单
          this.requestDara.pageSize = currentPage - 1
          this.getOrderList()
        } else if (this.activeIndex === 2) {
          // 待确认
          this.unconfirmedSendGoods.pageSize = currentPage
          this.getUnconfirmedSendGoodsList()
        } else if (this.activeIndex === 3) {
          // 待派货
          this.waitSendSearchOptions.pageSize = currentPage
          this.getWaitSendOrder()
        }
      },
      // 双击查看订单详情
      dbClickCell(row) {
        this.$router.push({
          path: '/import/orderDetail',
          query: { id: row.orderId }
        })
      },
      // 表格多选框选中一条数据时查看其详情
      lookForOrder() {
        let id
        if (this.activeIndex === 1) {
          id = this.selection[0].orderId
        } else if (this.activeIndex === 2) {
          id = this.unconfirmedGetSelectResultArr[0].orderId
        }
        this.$router.push({
          path: '/import/orderDetail',
          query: { id }
        })
      },
      // 点击订单号查看明细
      dbOrder(row) {
        this.dialogVisible = true
        this.goodLoadState = true
        req.get('api/import/order/orderinfo/querygoods', {
          params: {
            orderId: row.orderId
          }
        }).then((res) => {
          console.log(res)
          this.goodData = res.goodsLst
          this.goodLoadState = false
        }).catch((error) => {
          console.log(error)
        })
      },
      // 点击物流状态查看物流
      dbLogistics(row) {
        console.log(row)
        this.$router.push({
          path: '/import/logistics',
          query: { id: row.orderId }
        })
      },
      // 表格多选框选中一条数据时删除该订单
      deleteOrder(index) {
        this.$confirm('此操作将删除选中项目,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.activeIndex === 1 && this.selection[0].status !== '保存') {
            this.$notify({
              title: '警告',
              message: '该订单不能删除',
              type: 'warning'
            })
            return
          } else if (this.activeIndex === 2 && this.unconfirmedGetSelectResultArr[0].status !== '保存') {
            this.$notify({
              title: '警告',
              message: '该订单不能删除',
              type: 'warning'
            })
            return
          }
          // 获取ids
          let orderId
          if (this.activeIndex === 1) {
            orderId = this.selection[0].orderId
            this.orderData.splice(index, 1)
          } else if (this.activeIndex === 2) {
            orderId = this.unconfirmedGetSelectResultArr[0].orderId
            this.unconfirmedGetSelectResultArr.splice(index, 1)
          }
          // 发送请求
          req.get('api/import/order/orderinfo/remove', {
            params: {
              orderId
            }
          }).then((res) => {
            if (res.result === 'success') {
              this.$notify({
                title: '成功',
                type: 'success',
                message: res.result
              })
            }
            // 刷新页面
            if (this.activeIndex === 1) {
              this.getOrderList()
            } else if (this.activeIndex === 2) {
              this.getUnconfirmedSendGoodsList()
            }
          }).catch((error) => {
            console.log(error)
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
    .top-button{
      margin-bottom: 40px;
      .item{
        margin-right: 50px;
        .oColor{
          color: #F68909;
          &.active{
            color: #fff;
          }
        }
      }
    }
    .send-content{
      width: 100%;
      display: flex;
      justify-content: space-between;
      .shoppingCar-content{
        width: 212px;
        height: 39px;
        display: flex;
        align-items: center;
        .shoppingCar-img{
          position: relative;
          width: 44px;
          height: 24px;
          background: url("../../assets/img/paihuoche.png") no-repeat 100%;
          cursor: pointer;
          .number{
            position: absolute;
            top: -15px;
            right: -33px;
            width: 40px;
            height: 20px;
            background: url("../../assets/img/paihuoche-1.png") no-repeat 100%;
            color: #fff;
            font-size: 12px;
            text-align: center;
            line-height: 20px;
          }
        }
        .shoppingCar-text{
          margin-left: 47px;
          font-size: 12px;
          color: #333;
        }
      }
    }
    .addCar{
      box-sizing: border-box;
      width: 80px;
      height: 21px;
      line-height: 20px;
      margin: 0 auto;
      text-align: center;
      border-radius: 15px;
      color: #27A5FC;
      border: 1px solid #27A5FC;
      cursor: pointer;
      font-size: 12px;
      &:hover{
        color: #F6890A;
        border: 1px solid #F6890A;
      }
    }
    .removeCar{
      box-sizing: border-box;
      width: 80px;
      height: 21px;
      margin: 0 auto;
      line-height: 21px;
      text-align: center;
      border-radius: 15px;
      color: #333;
      border: 1px solid #27A5FC;
      cursor: pointer;
      font-size: 12px;
      &:hover{
        color: red;
        border: 1px solid red;
      }
    }
    .handle-content{
      display: flex;
      align-items: center;
      font-size: 12px;
      .follow-content{
        height: 22px;
        width: 76px;
        margin-right: 14px;
        line-height: 21px;
        text-align: left;
        cursor: pointer;
        .follow{
          position: relative;
          width: 76px;
          height: 22px;
          padding-left: 34px;
          color: #49AAFA;
          border: 1px solid #49AAFA;
          border-radius: 10px;
          &:after{
            content: '';
            display: block;
            position: absolute;
            top: 4px;
            left: 18px;
            width: 13px;
            height: 13px;
            background: url("../../assets/img/guanzhu.png") no-repeat 100%;
          }
        }
        .unfollow{
          position: relative;
          width: 80px;
          height: 22px;
          padding-left: 24px;
          color: #666666;
          border: 1px solid #49AAFA;
          border-radius: 10px;
          &:after{
            content: '';
            display: block;
            position: absolute;
            top: 4px;
            left: 7px;
            width: 13px;
            height: 11px;
            background: url("../../assets/img/quxiaoguanzhu.png") 100% no-repeat;
          }
        }
      }
      .confirm-content{
        height: 22px;
        line-height: 21px;
        cursor: pointer;
        .look{
          height: 22px;
          padding: 0 9px;
          color: #49AAFA;
          border: 1px solid #49AAFA;
          border-radius: 10px;
        }
        .confirm{
          height: 22px;
          padding: 0 9px;
          color: #666666;
          border: 1px solid #49AAFA;
          border-radius: 10px;
        }
      }
    }
  }
</style>
<style lang="scss">
  .inputNumber{
    width: 127px;
    height: 30px;
    .el-input__inner{
      height: 29px;
      border-radius: 0;
      font-size: 12px;
      padding: 0 27px;
    }
    .el-input-number__increase,.el-input-number__decrease{
      box-sizing: border-box;
      width: 27px;
      height: 26px;
      line-height: 26px;
      color: #858585;
      background: #fff;
    }
    &.reposition{
      height: 33px;
      .el-input-number__increase,.el-input-number__decrease{
        top: 3px;
      }
    }
  }
</style>
