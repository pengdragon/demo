<template>
  <div style="width: 100%;min-height: 500px;height: 100%;">
    <div class="content-wrapper bmap-content">
      <!--地图-->
      <div class="maps-content">
        <div id="mapsChart" class="maps"></div>
        <div class="reload-content" @click="getAllData">
          <img src="/static/img/shuaxin.png"
               class="reload">
        </div>
        <!--时间选择器-->
        <div class="datePick-content">
          <div class="bottom-line-left"></div>
          <div class="bottom-line-right"></div>
          <el-date-picker
            v-model="realTimeRange"
            @change="changeDate"
            class="realTimeDatePick"
            value-format="yyyy-MM-dd"
            align="center"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </div>
        <!--地图切换-->
        <div class="change-page-tag"
             @mouseout="showPath = false"
             @mouseover="showPath = true">
          <div class="text">
            订单位置
          </div>
          <img src="/static/img/dingdanweizhi-xiala.png" class="pulldown-icon">
          <div v-show="showPath"
               @click="jumpOrderPath()"
               class="pathText">订单轨迹</div>
        </div>
        <!--送货签收列表-->
        <div class="detail-content"
             ref="sendOfSign"
             v-show="showSendOfSign">
          <div class="topBar">
            <div class="topBar-main sendOfSign">
              <img src="/static/img/yifahuo.png" class="sendGoodsIcon"/>
              <div>深圳送货</div>
              <img src="/static/img/songda.png" class="sendIcon"/>
              <div>送达地址</div>
            </div>
            <img src="/static/img/shanchu.png"
                 @click="hiddenSendOfSign"
                 class="closeIcon">
          </div>
          <div class="center-content"
               style="overflow: hidden;height: 496px;"
               @click.stop
               @mousewheel.stop>
            <div class="tag-conetnt">
              <div class="tag1"
                   :class="{active: currentTag}"
                   @click="currentTag = true">
                运输中( {{sendTotal}} )
              </div>
              <div class="tag2"
                   :class="{active: !currentTag}"
                   @click="currentTag = false">
                已签收( {{signTotal}} )
              </div>
            </div>
            <div v-show="currentTag"
                 v-loading="sendLoad"
                 style="height: 454px;"
                 class="content">
              <div class="sendOfSign-item"
                   v-for="item in sendGoodsList"
                   :key="item.itemId">
                <div class="item-title">
                  {{item.fsImportOrderNo}}
                  <!--<div class="tag">-->
                  <!--第一批-->
                  <!--</div>-->
                  <el-tooltip effect="dark"
                              content="更多信息"
                              placement="left">
                    <div class="topPull"
                         :class="{active: item.showDetai}"
                         @click="$set(item, 'showDetai', !item.showDetai)">
                      <svg-icon icon-class="topPull"></svg-icon>
                    </div>
                  </el-tooltip>
                  <el-tooltip effect="dark"
                              content="订单轨迹"
                              placement="right">
                    <div class="pathIcon" @click="jumpOrderPath(item.fsImportOrderNo)"></div>
                  </el-tooltip>
                </div>
                <div v-show="item.showDetai" style="position: relative;width: 100%;">
                  <div class="item">
                    下单时间: {{item.orderDate}}
                  </div>
                  <div class="two-item">
                    <div class="item1">
                      总订单数: {{item.quantity}}{{item.unit}}
                    </div>
                    <div class="item2">
                      运输数量: {{item.transportQuantity}}{{item.unit}}
                    </div>
                  </div>
                  <div class="item" v-if="item.addressInfoList && item.addressInfoList.length">
                    发货时间: {{item.addressInfoList && item.addressInfoList.length && item.addressInfoList[item.addressInfoList.length - 1].time}}
                  </div>
                  <div class="item" v-show="item.deliverGoodsType">
                    发货方式: {{item.deliverGoodsType}}
                  </div>
                  <div class="item" v-show="item.cNo">
                    快递单号: {{item.cNo}}
                  </div>
                  <div class="logisticsMsg" v-show="item.addressInfoList && item.addressInfoList.length">
                    <div class="takeGoodsAddress" v-show="item.receiveAddress">
                      <div class="circle">收</div>
                      <div class="text">[收货地址] {{item.receiveAddress}}</div>
                    </div>
                    <div class="logisticsItem"
                         v-for="(route, index) in item.addressInfoList"
                         :key="index"
                         v-show="item.showRoute || index === 0"
                         :class="{gray: index > 0}">
                      <div class="time-content">
                        <div class="time">{{route.time && route.time.split(' ')[1].slice(0, 5)}}</div>
                        <div class="date">{{route.time && route.time.split(' ')[0]}}</div>
                      </div>
                      <div class="route-msg">
                        {{route.addressRemark}}
                      </div>
                    </div>
                    <div class="showRouteMsg"
                         @click="$set(item, 'showRoute', !item.showRoute)">
                      <div>
                        {{item.showRoute ? '收起物流信息' : '点击查看更多物流详情'}}
                      </div>
                      <img :src="item.showRoute ? '/static/img/shouqi.png' : '/static/img/chakangengduo.png'" class="showIcon">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="!currentTag"
                 v-loading="signLoad"
                 style="height: 454px;"
                 class="content">
              <div class="sendOfSign-item"
                   v-for="item in signGoodsList"
                   :key="item.itemId">
                <div class="item-title">
                  {{item.fsImportOrderNo}}
                  <!--<div class="tag">-->
                  <!--第一批-->
                  <!--</div>-->
                  <el-tooltip effect="dark"
                              :content="item.showDetai ? '折叠信息' : '查看更多'"
                              placement="left">
                    <div class="topPull"
                         :class="{active: item.showDetai}"
                         @click="$set(item, 'showDetai', !item.showDetai)">
                      <svg-icon icon-class="topPull"></svg-icon>
                    </div>
                  </el-tooltip>
                  <el-tooltip effect="dark"
                              content="订单轨迹"
                              placement="right">
                    <div class="pathIcon" @click="jumpOrderPath(item.fsImportOrderNo)"></div>
                  </el-tooltip>
                </div>
                <div v-show="item.showDetai" style="position: relative;width: 100%;">
                  <div class="item">
                    下单时间: {{item.orderDate}}
                  </div>
                  <div class="two-item">
                    <div class="item1">
                      总订单数: {{item.quantity}}{{item.unit}}
                    </div>
                    <div class="item2">
                      运输数量: {{item.transportQuantity}}{{item.unit}}
                    </div>
                  </div>
                  <div class="item" v-if="item.addressInfoList && item.addressInfoList.length">
                    发货时间: {{item.addressInfoList && item.addressInfoList.length && item.addressInfoList[item.addressInfoList.length - 1].time}}
                  </div>
                  <div class="item" v-show="item.deliverGoodsType">
                    发货方式: {{item.deliverGoodsType}}
                  </div>
                  <div class="item" v-show="item.cNo">
                    快递单号: {{item.cNo}}
                  </div>
                  <div class="logisticsMsg" v-show="item.addressInfoList && item.addressInfoList.length">
                    <div class="takeGoodsAddress" v-show="item.receiveAddress">
                      <div class="circle">收</div>
                      <div class="text">[收货地址] {{item.receiveAddress}}</div>
                    </div>
                    <div class="logisticsItem"
                         v-for="(route, index) in item.addressInfoList"
                         :key="index"
                         v-show="item.showRoute || index === 0"
                         :class="{gray: index > 0}">
                      <div class="time-content">
                        <div class="time">{{route.time && route.time.split(' ')[1].slice(0, 5)}}</div>
                        <div class="date">{{route.time && route.time.split(' ')[0]}}</div>
                      </div>
                      <div class="route-msg">
                        {{route.addressRemark}}
                      </div>
                    </div>
                    <div class="showRouteMsg"
                         @click="$set(item, 'showRoute', !item.showRoute)">
                      <div>
                        {{item.showRoute ? '收起物流信息' : '点击查看更多物流详情'}}
                      </div>
                      <img :src="item.showRoute ? '/static/img/shouqi.png' : '/static/img/chakangengduo.png'" class="showIcon">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--分页组件-->
          <!--<div class="bottomBar">-->
            <!--<el-pagination-->
              <!--v-show="currentTag"-->
              <!--:page-size="getDataOptions.sendGoods.pageCount"-->
              <!--:current-page.sync="getDataOptions.sendGoods.pageSize"-->
              <!--:pager-count="5"-->
              <!--@current-change="pageChange($event, '运送')"-->
              <!--layout="prev, pager, next"-->
              <!--:total="sendTotal">-->
            <!--</el-pagination>-->
            <!--<el-pagination-->
              <!--v-show="!currentTag"-->
              <!--:page-size="getDataOptions.signGoods.pageCount"-->
              <!--:current-page.sync="getDataOptions.signGoods.pageSize"-->
              <!--:pager-count="5"-->
              <!--@current-change="pageChange($event, '签收')"-->
              <!--layout="prev, pager, next"-->
              <!--:total="signTotal">-->
            <!--</el-pagination>-->
          <!--</div>-->
        </div>
        <!--已下单列表-->
        <div class="detail-content"
             ref="placeOrder"
             v-show="showPlaceOrder">
          <div class="topBar" style="background: #aaa;">
            <div class="topBar-main placeOrder">
              <img src="/static/img/yixiadan.png" class="placeOrderIcon"/>
              <div>已下单 ( {{placeOrderTotal}} )</div>
            </div>
            <img src="/static/img/shanchu.png"
                 @click="hiddenPlaceOrder"
                 class="closeIcon">
          </div>
          <div class="center-content"
               style="height: 496px"
               v-loading="placeOrderLoad"
               @click.stop
               @mousewheel.stop>
            <div class="list-item"
                 v-for="item in placedAnOrderList"
                 :key="item.itemId">
              <div class="item-title">
                订单编号: {{item.fsImportOrderNo}}
              </div>
              <div class="item">
                下单时间: {{item.orderDate}}
              </div>
              <div class="two-item">
                <div class="item1">
                  总订单数: {{item.quantity}}{{item.unit}}
                </div>
                <div class="item2">
                  富森未收货: {{item.noReceiveQuantity}}{{item.unit}}
                </div>
              </div>
            </div>
          </div>
          <div class="bottomBar">
            <el-pagination
              :page-size="getDataOptions.placedAnOrder.pageCount"
              :current-page.sync="getDataOptions.placedAnOrder.pageSize"
              :pager-count="5"
              @current-change="pageChange($event, '已下单')"
              layout="prev, pager, next"
              :total="placeOrderTotal">
            </el-pagination>
          </div>
        </div>
        <!--香港仓-->
        <div class="detail-content"
             ref="xg"
             v-show="showXG">
          <div class="topBar">
            <div class="topBar-main xg">
              <img src="/static/img/xianggangcangku.png" class="xgIcon"/>
              <div>香港仓库 ( {{xgTotal}} )</div>
            </div>
            <img src="/static/img/shanchu.png"
                 @click="hiddenXG"
                 class="closeIcon">
          </div>
          <div class="center-content"
               v-loading="xgLoad"
               @click.stop
               @mousewheel.stop>
            <div class="list-item"
                 v-for="item in XGwarehouseList"
                 :key="item.itemId">
              <div class="item-title">
                订单编号: {{item.fsImportOrderNo}}
                <el-tooltip effect="dark"
                            content="订单轨迹"
                            placement="right">
                  <div class="pathIcon" @click="jumpOrderPath(item.fsImportOrderNo)"></div>
                </el-tooltip>
              </div>
              <div class="item">
                下单时间: {{item.orderDate}}
              </div>
              <div class="two-item">
                <div class="item1">
                  总订单数: {{item.quantity}}{{item.unit}}
                </div>
                <div class="item2">
                  收货数量: {{item.receiveQuantity}}{{item.unit}}
                </div>
              </div>
              <div class="item">
                收货时间: {{item.receiveGoodsTime}}
              </div>
            </div>
          </div>
          <div class="bottomBar">
            <el-pagination
              :page-size="getDataOptions.XGwarehouse.pageCount"
              :current-page.sync="getDataOptions.XGwarehouse.pageSize"
              :pager-count="5"
              @current-change="pageChange($event, '香港仓')"
              layout="prev, pager, next"
              :total="xgTotal">
            </el-pagination>
          </div>
        </div>
        <!--深圳仓-->
        <div class="detail-content"
             ref="sz"
             v-show="showSZ">
          <div class="topBar">
            <div class="topBar-main sz">
              <img src="/static/img/shenzhencangku.png" class="szIcon"/>
              <div>深圳仓库 ( {{szTotal}} )</div>
            </div>
            <img src="/static/img/shanchu.png"
                 @click="hiddenSZ"
                 class="closeIcon">
          </div>
          <div class="center-content"
               v-loading="szLoad"
               @click.stop
               @mousewheel.stop>
            <div class="list-item"
                 v-for="item in SZwarehouseList"
                 :key="item.itemId">
              <div class="item-title">
                订单编号: {{item.fsImportOrderNo}}
                <el-tooltip effect="dark"
                            content="订单轨迹"
                            placement="right">
                  <div class="pathIcon" @click="jumpOrderPath(item.fsImportOrderNo)"></div>
                </el-tooltip>
              </div>
              <div class="item">
                下单时间: {{item.orderDate}}
              </div>
              <div class="two-item">
                <div class="item1">
                  总订单数: {{item.quantity}}{{item.unit}}
                </div>
                <div class="item2">
                  收货数量: {{item.receiveQuantity}}{{item.unit}}
                </div>
              </div>
              <div class="item">
                收货时间: {{item.receiveGoodsTime}}
              </div>
            </div>
          </div>
          <div class="bottomBar">
            <el-pagination
              :page-size="getDataOptions.SZwarehouse.pageCount"
              :current-page.sync="getDataOptions.SZwarehouse.pageSize"
              :pager-count="5"
              @current-change="pageChange($event, '深圳仓')"
              layout="prev, pager, next"
              :total="szTotal">
            </el-pagination>
          </div>
        </div>
        <!--深圳仓简标签-->
        <div class="label-1 flex-content"
             ref="szLabel"
             @click.stop="showSZ = true"
             v-show="!showSZ">
          <img src="/static/img/shenzhencangku.png" class="szIcon"/>
          <div>深圳仓库 ( {{szTotal}} )</div>
          <div class="downPullIcon"></div>
        </div>
        <!--香港仓简标签-->
        <div class="label-1 flex-content"
             ref="xgLabel"
             @click.stop="showXG = true"
             v-show="!showXG">
          <img src="/static/img/xianggangcangku.png" class="xgIcon"/>
          <div>香港仓库 ( {{xgTotal}} )</div>
          <div class="downPullIcon"></div>
        </div>
        <!--已下单简标签-->
        <div class="label-1 flex-content"
             ref="placeOrderLabel"
             @click.stop="showPlaceOrder = true"
             v-show="!showPlaceOrder"
             style="background: #aaa;width: 206px;">
          <img src="/static/img/yixiadan.png" class="placeOrderIcon"/>
          <div>已下单 ( {{placeOrderTotal}} )</div>
          <div class="downPullIcon"></div>
        </div>
        <!--送货签收简标签-->
        <div class="label-2"
             ref="sendOfSignLabel"
             @click.stop="showSendOfSign = true"
             v-show="!showSendOfSign">
          <div class="flex-content">
            <img src="/static/img/yifahuo.png" class="sendGoodsIcon"/>
            <div>深圳送货</div>
            <img src="/static/img/songda.png" class="sendIcon"/>
            <div>送达地址</div>
            <div class="downPullIcon"></div>
          </div>
          <div class="tag-content">
            <div class="tag-item1">运输中 ( {{sendTotal}} )</div>
            <div class="tag-item2">已签收 ( {{signTotal}} )</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
