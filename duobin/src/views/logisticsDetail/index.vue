<template>
  <div style="width: 100%;min-height: 500px;height: 100%;">
    <div class="content-wrapper bmap-content">
      <!--地图-->
      <div class="maps-content">
        <div id="mapsChart" class="maps"></div>
        <!--搜索框-->
        <div class="datePick-content">
          <el-autocomplete class="search"
                           placeholder="请输入订单号"
                           :fetch-suggestions="searchOrder"
                           @select="handleSelect"
                           v-model="keyword">
            <img slot="suffix" src="/static/img/sousuo.png" class="sousuo"/>
          </el-autocomplete>
          <div class="search-content"
               :style="{height: loadPath ? '400px' : 'auto'}"
               v-loading="loadPath">
            <!--已下单-->
            <div class="search-item"
                 v-for="(item, index) in pathObj.placedOrderList"
                 :key="item.iid">
              <div class="text-item">
                已下单<img src="/static/img/quwang2.png" class="quwan2">香港已收货
              </div>
              <div class="number"
                   v-show="pathObj.placedOrderList.length > 1">第{{index + 1}}批</div>
              <el-tooltip effect="dark"
                          content="订单轨迹"
                          placement="right">
                <div class="pathIcon"
                     @click="drawHandle(item, 1)"></div>
              </el-tooltip>
            </div>
            <!--香港收货-->
            <div class="search-item"
                 v-for="(item, index) in pathObj.hkReceivedList"
                 :key="item.iid">
              <div class="text-item">
                香港已收货<img src="/static/img/quwang2.png" class="quwan2">香港已出车
              </div>
              <div class="number"
                   v-show="pathObj.hkReceivedList.length > 1">第{{index + 1}}批</div>
              <el-tooltip effect="dark"
                          content="订单轨迹"
                          placement="right">
                <div class="pathIcon"
                     @click="drawHandle(item, 2)"></div>
              </el-tooltip>
            </div>
            <!--香港发货-->
            <div class="search-item"
                 v-for="(item, index) in pathObj.hkDrivedOutList"
                 :key="item.iid">
              <div class="text-item">
                香港已出车<img src="/static/img/quwang2.png" class="quwan2">深圳已收货
              </div>
              <div class="number"
                   v-show="pathObj.hkDrivedOutList.length > 1">第{{index + 1}}批</div>
              <el-tooltip effect="dark"
                          content="订单轨迹"
                          placement="right">
                <div class="pathIcon"
                     @click="drawHandle(item, 3)"></div>
              </el-tooltip>
            </div>
            <!--深圳收货-->
            <div class="search-item"
                 v-for="(item, index) in pathObj.szReceivedList"
                 :key="item.iid">
              <div class="text-item">
                深圳已收货<img src="/static/img/quwang2.png" class="quwan2">深圳已出车
              </div>
              <div class="number"
                   v-show="pathObj.szReceivedList.length > 1">第{{index + 1}}批</div>
              <el-tooltip effect="dark"
                          content="订单轨迹"
                          placement="right">
                <div class="pathIcon"
                     @click="drawHandle(item, 4)"></div>
              </el-tooltip>
            </div>
            <!--深圳发货-->
            <div class="send-item" v-show="pathObj.szDeliveredList.length">
              <div class="title">
                深圳已出车<img src="/static/img/quwang1.png" class="quwan1">送达地址
              </div>
              <div class="inner-item"
                   v-for="(item, index) in pathObj.szDeliveredList"
                   :key="item.iid">
                <div class="circleNumber">{{index + 1}}</div>
                {{item.deliverGoodsType}} {{item.cNo}}
                <el-tooltip effect="dark"
                            content="订单轨迹"
                            placement="right">
                  <div class="pathIcon" @click="drawHandle(item, 5)"></div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <!--地图切换-->
        <div class="change-page-tag"
             @mouseout="showPath = false"
             @mouseover="showPath = true">
          <div class="text">
            订单轨迹
          </div>
          <img src="/static/img/dingdanweizhi-xiala.png" class="pulldown-icon">
          <router-link v-show="showPath"
                       to="/import/logisticsSearch"
                       class="pathText">订单位置
          </router-link>
        </div>
        <!--物流信息列表-->
        <div class="logisticsMsg-content"
             ref="logisticsMsg"
             @click.stop
             @mousewheel.stop
             v-show="logisticsMsg.addressInfoList">
          <div class="logisticsMsg"
               @click.stop
               @mousewheel.stop>
            <div class="takeGoodsAddress">
              <div class="circle">收</div>
              <div class="text">[收货地址] {{logisticsMsg.receiveAddress}}</div>
            </div>
            <div class="logisticsItem"
                 v-for="(route, index) in logisticsMsg.addressInfoList"
                 :key="index"
                 v-show="logisticsMsg.showRoute || index === 0"
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
                 @click="$set(logisticsMsg, 'showRoute', !logisticsMsg.showRoute)">
              <div>
                {{logisticsMsg.showRoute ? '收起物流信息' : '点击查看更多物流详情'}}
              </div>
              <img :src="logisticsMsg.showRoute ? '/static/img/shouqi.png' : '/static/img/chakangengduo.png'" class="showIcon">
            </div>
          </div>
        </div>
        <!--已下单简标签-->
        <div class="label-1"
             ref="placeOrderLabel"
             v-show="drawIndex >= 1">
          <div class="flex-content" style="background: #aaa;">
            <img src="/static/img/yixiadan.png"
                 class="placeOrderIcon"/>
            <div class="text">
              <div class="big-text">已下单</div>
              <div class="time">{{currentPathObj.placedOrder.transportTime}}</div>
            </div>
          </div>
          <div class="text-content">
            <div class="item">
              总订单数: {{currentPathObj.placedOrder.quantity}}{{currentPathObj.placedOrder.unit}}
            </div>
            <div class="item">
              富森未发货: {{currentPathObj.placedOrder.noReceiveQuantity}}{{currentPathObj.placedOrder.unit}}
            </div>
          </div>
        </div>
        <!--香港仓简标签-->
        <div class="label-1"
             ref="xgLabel"
             v-show="drawIndex >= 2">
          <div class="flex-content">
            <img src="/static/img/xianggangcangku.png" class="szIcon"/>
            <div class="text">
              <div class="big-text">香港已收货</div>
              <div class="time">{{currentPathObj.hkReceived.transportTime}}</div>
            </div>
          </div>
          <div class="text-content">
            <div class="item">
              收货数量: {{currentPathObj.hkReceived.transportQuantity}}{{currentPathObj.hkReceived.unit}}
            </div>
          </div>
        </div>
        <!--香港发货简标签-->
        <div class="label-1"
             ref="xgfahuoLabel"
             v-show="drawIndex >= 3">
          <div class="flex-content">
            <img src="/static/img/xianggangyichuche.png"
                 class="xgfahuo"/>
            <div class="text">
              <div class="big-text">香港已出车</div>
              <div class="time">{{currentPathObj.hkDrivedOut.transportTime}}</div>
            </div>
          </div>
          <div class="text-content">
            <div class="item">
              运输数量: {{currentPathObj.hkDrivedOut.transportQuantity}}{{currentPathObj.hkDrivedOut.unit}}
            </div>
          </div>
        </div>
        <!--深圳仓简标签-->
        <div class="label-1"
             ref="szLabel"
             v-show="drawIndex >= 4">
          <div class="flex-content">
            <img src="/static/img/shenzhencangku.png"
                 class="szIcon"/>
            <div class="text">
              <div class="big-text">深圳已收货</div>
              <div class="time">{{currentPathObj.szReceived.transportTime}}</div>
            </div>
          </div>
          <div class="text-content">
            <div class="item">
              收货数量: {{currentPathObj.szReceived.transportQuantity}}{{currentPathObj.szReceived.unit}}
            </div>
          </div>
        </div>
        <!--深圳发货简标签-->
        <div class="label-1"
             ref="sendOfSignLabel"
             v-show="drawIndex >= 5">
          <div class="flex-content">
            <img src="/static/img/yifahuo.png"
                 class="szfahuo"/>
            <div class="text">
              <div class="big-text">深圳已出车</div>
              <div class="time">{{currentPathObj.szDelivered.szSendTime}}</div>
            </div>
          </div>
          <div class="text-content">
            <div class="item">
              运输数量: {{currentPathObj.szDelivered.transportQuantity}}{{currentPathObj.szDelivered.unit}}
            </div>
            <div class="item">
              发货方式: {{currentPathObj.szDelivered.deliverGoodsType}}
            </div>
            <div class="item">
              快递单号: {{currentPathObj.szDelivered.cNo}}
            </div>
          </div>
        </div>
        <!--下一节点-->
        <div ref="xgNode" v-show="drawIndex === 1" class="next-node">
          下一节点: 香港已收货
        </div>
        <div ref="xgSendNode" v-show="drawIndex === 2" class="next-node">
          下一节点: 香港已出车
        </div>
        <div ref="szNode" v-show="drawIndex === 3" class="next-node">
          下一节点: 深圳已收货
        </div>
        <div ref="szSendNode" v-show="drawIndex === 4" class="next-node">
          下一节点: 深圳已出车
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      return {
        map: '',
        placeOrderAddress: { // 已下单经纬度
          lng: 114.560129,
          lat: 22.162595
        },
        xianggangWarehouseAddress: { // 香港仓库经纬度
          lng: 114.219276,
          lat: 22.394942
        },
        xianggangSendAddress: { // 香港发货经纬度
          lng: 114.026033,
          lat: 22.535905
        },
        warehouseAddress: { // 深圳仓库经纬度
          lng: 113.793677,
          lat: 22.712261
        },
        sendAddress: { // 深圳发货仓库经纬度
          lng: 114.116869,
          lat: 22.863448
        },
        showPlaceOrder: false, // 已下单
        showXG: false, // 香港收货
        showSendXG: false, // 香港送货
        showSZ: false, // 深圳收货
        showSendSZ: false, // 深圳送货
        showPath: false, // 显示控制标签
        drawIndex: 0, // 绘制长度
        keyword: '', // 搜索关键字
        orderList: [], // 订单列表
        pathObj: { // 轨迹列表
          placedOrderList: [], // 已下单
          hkReceivedList: [], // 香港收货
          hkDrivedOutList: [], // 香港发货
          szReceivedList: [], // 深圳收货
          szDeliveredList: [] // 深圳发货
        },
        currentPathObj: { // 当前显示轨迹对象
          placedOrder: {},
          hkReceived: {},
          hkDrivedOut: {},
          szReceived: {},
          szDelivered: {}
        },
        logisticsMsg: {}, // 物流信息
        loadPath: false, // 列表加载状态
        markArr: [], // mark点实例数组
        lineArr: [] // 线段实例数组
      }
    },
    mounted() {
      // 初始化数据获取
      this.mapsInit()
      // 初始化绘制信息窗
      this.implantAll()
      // 跳转读取事件
      if (this.$route.query.orderNumber) {
        this.getIdData()
      }
    },
    methods: {
      /**
       * 获取对应订单ID的信息
       * */
      getIdData() {
        const keyWord = this.$route.query.orderNumber
        this.keyword = keyWord
        // 先获取订单数据
        this.$axios.get('/intelligence/vehicle/order/search', {
          params: {
            keyWord
          }
        }).then((res) => {
          // 获取订单列表
          this.orderList = res.data
          this.orderList.forEach((val) => {
            val.value = val.fsOrderNo
          })
          this.handleSelect(this.orderList[0])
        }).catch((err) => {
          console.log(err)
        })
      },
      /**
       * 显示对应轨迹处理
       * */
      drawHandle(item, index) {
        // 清除地图覆盖物
        this.clearMapShow()
        // drawIndex值判定
        this.drawIndex = index
        const _this = this
        // 处理总体数据
        const keyArr = [
          'placedOrder',
          'hkReceived',
          'hkDrivedOut',
          'szReceived',
          'szDelivered'
        ]
        // 根据数值拼接数据
        const itemArr = {
          placedOrder: {},
          hkReceived: {},
          hkDrivedOut: {},
          szReceived: {},
          szDelivered: {}
        }
        // 叠加数据
        keyArr.map((val, i) => {
          if (i <= index) {
            if (Array.isArray(this.pathObj[`${keyArr[i]}List`])) {
              // 获取叠加数据
              let transportQuantity = 0
              let noReceiveQuantity = 0
              let quantity, transportTime, cNo, szSendTime, deliverGoodsType
              _this.pathObj[`${keyArr[i]}List`].map((p) => {
                // 运输数量
                if (p.transportQuantity) {
                  transportQuantity += parseInt(p.transportQuantity)
                }
                // 未送达数量
                if (p.noReceiveQuantity) {
                  noReceiveQuantity += parseInt(p.noReceiveQuantity)
                }
                // 总数
                if (p.quantity) {
                  quantity = p.quantity
                }
                // 时间
                if (p.transportTime) {
                  transportTime = p.transportTime
                }
                // 深圳已出车时间
                if (p.addressInfoList && p.addressInfoList.length) {
                  szSendTime = p.addressInfoList[0].time
                }
                // 单号
                if (p.cNo) {
                  cNo = p.cNo
                }
                // 运输方式
                if (p.deliverGoodsType) {
                  deliverGoodsType = p.deliverGoodsType
                }
              })
              // 叠加数据赋值
              itemArr[keyArr[i]] = {
                transportQuantity,
                noReceiveQuantity,
                quantity,
                transportTime,
                szSendTime,
                cNo,
                deliverGoodsType
              }
            }
          }
        })
        // 赋值数据
        this.currentPathObj = itemArr
        // 赋值物流信息
        if (index === 5) {
          this.logisticsMsg = item
        }
        // 根据数值画点
        this.warehouseMark()
        // 根据数值绘制路线
        this.draw()
      },
      /**
       * 选中对应项事件
       * */
      handleSelect(item) {
        // 搜索框文本对应
        this.keyword = item.value
        // 展示数据框
        this.loadPath = true
        // 搜索对应订单ID的详情
        this.$axios.get('/intelligence/vehicle/order/getOrderLogisticNodeInfo', {
          params: {
            orderId: item.itemId
          }
        }).then((res) => {
          this.pathObj = res.data
          // 每个添加一个ID
          for (let key in this.pathObj) {
            this.pathObj[key].forEach((val) => {
              val.iid = this.$getid()
            })
          }
          this.loadPath = false
        }).catch((err) => {
          this.loadPath = false
          console.log(err)
        })
      },
      /**
       * 搜索订单事件
       * */
      searchOrder(keyWord, callback) {
        if (keyWord) {
          this.$axios.get('/intelligence/vehicle/order/search', {
            params: {
              keyWord
            }
          }).then((res) => {
            // 获取订单列表
            this.orderList = res.data
            this.orderList.forEach((val) => {
              val.value = val.fsOrderNo
            })
            callback(this.orderList)
          }).catch((err) => {
            console.log(err)
          })
        }
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
        this.implant(this.$refs.placeOrderLabel, placeOrderPoint, -140, -110)
        // 香港收货
        const zhilongPoint = new BMap.Point(_this.xianggangWarehouseAddress.lng, _this.xianggangWarehouseAddress.lat)
        this.implant(this.$refs.xgLabel, zhilongPoint, -120, -110)
        this.implant(this.$refs.xgNode, zhilongPoint, -60, -100)
        // 香港发货
        const fahuoPoint = new BMap.Point(_this.xianggangSendAddress.lng, _this.xianggangSendAddress.lat)
        this.implant(this.$refs.xgfahuoLabel, fahuoPoint, -120, -110)
        this.implant(this.$refs.xgSendNode, fahuoPoint, -60, -100)
        // 深圳收货
        const baoanPoint = new BMap.Point(_this.warehouseAddress.lng, _this.warehouseAddress.lat)
        this.implant(this.$refs.szLabel, baoanPoint, -120, -110)
        this.implant(this.$refs.szNode, baoanPoint, -60, -100)
        // 深圳发货
        const sendGoodsPoint = new BMap.Point(_this.sendAddress.lng, _this.sendAddress.lat)
        this.implant(this.$refs.sendOfSignLabel, sendGoodsPoint, -160, -110)
        this.implant(this.$refs.szSendNode, sendGoodsPoint, -60, -100)
        this.implant(this.$refs.logisticsMsg, sendGoodsPoint, -160, 100)
      },
      /**
       * 绘制路线
       * */
      drawLine({ startPoint, endPoint, lineType, linePathType, lineColor }) {
        startPoint = new BMap.Point(startPoint.lng, startPoint.lat)
        endPoint = new BMap.Point(endPoint.lng, endPoint.lat)
        const _this = this
        return new Promise((resolve) => {
          if (linePathType === '汽车') {
            // 绘制导航路线
            const map = _this.map
            const pathDriving = new BMap.DrivingRoute(map, {
              renderOptions: {
                autoViewport: true
              }
            })
            pathDriving.search(startPoint, endPoint)
            pathDriving.setSearchCompleteCallback(() => {
              const pts = pathDriving.getResults().getPlan(0).getRoute(0).getPath()
              const polyline = new BMap.Polyline(pts, { strokeColor: lineColor, strokeOpacity: 1 })
              _this.lineArr.push(polyline)
              map.addOverlay(polyline)
              resolve()
            })
          } else {
            // 绘制直线
            const polyline = new BMap.Polyline([startPoint, endPoint], {
              strokeColor: lineColor,
              strokeStyle: lineType,
              strokeOpacity: 1
            })
            this.map.addOverlay(polyline)
            resolve()
          }
        })
      },
      /**
       * 根据节点长度绘制路线,显示对应标签
       * */
      draw() {
        const _this = this
        // 绘制信息数组
        const drawArr = [
          {
            startPoint: _this.placeOrderAddress,
            endPoint: _this.xianggangWarehouseAddress,
            lineType: 'dashed',
            linePathType: '直线',
            lineColor: '#EEEEEE'
          },
          {
            startPoint: _this.xianggangWarehouseAddress,
            endPoint: _this.xianggangSendAddress,
            lineType: 'solid',
            linePathType: '汽车',
            lineColor: '#4BB0FE'
          },
          {
            startPoint: _this.xianggangSendAddress,
            endPoint: _this.warehouseAddress,
            lineType: 'solid',
            linePathType: '汽车',
            lineColor: '#4BB0FE'
          },
          {
            startPoint: _this.warehouseAddress,
            endPoint: _this.sendAddress,
            lineType: 'solid',
            linePathType: '汽车',
            lineColor: '#4BB0FE'
          }
        ]
        // 绘制线条
        drawArr.map(async function(val, index) {
          if (index < _this.drawIndex) {
            // 绘制路线
            await _this.drawLine(val)
          }
        })
      },
      /**
       * 创建订单查询各节点mark
       * */
      warehouseMark() {
        const _this = this
        // 创建宝安仓/香港仓/已下单/发货节点mark
        const placeOrderPoint = new BMap.Point(_this.placeOrderAddress.lng, _this.placeOrderAddress.lat)
        const zhilongPoint = new BMap.Point(_this.xianggangWarehouseAddress.lng, _this.xianggangWarehouseAddress.lat)
        const xgSendPoint = new BMap.Point(_this.xianggangSendAddress.lng, _this.xianggangSendAddress.lat)
        const baoanPoint = new BMap.Point(_this.warehouseAddress.lng, _this.warehouseAddress.lat)
        const szSendPoint = new BMap.Point(_this.sendAddress.lng, _this.sendAddress.lat)
        const size = new BMap.Size(24, 24)
        const icon = new BMap.Icon('/static/img/dian.png', size)
        const graySize = new BMap.Size(20, 20)
        const grayIcon = new BMap.Icon('static/img/dian2.png', graySize)
        icon.imageSize = size
        grayIcon.imageSize = graySize
        const marker1 = new BMap.Marker(placeOrderPoint, {
          icon: grayIcon,
          title: '已下单'
        })
        const marker2 = new BMap.Marker(zhilongPoint, {
          icon,
          title: '富森香港仓库'
        })
        const marker3 = new BMap.Marker(xgSendPoint, {
          icon,
          title: '香港已出车'
        })
        const marker4 = new BMap.Marker(baoanPoint, {
          icon,
          title: '富森深圳仓库'
        })
        const marker5 = new BMap.Marker(szSendPoint, {
          icon,
          title: '深圳已出车'
        })
        // 绘制mark点
        marker1.setZIndex(20)
        marker2.setZIndex(25)
        marker3.setZIndex(26)
        marker4.setZIndex(27)
        marker5.setZIndex(28)
        // 纠正mark点的偏移量
        marker1.setOffset(new BMap.Size(-12, -12))
        marker2.setOffset(new BMap.Size(-12, -12))
        marker3.setOffset(new BMap.Size(-12, -12))
        marker4.setOffset(new BMap.Size(-12, -12))
        marker5.setOffset(new BMap.Size(-12, -12))
        _this.markArr = [
          marker1,
          marker2,
          marker3,
          marker4,
          marker5
        ]
        // 添加至地图上
        _this.markArr.forEach((mark, i) => {
          if (i <= _this.drawIndex) {
            _this.map.addOverlay(mark)
          }
        })
      },
      /**
       * 清除地图显示
       * */
      clearMapShow() {
        // 清除mark点
        while (this.markArr.length) {
          let item = this.markArr.pop()
          this.map.removeOverlay(item)
        }
        // 清除路线
        while (this.lineArr.length) {
          let item = this.lineArr.pop()
          this.map.removeOverlay(item)
        }
        // 清除物流信息
        this.logisticsMsg = {}
        // 隐藏标签
        this.drawIndex = 0
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
        this.map.centerAndZoom(point, 11)
        // 创建点坐标
        // 开启滚动
        this.map.enableScrollWheelZoom(true)
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 0px;
    font-family: "Microsoft YaHei";
    /*下一节点*/
    .next-node{
      box-sizing: border-box;
      height: 34px;
      line-height: 34px;
      min-width: 184px;
      padding: 0 14px;
      border-radius: 5px;
      font-size: 14px;
      color: #fff;
      background: url("/static/img/xiayizhan-beijing.png") no-repeat 100%;
    }
    /*地图*/
    .maps-content {
      box-sizing: border-box;
      height: 100%;
      .maps {
        width: 100%;
        height: 100%;
      }
    }

    .logisticsMsg-content{
      padding: 16px 8px;
      background: #fff;
      max-height: 360px;
      cursor: pointer;
      border-radius: 5px;
      overflow: auto;
    }
    /*物流信息*/
    .logisticsMsg {
      position: relative;
      width: 340px;
      overflow: auto;
      border-radius: 5px;
      .takeGoodsAddress {
        width: 100%;
        z-index: 230;
        position: relative;
        .circle {
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

        .text {
          display: flex;
          align-items: center;
          margin-left: 80px;
          min-height: 28px;
          font-size: 12px;
          color: #333333;
        }
      }

      /*竖线*/
      &:after {
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

      .logisticsItem {
        position: relative;
        width: 100%;
        padding: 20px 0;
        .time-content {
          z-index: 225;
          position: absolute;
          left: 0;
          top: 20px;
          width: 70px;
          height: 30px;
          background-color: #fff;
          color: #333;
          text-align: center;

          .time {
            height: 14px;
            font-size: 14px;
          }

          .date {
            margin-top: 2px;
            height: 14px;
            font-size: 12px;
          }
        }

        .route-msg {
          box-sizing: border-box;
          min-height: 32px;
          width: 100%;
          line-height: 100%;
          padding-left: 79px;
          font-size: 12px;
          color: #333;
        }

        &.gray {
          .route-msg, .time-content {
            color: #aaa !important;
          }
        }
      }

      .showRouteMsg {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 4px;
        font-size: 12px;
        color: #bbb;

        .showIcon {
          width: 15px;
          height: 15px;
          margin-left: 10px;
        }
      }
    }

    /*标签样式*/
    .flex-content {
      display: flex;
      align-items: center;
    }

    /*标签样式*/
    .label-1 {
      width: 205px;
      height: 108px;
      border-radius: 5px;
      font-size: 18px;
      cursor: pointer;
      color: #fff;
      background: transparent;

      .flex-content {
        width: 100%;
        background: #339FF3;
        padding: 5px 0;
        border-radius: 5px 5px 0 0;

        .placeOrderIcon {
          width: 33px;
          height: 33px;
          margin-left: 12px;
        }

        .szfahuo {
          width: 35px;
          height: 30px;
          margin-left: 12px;
        }

        .xgfahuo {
          width: 35px;
          height: 31px;
          margin-left: 12px;
        }

        .text {
          width: 100%;
          margin-left: 9px;
          color: #fff;

          .big-text {
            font-size: 16px;
          }

          .time {
            margin-top: 2px;
            font-size: 12px;
          }
        }
      }

      .text-content {
        padding: 17px 13px;
        background: #fff;
        border-radius: 0 0 5px 5px;
      }

      .szIcon {
        width: 33px;
        height: 33px;
        margin-left: 16px;
      }

      .xgIcon {
        width: 35px;
        height: 35px;
        margin-left: 16px;
      }

      .item {
        font-size: 12px;
        color: #777;
        margin-top: 8px;

        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
</style>
<!--地图信息窗样式-->
<style lang="scss">
  .bmap-content {
    .BMap_bubble_title {
      /*<!--信息窗title样式-->*/
      width: 100%;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      color: #000;
    }

    .BMap_bubble_content {
      font-size: 14px;
      color: #000;
    }

    .mark-msg-content {
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;

      .mark-msg-item {
        flex: 0 0 50%;
        font-size: 14px;
        margin-top: 10px;
      }

      /*车次号*/
      .mark-car-number, .mark-diff-addres, .mark-address, .mark-time {
        flex: 0 0 100%;
      }
    }

    .picker-date {
      .el-icon-date {
        margin-right: 5px;
      }

      .el-range__close-icon {
        width: 0;
      }
    }

    .el-range-separator {
      display: inline-block;
      width: 30px !important;
    }

    .change-page-tag {
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

      .pathText {
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

        &:hover {
          background-color: #C9E8FA;
        }
      }

      .text {
        margin-left: 14px;
      }

      .pulldown-icon {
        width: 16px;
        height: 10px;
        margin-left: 10px;
      }
    }

    .datePick-content {
      position: absolute;
      left: 24px;
      top: 12px;

      .search {
        height: 50px;
        width: 340px;

        .el-input, .el-input__inner {
          height: 100%;
          width: 340px;
          padding-right: 55px;
          border: none;
          border-radius: 5px;
        }

        .sousuo {
          width: 19px;
          height: 19px;
          margin: 15px 25px 0 0;
        }
      }

      .search-content {
        position: absolute;
        left: 0;
        top: 60px;
        width: 100%;
        background: #fff;
        cursor: pointer;
        .search-item {
          position: relative;
          display: flex;
          align-content: center;
          width: 100%;
          padding: 15px 20px;
          font-size: 12px;
          color: #333;
          &:hover{
            background: #F8FBFE;
          }
          &:after{
            position: absolute;
            left: 2%;
            bottom: 0;
            width: 96%;
            display: block;
            content: '';
            border-bottom: 1px solid #f4f4f4;
          }
          .text-item, number{
            height: 19px;
          }
          .text-item{
            display: flex;
            align-content: center;
            padding-top: 3px;
            box-sizing: border-box;
          }
          .number{
            box-sizing: border-box;
            margin-left: 5px;
            padding: 2px;
            font-size: 12px;
            color: #7AC0F7;
            border: 1px solid #7AC0F7;
          }
          .quwan2{
            width: 36px;
            height: 8px;
            margin: 0 2px;
          }
          .pathIcon{
            position: absolute;
            right: 20px;
            top: 16px;
            width: 12px;
            height: 17px;
            background: url("/static/img/guiji-.png") 100% no-repeat;
            cursor: pointer;
            &:hover{
              background: url("/static/img/guiji-xuanfu.png") 100% no-repeat;
            }
          }
        }
        .send-item{
          width: 100%;
          .title{
            position: relative;
            display: flex;
            align-content: center;
            font-size: 12px;
            color: #888;
            padding: 15px 20px 9px 20px;
            cursor: default;
            &:after{
              position: absolute;
              left: 2%;
              bottom: 0;
              width: 96%;
              display: block;
              content: '';
              border-bottom: 1px solid #f4f4f4;
            }
            .quwan1{
              width: 36px;
              height: 8px;
              margin: 0 2px;
            }
          }
          .inner-item{
            position: relative;
            display: flex;
            height: 36px;
            width: 100%;
            line-height: 36px;
            padding: 0px 20px;
            font-size: 12px;
            color: #333;
            border-bottom: 1px dashed #f4f4f4;
            &:hover{
              background: #F8FBFE;
            }
            .circleNumber{
              width: 16px;
              height: 16px;
              margin-top: 10px;
              margin-right: 6px;
              border-radius: 50%;
              background: #339FF3;
              color: #fff;
              text-align: center;
              line-height: 16px;
            }
            .pathIcon{
              position: absolute;
              right: 20px;
              top: 9px;
              width: 12px;
              height: 17px;
              background: url("/static/img/guiji-.png") 100% no-repeat;
              cursor: pointer;
              &:hover{
                background: url("/static/img/guiji-xuanfu.png") 100% no-repeat;
              }
            }
          }
        }
      }
    }

    /*滚动条*/
    ::-webkit-scrollbar-button {
      width: 6px !important;
    }

    ::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }

    ::-webkit-scrollbar-button {
      width: 0;
      height: 0;
    }

    ::-webkit-scrollbar-thumb {
      background: #ccc;
    }

    ::-webkit-scrollbar-track {
      background-color: #f1f1f1;
    }
  }
</style>