const BMap = window.BMap
/**
 * vue组件嵌入地图组件类
 * 参数
 * el 嵌入的dom元素
 * point Bmap的point类
 * topMove 嵌入的元素向上移动的像素
 * */
function IMP(el, point, topOfBottomMove = 0, rightOfLeft = 0) {
  this._el = el
  this._point = point
  this._topOfBottomMove = topOfBottomMove
  this._rightOfLeft = rightOfLeft
}
IMP.prototype = new BMap.Overlay()
IMP.prototype.initialize = function(map) {
  // 保存map对象实例
  this._map = map
  // 将el添加到覆盖物容器中
  const el = this._el
  el.style.position = 'absolute'
  map.getPanes().labelPane.appendChild(el)
  return el
}
IMP.prototype.draw = function() {
  // 根据地理坐标转换为像素坐标，并设置给容器
  let position = this._map.pointToOverlayPixel(this._point)
  // 纠正位置
  this._el.style.left = position.x + this._rightOfLeft + 'px'
  this._el.style.top = position.y + this._topOfBottomMove + 'px'
}

export default {
  data() {
    const DATE = new Date()
    const currentDate = `${DATE.getFullYear()}-${DATE.getMonth() + 1}-${DATE.getDate()}`
    return {
      map: '',
      warehouseAddress: { // 宝安仓库经纬度
        lng: 113.793677,
        lat: 22.712261
      },
      xianggangWarehouseAddress: { // 香港仓库经纬度
        lng: 114.219276,
        lat: 22.394942
      },
      placeOrderAddress: { // 已下单经纬度
        lng: 114.560129,
        lat: 22.162595
      },
      sendGoodsAddress: { // 发货点经纬度
        lng: 113.615256,
        lat: 22.880764
      },
      showXG: false, // 香港详细信息
      showSZ: false, // 深圳详细信息
      showPlaceOrder: false, // 已下单详细信息
      showSendOfSign: false, // 送货及签收详细信息
      XGwarehouseList: [], // 对应时间段的实时香港仓库列表
      SZwarehouseList: [], // 对应时间段的实时深圳仓库列表
      placedAnOrderList: [], // 对应时间段的实时已下单列表
      sendGoodsList: [], // 对应时间段的实时送货中列表
      signGoodsList: [], // 对应时间段的实时签收列表
      getDataOptions: { // 获取数据项
        XGwarehouse: { // 香港仓列表参数
          pageCount: 10,
          pageSize: 1
        },
        SZwarehouse: { // 深圳仓列表参数
          pageCount: 10,
          pageSize: 1
        },
        placedAnOrder: { // 已下单列表参数
          pageCount: 10,
          pageSize: 1
        },
        sendGoods: { // 送货列表参数
          pageCount: 10,
          pageSize: 1,
          logisticStatus: '0'
        },
        signGoods: { // 签收列表参数
          pageCount: 10,
          pageSize: 1,
          logisticStatus: '1'
        }
      },
      placeOrderTotal: 0, // 已下单总数
      szTotal: 0, // 深圳仓总数
      xgTotal: 0, // 香港仓总数
      sendTotal: 0, // 送达总数
      signTotal: 0, // 签收总数
      placeOrderLoad: false, // 已下单加载状态
      szLoad: false, // 深圳仓加载状态
      xgLoad: false, // 香港仓加载状态
      sendLoad: false, // 送达加载状态
      signLoad: false, // 签收加载状态
      currentDate, // 今天
      realTimeRange: [currentDate, currentDate], // 实时订单的时间范围
      currentTag: true, // 运送与签收列表当前对应标签
      showPath: false
    }
  },
  mounted() {
    // 初始化数据获取
    this.mapsInit()
    // 绘制各节点
    this.warehouseMark()
    // 初始化绘制信息窗
    this.implantAll()
    // 获取全部信息
    this.getAllData()
  },
  methods: {
    /**
     * 跳转订单轨迹
     * */
    jumpOrderPath(orderNumber) {
      if (orderNumber) {
        this.$router.push({ path: '/import/logisticsDetail', query: { orderNumber }})
      } else {
        this.$router.push({ path: '/import/logisticsDetail' })
      }
    },
    /**
     * 改变事件拉取数据
     * */
    changeDate() {
      // 重置拉取数据选项
      Object.assign(this.$data.getDataOptions, this.$options.data().getDataOptions)
      // 获取全部信息
      this.getAllData()
    },
    /**
     * vue嵌入地图处理
     * */
    implant(el, point, topOfBottomMove = 0, rightOfLeft = 0) {
      let ov = new IMP(el, point, topOfBottomMove, rightOfLeft)
      this.map.addOverlay(ov)
    },
    /**
     * 嵌入各详细信息
     * */
    implantAll() {
      const _this = this
      // 已下单
      const placeOrderPoint = new BMap.Point(_this.placeOrderAddress.lng, _this.placeOrderAddress.lat)
      this.implant(this.$refs.placeOrder, placeOrderPoint, 0, -170)
      this.implant(this.$refs.placeOrderLabel, placeOrderPoint, -82, -115)
      // 香港仓
      const zhilongPoint = new BMap.Point(_this.xianggangWarehouseAddress.lng, _this.xianggangWarehouseAddress.lat)
      this.implant(this.$refs.xg, zhilongPoint, -582, -170)
      this.implant(this.$refs.xgLabel, zhilongPoint, -82, -125)
      // 深圳仓
      const baoanPoint = new BMap.Point(_this.warehouseAddress.lng, _this.warehouseAddress.lat)
      this.implant(this.$refs.sz, baoanPoint, 0, -170)
      this.implant(this.$refs.szLabel, baoanPoint, -82, -125)
      // 送货及签收
      const sendGoodsPoint = new BMap.Point(_this.sendGoodsAddress.lng, _this.sendGoodsAddress.lat)
      this.implant(this.$refs.sendOfSign, sendGoodsPoint, -582, -170)
      this.implant(this.$refs.sendOfSignLabel, sendGoodsPoint, -134, -150)
    },
    /**
     * 隐藏已下单详细信息
     * */
    hiddenPlaceOrder() {
      // 隐藏详情
      this.showPlaceOrder = false
    },
    /**
     * 隐藏深圳详细信息
     * */
    hiddenSZ() {
      // 隐藏详情
      this.showSZ = false
    },
    /**
     * 隐藏香港详细信息
     * */
    hiddenXG() {
      // 隐藏详情
      this.showXG = false
    },
    /**
     * 隐藏送货及签收详细信息
     * */
    hiddenSendOfSign() {
      // 隐藏详情
      this.showSendOfSign = false
    },
    /**
     * 获取全部信息
     * */
    getAllData() {
      this.getSzData()
      this.getXgData()
      this.getPlaceOrderData()
      this.getSendData()
      this.getSignData()
    },
    /**
     * 获取深圳仓
     * */
    getSzData() {
      this.szLoad = true
      let startDate = ''
      let endDate = ''
      if (this.realTimeRange && this.realTimeRange.length) {
        startDate = this.realTimeRange[0]
        endDate = this.realTimeRange[1]
      }
      const dateObj = { startDate, endDate }
      const SZwarehouseJson = Object.assign(_.clone(this.getDataOptions.SZwarehouse), dateObj)
      this.$axios.post('/intelligence/vehicle/szReceivedOrder/list', SZwarehouseJson).then((res) => {
        this.SZwarehouseList = res.data.list
        this.szTotal = res.data.total
        this.szLoad = false
      }).catch((err) => {
        this.szLoad = false
        console.log(err)
      })
    },
    /**
     * 获取香港仓
     * */
    getXgData() {
      this.xgLoad = true
      let startDate = ''
      let endDate = ''
      if (this.realTimeRange && this.realTimeRange.length) {
        startDate = this.realTimeRange[0]
        endDate = this.realTimeRange[1]
      }
      const dateObj = { startDate, endDate }
      const XGwarehouseJson = Object.assign(_.clone(this.getDataOptions.XGwarehouse), dateObj)
      this.$axios.post('/intelligence/vehicle/hkReceivedOrder/list', XGwarehouseJson).then((res) => {
        this.XGwarehouseList = res.data.list
        this.xgTotal = res.data.total
        this.xgLoad = false
      }).catch((err) => {
        this.xgLoad = false
        console.log(err)
      })
    },
    /**
     * 获取已下单
     * */
    getPlaceOrderData() {
      this.placeOrderLoad = true
      let startDate = ''
      let endDate = ''
      if (this.realTimeRange && this.realTimeRange.length) {
        startDate = this.realTimeRange[0]
        endDate = this.realTimeRange[1]
      }
      const dateObj = { startDate, endDate }
      const placeOrderJson = Object.assign(_.clone(this.getDataOptions.placedAnOrder), dateObj)
      this.$axios.post('/intelligence/vehicle/placedOrder/list', placeOrderJson).then((res) => {
        this.placedAnOrderList = res.data.list
        this.placeOrderTotal = res.data.total
        this.placeOrderLoad = false
      }).catch((err) => {
        console.log(err)
        this.placeOrderLoad = false
      })
    },
    /**
     * 获取运输中
     * */
    getSendData() {
      this.sendLoad = true
      let startDate = ''
      let endDate = ''
      if (this.realTimeRange && this.realTimeRange.length) {
        startDate = this.realTimeRange[0]
        endDate = this.realTimeRange[1]
      }
      const dateObj = { startDate, endDate }
      const sendGoodsJson = Object.assign(_.clone(this.getDataOptions.sendGoods), dateObj)
      this.$axios.post('/intelligence/vehicle/szDeliverOrder/list', sendGoodsJson).then((res) => {
        this.sendGoodsList = res.data.list
        this.sendTotal = res.data.total
        this.sendLoad = false
      }).catch((err) => {
        this.sendLoad = false
        console.log(err)
      })
    },
    /**
     * 获取已签收
     * */
    getSignData() {
      this.signLoad = true
      let startDate = ''
      let endDate = ''
      if (this.realTimeRange && this.realTimeRange.length) {
        startDate = this.realTimeRange[0]
        endDate = this.realTimeRange[1]
      }
      const dateObj = { startDate, endDate }
      const signGoodsJson = Object.assign(_.clone(this.getDataOptions.signGoods), dateObj)
      this.$axios.post('/intelligence/vehicle/szDeliverOrder/list', signGoodsJson).then((res) => {
        this.signGoodsList = res.data.list
        this.signTotal = res.data.total
        this.signLoad = false
      }).catch((err) => {
        this.signLoad = false
        console.log(err)
      })
    },
    /**
     * 分页组件当前页改变事件
     * */
    pageChange(currentIndex, type) {
      // 已下单
      if (type === '已下单') {
        this.getPlaceOrderData()
      // 香港仓
      } else if (type === '香港仓') {
        this.getXgData()
      // 深圳仓
      } else if (type === '深圳仓') {
        this.getSzData()
      // 运送
      } else if (type === '运送') {
        this.getSendData()
      // 签收
      } else if (type === '签收') {
        this.getSignData()
      }
    },
    /**
       * 创建订单查询各节点mark
       * */
    warehouseMark() {
      const _this = this
      // 创建宝安仓/香港仓/已下单/发货节点mark
      const baoanPoint = new BMap.Point(_this.warehouseAddress.lng, _this.warehouseAddress.lat)
      const zhilongPoint = new BMap.Point(_this.xianggangWarehouseAddress.lng, _this.xianggangWarehouseAddress.lat)
      const placeOrderPoint = new BMap.Point(_this.placeOrderAddress.lng, _this.placeOrderAddress.lat)
      const sendGoodsPoint = new BMap.Point(_this.sendGoodsAddress.lng, _this.sendGoodsAddress.lat)
      const size = new BMap.Size(24, 24)
      const icon = new BMap.Icon('/static/img/dian.png', size)
      const graySize = new BMap.Size(20, 20)
      const grayIcon = new BMap.Icon('static/img/dian2.png', graySize)
      icon.imageSize = size
      grayIcon.imageSize = graySize
      const marker1 = new BMap.Marker(baoanPoint, {
        icon,
        title: '富森深圳仓库'
      })
      const marker2 = new BMap.Marker(zhilongPoint, {
        icon,
        title: '富森香港仓库'
      })
      const marker3 = new BMap.Marker(placeOrderPoint, {
        icon: grayIcon,
        title: '已下单'
      })
      const marker4 = new BMap.Marker(sendGoodsPoint, {
        icon,
        title: '深圳送货'
      })
      // 绘制mark点
      marker1.setZIndex(20)
      marker2.setZIndex(25)
      marker3.setZIndex(26)
      marker4.setZIndex(27)
      // 纠正mark点的偏移量
      marker1.setOffset(new BMap.Size(-12, -12))
      marker2.setOffset(new BMap.Size(-12, -12))
      marker3.setOffset(new BMap.Size(-12, -12))
      marker4.setOffset(new BMap.Size(-12, -12))
      // 添加至地图上
      this.map.addOverlay(marker1)
      this.map.addOverlay(marker2)
      this.map.addOverlay(marker3)
      this.map.addOverlay(marker4)
    },
    /**
       * 初始化地图
       * 初始定位/打开滚轮缩放
       * */
    mapsInit() {
      this.map = new BMap.Map('mapsChart', {
        enableHighResolution: true
      })
      const point = new BMap.Point(113.893157, 22.714588)
      this.map.centerAndZoom(point, 10)
      // 创建点坐标
      // 开启滚动
      this.map.enableScrollWheelZoom(true)
    }
  }
}
</script>

<style scoped lang="scss">
  .content-wrapper{
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 0px;
    font-family: "Microsoft YaHei";
    /*地图*/
    .maps-content{
      box-sizing: border-box;
      height: 100%;
      .maps{
        width: 100%;
        height: 100%;
      }
      .reload-content{
        position: fixed;
        bottom: 100px;
        right: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 52px;
        background: #fff;
        border-radius: 50%;
        cursor: pointer;
        .reload{
          width: 25px;
          height: 30px;
        }
      }
    }
    /*详情列表*/
    .detail-content{
      width: 320px;
      height: 550px;
      background: #fff;
      border-radius: 5px;
      z-index: 222;
      .topBar{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 54px;
        width: 320px;
        background: #339FF3;
        border-radius: 5px 5px 0 0;
        .topBar-main{
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 54px;
          font-size: 17px;
          color: #fff;
          /*已下单*/
          &.placeOrder{
            min-width: 160px;
            .placeOrderIcon{
              width: 33px;
              height: 33px;
              margin-left: 16px;
            }
          }
          /*深圳仓*/
          &.sz{
            width: 170px;
            .szIcon{
              width: 35px;
              height: 35px;
              margin-left: 16px;
            }
          }
          /*香港仓*/
          &.xg{
            width: 170px;
            .xgIcon{
              width: 35px;
              height: 35px;
              margin-left: 16px;
            }
          }
          /*送货及已签收*/
          &.sendOfSign{
            width: 240px;
            .sendGoodsIcon{
              width: 40px;
              height: 33px;
              margin-left: 14px;
            }
            .sendIcon{
              width: 21px;
              height: 9px;
            }
          }
        }
        .closeIcon{
          box-sizing: border-box;
          width: 15px;
          height: 15px;
          margin-right: 20px;
          cursor: pointer;
        }
      }
      .center-content{
        width: 320px;
        height: 452px;
        overflow-y: auto;
        overflow-x: hidden;
        /*已下单/香港仓/深圳仓通用列表样式*/
        .list-item{
          position: relative;
          box-sizing: border-box;
          width: 320px;
          padding: 16px 20px;
          cursor: pointer;
          /*项底部虚线*/
          &:after{
            position: absolute;
            bottom: 0;
            left: 10px;
            display: block;
            content: '';
            width: 300px;
            border-bottom: 1px dashed #F4F4F4;
          }
          /*悬停样式*/
          &:hover{
            background: #C9E8FA;
          }
          /*订单号样式*/
          .item-title{
            box-sizing: border-box;
            position: relative;
            width: 100%;
            margin-bottom: 12px;
            padding-left: 17px;
            font-size: 14px;
            color: #333;
            &:before{
              display: block;
              content: '';
              position: absolute;
              left: 0;
              top: 1px;
              width: 12px;
              height: 15px;
              background: url("/static/img/dingdan.png") 100% no-repeat;
            }
            .pathIcon{
              position: absolute;
              right: 0;
              top: 2px;
              width: 12px;
              height: 17px;
              background: url("/static/img/guiji-.png") 100% no-repeat;
              cursor: pointer;
              &:hover{
                background: url("/static/img/guiji-xuanfu.png") 100% no-repeat;
              }
            }
          }
          /*通用单项样式*/
          .item{
            margin-bottom: 8px;
            font-size: 12px;
            color: #777;
          }
          /*单行双项样式*/
          .two-item{
            display: flex;
            align-items: center;
            width: 100%;
            margin-bottom: 8px;
            font-size: 12px;
            color: #777;
            .item1{}
            .item2{
              margin-left: 18px;
            }
          }
          /*消除最后一个元素的下外边距*/
          div:last-child{
            margin-bottom: 0;
          }
        }
        /*送货及签收列表样式*/
        .tag-conetnt{
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 42px;
          width: 320px;
          font-size: 14px;
          color: #666;
          text-align: center;
          border-bottom: 1px solid #f4f4f4;
          cursor: pointer;
          .tag1{
            flex: 1;
            position: relative;
            height: 42px;
            line-height: 42px;
            &.active{
              color: #339ff3;
            }
            &:after{
              position: absolute;
              right: 0;
              top: 11px;
              display: block;
              content: '';
              height: 20px;
              border-right: 1px solid #EBEBEB;
            }
          }
          .tag2{
            flex: 1;
            height: 42px;
            line-height: 42px;
            &.active{
              color: #339ff3;
            }
          }
        }
        /*送货及签收的内容*/
        .content{
          height: 410px;
          overflow: auto;
          .sendOfSign-item{
            position: relative;
            padding: 15px 20px;
            cursor: pointer;
            &:after{
              position: absolute;
              bottom: 0;
              left: 10px;
              display: block;
              content: '';
              width: 300px;
              border-bottom: 1px dashed #F4F4F4;
            }
            &:hover{
              background: #C9E8FA;
              .time-content{
                background-color: #C9E8FA!important;
              }
            }
            /*送货签收详情首行*/
            .item-title{
              box-sizing: border-box;
              position: relative;
              width: 100%;
              height: 20px;
              padding-left: 17px;
              font-size: 14px;
              color: #333;
              &:before{
                display: block;
                content: '';
                position: absolute;
                left: 0;
                top: 1px;
                width: 12px;
                height: 15px;
                background: url("/static/img/dingdan.png") 100% no-repeat;
              }
              .tag{
                display: inline-block;
                padding: 2px;
                margin-left: 5px;
                font-size: 12px;
                color: #339ff3;
                border: 1px solid #339ff3;
              }
              .topPull{
                transition: all .2s linear;
                position: absolute;
                right: 24px;
                top: -3px;
                width: 25px;
                height: 28px;
                color: #AAAAAA;
                transform: rotate(180deg);
                cursor: pointer;
                .svg-icon{
                  width: 100%;
                  height: 100%;
                  vertical-align: middle;
                }
                &:hover{
                  .svg-icon{
                    color: #339FF3;
                  }
                }
                &.active{
                  transform: rotate(0);
                }
              }
              .pathIcon{
                position: absolute;
                right: 0;
                top: 2px;
                width: 12px;
                height: 17px;
                background: url("/static/img/guiji-.png") 100% no-repeat;
                cursor: pointer;
                &:hover{
                  background: url("/static/img/guiji-xuanfu.png") 100% no-repeat;
                }
              }
            }
            .item{
              margin-top: 10px;
              font-size: 12px;
              color: #777;
              &:first-child{
                margin-top: 19px;
              }
            }
            .two-item{
              display: flex;
              align-items: center;
              width: 100%;
              margin-top: 10px;
              font-size: 12px;
              color: #777;
              .item1{}
              .item2{
                margin-left: 18px;
              }
            }
            /*物流信息*/
            .logisticsMsg{
              position: relative;
              width: 100%;
              margin-top: 14px;
              .takeGoodsAddress{
                width: 100%;
                z-index: 230;
                position: relative;
                .circle{
                  position: absolute;
                  left: 20px;
                  top: 0;
                  width: 28px;
                  height: 28px;
                  line-height: 28px;
                  border-radius: 50%;
                  background-color: #339FF3;
                  color: #fff;
                  font-size: 16px;
                  text-align: center;
                }
                .text{
                  display: flex;
                  align-items: center;
                  margin-left: 80px;
                  min-height: 28px;
                  font-size: 12px;
                  color: #333333;
                }
              }
              /*竖线*/
              &:after{
                z-index: 224;
                position: absolute;
                left: 35px;
                top: 0;
                display: block;
                content: '';
                height: 100%;
                width: 1px;
                background: #eee;
              }
              .logisticsItem{
                position: relative;
                width: 100%;
                padding: 20px 0;
                .time-content{
                  z-index: 225;
                  position: absolute;
                  left: 0;
                  top: 20px;
                  width: 70px;
                  height: 30px;
                  background-color: #fff;
                  color: #333;
                  text-align: center;
                  .time{
                    height: 14px;
                    font-size: 14px;
                  }
                  .date{
                    margin-top: 2px;
                    height: 14px;
                    font-size: 12px;
                  }
                }
                .route-msg{
                  box-sizing: border-box;
                  min-height: 32px;
                  width: 100%;
                  line-height: 100%;
                  padding-left: 79px;
                  font-size: 12px;
                  color: #333;
                }
                &.gray{
                  .route-msg, .time-content{
                    color: #aaa!important;
                  }
                }
              }
              .showRouteMsg{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin-top: 4px;
                font-size: 12px;
                color: #bbb;
                .showIcon{
                  width: 15px;
                  height: 15px;
                  margin-left: 10px;
                }
              }
            }
          }
        }
      }
      .bottomBar{
        height: 44px;
        width: 320px;
        text-align: center;
        line-height: 44px;
        border-top: 1px solid #F5F5F5;
        color: #787878!important;
      }
    }
  }
</style>
<!--地图信息窗样式-->
<style lang="scss">
  .bmap-content{
    .BMap_bubble_title{
      /*<!--信息窗title样式-->*/
      width: 100%;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      color: #000;
    }
    .BMap_bubble_content{
      font-size: 14px;
      color: #000;
    }
    .mark-msg-content{
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      .mark-msg-item{
        flex: 0 0 50%;
        font-size: 14px;
        margin-top: 10px;
      }
      /*车次号*/
      .mark-car-number, .mark-diff-addres, .mark-address, .mark-time{
        flex: 0 0 100%;
      }
    }
    .picker-date{
      .el-icon-date{
        margin-right: 5px;
      }
      .el-range__close-icon{
        width: 0;
      }
    }
    .el-range-separator{
      display: inline-block;
      width: 30px!important;
    }
    .change-page-tag{
      position: absolute;
      left: 384px;
      top: 12px;
      display: flex;
      align-items: center;
      width: 116px;
      height: 48px;
      font-size: 16px;
      color: #333;
      background: #fff;
      border-radius: 5px;
      z-index: 111;
      cursor: pointer;
      .pathText{
        position: absolute;
        width: 116px;
        height: 48px;
        line-height: 48px;
        top: 48px;
        left: 0px;
        border-top: 1px dashed #ccc;
        border-radius: 8px;
        text-align: center;
        background-color: #fff;
        &:hover{
          background-color: #C9E8FA;
        }
      }
      .text{
        margin-left: 14px;
      }
      .pulldown-icon{
        width: 16px;
        height: 10px;
        margin-left: 10px;
      }
    }
    .datePick-content{
      position: absolute;
      left: 24px;
      top: 12px;
      border-radius: 10px;
      background: #fff;
    }
    .bottom-line-left{
      z-index: 111;
      position: absolute;
      left: 30px;
      bottom: 8px;
      width: 108px;
      height: 1px;
      background-color: #F3F3F3;
    }
    .bottom-line-right{
      z-index: 111;
      position: absolute;
      right: 40px;
      bottom: 8px;
      width: 108px;
      height: 1px;
      background-color: #F3F3F3;
    }
    .realTimeDatePick{
      position: relative;
      border: none;
      border-radius: 5px!important;
      width: 340px!important;
      height: 48px;
      padding: 3px 0 !important;
      padding-left: 21px!important;
      color: #999;
      &:after{
        position: absolute;
        left: 30px;
        top: 16px;
        content: '';
        width: 13px;
        height: 15px;
        background: url("/static/img/rili.png");
        background-size: 13px 15px;
      }
      &:before{
        z-index: 110;
        position: absolute;
        left: 194px;
        top: 16px;
        content: '';
        width: 13px;
        height: 15px;
        background: url("/static/img/rili.png");
        background-size: 13px 15px;
      }
      .el-range-separator{
        line-height: 42px;
        width: 44px!important;
        color: #999;
      }
      .el-range-input{
        position: relative;
        color: #333333;
        width: 95px;
        margin-left: 24px;
      }
      .el-input__icon.el-range__icon.el-icon-date{
        display: none;
      }
    }
    /*标题*/
    ::-webkit-scrollbar-button{
      width: 6px!important;
    }
    ::-webkit-scrollbar{
      height: 6px;
      width: 6px;
    }
    ::-webkit-scrollbar-button{
      width: 0;
      height: 0;
    }
    ::-webkit-scrollbar-thumb{
      background: #ccc;
    }
    ::-webkit-scrollbar-track {
      background-color: #f1f1f1;
    }
    .flex-content{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tag-content{
      height: 46px;
      display: flex;
      font-size: 14px;
      text-align: center;
      background: #fff;
      color: #333;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      .tag-item1{
        flex: 1;
        height: 46px;
        line-height: 46px;
        border-right: 1px solid #e7e7e7;
      }
      .tag-item2{
        flex: 1;
        height: 46px;
        line-height: 46px;
      }
    }
    .label-1{
      width: 242px;
      height: 52px;
      border-radius: 27px;
      font-size: 18px;
      background: #339FF3;
      cursor: pointer;
      color: #fff;
      .szIcon{
        width: 35px;
        height: 35px;
        margin-left: 16px;
      }
      .xgIcon{
        width: 35px;
        height: 35px;
        margin-left: 16px;
      }
      .placeOrderIcon{
        width: 33px;
        height: 33px;
        margin-left: 16px;
      }
    }
    .downPullIcon{
      width: 20px;
      height: 24px;
      margin-right: 18px;
      background: url("/static/img/fahuo-songda-xiala.png") no-repeat center;
      background-size: 20px 12px;
    }
    .label-2{
      width: 278px;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      cursor: pointer;
      color: #fff;
      .flex-content{
        height: 54px;
        background: #339FF3;
        font-size: 17px;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        .sendGoodsIcon{
          width: 40px;
          height: 33px;
          margin-left: 14px;
        }
        .sendIcon{
          width: 21px;
          height: 9px;
        }
      }
    }
  }
</style>
