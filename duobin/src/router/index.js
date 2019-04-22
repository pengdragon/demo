import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export let routerMap = [
  {
    path: '/import',
    component: Layout,
    children: [
      {
        path: '',
        name: 'importIndex',
        component: () => import('@/views/index/import'),
        meta: { title: '数据看板', imgIcon: 'shujukanban' }
      },
      {
        path: 'placeOrder',
        name: 'placeOrder',
        component: () => import('@/views/placeOrder/import'),
        meta: { title: '订单下单', imgIcon: 'xinzeng', hot: true }
      },
      {
        path: 'orderSearch',
        name: 'orderSearch',
        component: () => import('@/views/orderSearch/import'),
        meta: { title: '订单查询', imgIcon: 'dingdanchaxun' }
      },
      {
        path: 'logistics',
        component: () => import('@/views/logistics/index'),
        name: 'importLogistics',
        hidden: true,
        meta: { title: '订单跟踪详情', icon: '' }
      },
      {
        path: 'orderDetail',
        component: () => import('@/views/placeOrder/import'),
        name: 'importOrderDetail',
        hidden: true,
        meta: { title: '订单详情', icon: '' }
      },
      {
        path: 'takeGoods',
        name: 'takeGoods',
        component: {
          template: '<router-view/>'
        },
        meta: { title: '收货管理', imgIcon: 'tihuoguanli' },
        children: [
          {
            path: 'newTakeGoods',
            component: () => import('@/views/newTakeGoods/import'),
            name: 'newTakeGoods',
            meta: { title: '提货申请', icon: '' }
          },
          {
            path: 'takeGoodsSearch',
            name: 'takeGoodsSearch',
            component: () => import('@/views/takeGoods/import'),
            meta: { title: '提货查询', icon: '' }
          },
          {
            path: 'takeGoodsDetail',
            component: () => import('@/views/newTakeGoods/import'),
            name: 'takeGoodsDetail',
            meta: { title: '提货单详情', icon: '' },
            hidden: true
          }
        ]
      },
      {
        path: 'sendGoods',
        name: 'sendGoods',
        component: {
          template: '<router-view/>'
        },
        meta: { title: '发货管理', imgIcon: 'fukuanguanli' },
        children: [
          {
            path: 'newSendGoods',
            component: () => import('@/views/newSendGoods/import'),
            name: 'newSendGoods',
            meta: { title: '派货申请', icon: '' }
          },
          {
            path: 'sendGoodsSearch',
            name: 'sendGoodsSearch',
            component: () => import('@/views/sendGoods/import'),
            meta: { title: '派货查询', icon: '' }
          },
          {
            path: 'sendGoodsDetail',
            component: () => import('@/views/newSendGoods/import'),
            name: 'sendGoodsDetail',
            meta: { title: '查看派货单', icon: '' },
            hidden: true
          }
        ]
      },
      {
        path: 'payApply',
        component: {
          template: '<router-view/>'
        },
        name: 'payApply',
        meta: { title: '付款管理', imgIcon: 'fukuanguanli' },
        children: [
          {
            path: 'newPayApply',
            component: () => import('@/views/payApplyDetail/import'),
            name: 'newPayApply',
            meta: { title: '付款申请', icon: '' }
          },
          {
            path: 'payApplySearch',
            component: () => import('@/views/payApply/import'),
            name: 'payApplySearch',
            meta: { title: '付款查询', icon: '' }
          },
          {
            path: 'payApplyDetail',
            component: () => import('@/views/payApplyDetail/import'),
            name: 'payApplyDetail',
            hidden: true,
            meta: { title: '付款详情', icon: '' }
          }
        ]
      },
      {
        path: 'logisticsSearch',
        component: () => import('@/views/logisticsSeach'),
        name: 'logisticsSearch',
        meta: { title: '物流查询', imgIcon: 'wuliuchaxun' }
      },
      {
        path: 'logisticsDetail',
        component: () => import('@/views/logisticsDetail'),
        name: 'logisticsDetail',
        meta: { title: '订单轨迹', icon: 'logistics' },
        hidden: true
      },
      {
        path: 'setting',
        component: { template: '<router-view/>' },
        meta: { title: '账号管理', imgIcon: 'zhanghaoguanli' },
        name: 'importSetting',
        children: [
          {
            path: 'setting2',
            component: () => import('@/views/setting/changePsworld'),
            name: 'importSetting2',
            meta: { title: '修改密码', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting3',
            component: () => import('@/views/setting/reminding'),
            name: 'importSetting3',
            meta: { title: '消息提醒', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting4',
            component: () => import('@/views/setting/bound'),
            name: 'importSetting4',
            meta: { title: '微信绑定', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting5',
            component: () => import('@/views/setting/unbound'),
            name: 'importSetting5',
            meta: { title: '解绑微信', imgIcon: 'zhanghaoguanli' }
          }
        ]

      }
    ]
  },
  {
    path: '/export',
    component: Layout,
    children: [
      {
        path: '',
        name: 'exportIndex',
        component: () => import('@/views/index/export'),
        meta: { title: '数据看板', imgIcon: 'shujukanban' }
      },
      {
        path: 'orderSearch',
        name: 'exportOrderSearch',
        component: () => import('@/views/orderSearch/export'),
        meta: { title: '订单查询', imgIcon: 'dingdanchaxun' }
      },
      {
        path: 'logistics',
        component: () => import('@/views/logistics/index'),
        name: 'exportOrderLogistics',
        meta: { title: '订单跟踪详情', icon: '' },
        hidden: true
      },
      {
        path: 'orderDetail',
        component: () => import('@/views/placeOrder/export'),
        name: 'exportOrderDetail',
        meta: { title: '订单详情', icon: '' },
        hidden: true
      },
      {
        path: 'placeOrder',
        name: 'exportPlaceOrder',
        component: () => import('@/views/placeOrder/export'),
        meta: { title: '订单下单', imgIcon: 'xinzeng', hot: true }
      },
      {
        path: 'logistics',
        component: { template: '<router-view/>' },
        name: 'exportLogistics',
        meta: { title: '物流派单', imgIcon: 'tihuoguanli' },
        children: [
          {
            path: 'takeGoods',
            name: 'exportTakeGoods',
            component: () => import('@/views/takeGoods/export'),
            meta: { title: '提货单查询', icon: '' }
          },
          {
            path: 'sendGoods',
            name: 'exportSendGoods',
            component: () => import('@/views/sendGoods/export'),
            meta: { title: '派货单查询', icon: '' }
          }
        ]
      },
      // 出口提货申请
      {
        path: 'newTakeGoods',
        component: () => import('@/views/newTakeGoods/export'),
        name: 'exportNewTakeGoods',
        meta: { title: '新增提货单', icon: '' },
        hidden: true
      },
      {
        path: 'takeGoodsDetail',
        component: () => import('@/views/newTakeGoods/export'),
        name: 'exportTakeGoodsDetail',
        meta: { title: '查看提货单', icon: '' },
        hidden: true
      },
      // 出口派货申请
      {
        path: 'newSendGoods',
        component: () => import('@/views/newSendGoods/export'),
        name: 'nexportNewSendGoods',
        meta: { title: '新增派货单', icon: '' },
        hidden: true
      },
      {
        path: 'sendGoodsDetail',
        component: () => import('@/views/newSendGoods/export'),
        name: 'exportSendGoodsDetail',
        meta: { title: '查看派货单', icon: '' },
        hidden: true
      },
      {
        path: 'pay',
        component: { template: '<router-view/>' },
        name: 'exportPay',
        meta: { title: '付款申请', imgIcon: 'fukuanguanli' },
        children: [
          {
            path: 'padPay',
            name: 'exportPadPay',
            component: () => import('@/views/padPay/index'),
            meta: { title: '垫资付款申请', icon: '' }
          },
          {
            path: 'entrustPay',
            name: 'entrustPay',
            component: () => import('@/views/entrustPay/index'),
            meta: { title: '付款委托申请', icon: '' }
          }
        ]
      },
      // 出口垫资付款申请
      {
        path: 'newPad',
        component: () => import('@/views/newPad/index'),
        name: 'newPad',
        meta: { title: '新增垫资付款', icon: '' },
        hidden: true
      },
      {
        path: 'padPayDetail',
        component: () => import('@/views/newPad/index'),
        name: 'padPayDetail',
        meta: { title: '垫资付款详情', icon: '' },
        hidden: true
      },
      // 付款委托申请
      {
        path: 'newEntrustPay',
        component: () => import('@/views/newEntrustPay/index'),
        name: 'newEntrustPay',
        meta: { title: '新增付款委托', icon: '' },
        hidden: true
      },
      {
        path: 'entrustPayDetail',
        component: () => import('@/views/newEntrustPay/index'),
        name: 'entrustPayDetail',
        meta: { title: '付款委托详情', icon: '' },
        hidden: true
      },
      {
        path: 'setting',
        component: { template: '<router-view/>' },
        meta: { title: '账号管理', imgIcon: 'zhanghaoguanli' },
        name: 'exportSetting',
        children: [
          {
            path: 'setting2',
            component: () => import('@/views/setting/changePsworld'),
            name: 'exportSetting2',
            meta: { title: '修改密码', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting3',
            component: () => import('@/views/setting/reminding'),
            name: 'exportSetting3',
            meta: { title: '消息提醒', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting4',
            component: () => import('@/views/setting/bound'),
            name: 'exportSetting4',
            meta: { title: '微信绑定', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting5',
            component: () => import('@/views/setting/unbound'),
            name: 'exportSettingG',
            meta: { title: '解绑微信', imgIcon: 'zhanghaoguanli' }
          }
        ]

      }
      // 出口付款申请
      // {
      //   path: 'applyTax',
      //   name: 'exportApplyTax',
      //   component: () => import('@/views/applyTax/index'),
      //   meta: { title: '申请税款', icon: '' },
      //   hidenChild: true,
      //   children: [
      //     {
      //       path: 'newApplyTax',
      //       component: () => import('@/views/newApplyTax/index'),
      //       name: 'newApplyTax',
      //       meta: { title: '新增垫付', icon: '' }
      //     }
      //   ]
      // },
      // {
      //   path: 'settlementQuery',
      //   name: 'exportSettlementQuery',
      //   component: () => import('@/views/settlementQuery/index'),
      //   meta: { title: '结汇查询', icon: '' },
      //   hidenChild: true,
      //   children: [
      //     {
      //       path: 'settlementDetail',
      //       component: () => import('@/views/settlementDetail/index'),
      //       name: 'settlementDetail',
      //       meta: { title: '结汇详情', icon: '' }
      //     }
      //   ]
      // }
    ]
  },
  {
    path: '/fictitious',
    component: Layout,
    children: [
      {
        path: '',
        name: 'fictitiousIndex',
        component: () => import('@/views/index/fictitious'),
        meta: { title: '首页', icon: 'home' }
      },
      {
        path: 'setupObject',
        name: 'setupObject',
        component: () => import('@/views/setupObject/index'),
        meta: { title: '立项', icon: 'search' },
        hidenChild: true,
        children: [
          {
            path: 'addObject',
            component: () => import('@/views/addObject/index'),
            name: 'addObject',
            meta: { title: '新增项目', icon: '' }
          },
          {
            path: 'setupDetail',
            component: () => import('@/views/setupDetail/index'),
            name: 'setupDetail',
            meta: { title: '立项详情', icon: '' }
          }
        ]
      },
      {
        path: 'bomConfirm',
        name: 'bomConfirm',
        component: () => import('@/views/bomConfirm/index'),
        meta: { title: 'BOM确认', icon: 'out' }
      },
      {
        path: 'material',
        component: () => import('@/views/logistic/index'),
        meta: { title: '采购原材料', icon: 'orderFrom' },
        children: [{
          path: 'importOrder',
          name: 'importOrder',
          component: () => import('@/views/fictitiousImport/index'),
          meta: { title: '进口订单', icon: '' },
          hidenChild: true,
          children: [
            {
              path: 'detail',
              component: () => import('@/views/placeOrder/ficImport'),
              name: 'fcImportOrderDetail',
              meta: { title: '进口订单详情', icon: '' }
            }]
        },
        {
          path: 'domPurchase',
          name: 'domPurchase',
          component: () => import('@/views/domPurchase/index'),
          meta: { title: '国内采购', icon: '' },
          hidenChild: true,
          children: [
            {
              path: 'detail',
              component: () => import('@/views/domPurchaseDetail/index'),
              name: 'domPurchaseDetail',
              meta: { title: '国内采购详情', icon: '' }
            }]
        }]
      },
      {
        path: 'production',
        name: 'production',
        component: () => import('@/views/processProduction/index'),
        meta: { title: '加工生产', icon: 'affirm' },
        hidenChild: true,
        children: [
          {
            path: 'detail',
            component: () => import('@/views/processDetail/index'),
            name: 'productionDetail',
            meta: { title: '加工生产详情', icon: '' }
          }]
      },
      {
        path: 'exportOrder',
        name: 'exportOrder',
        component: () => import('@/views/exportOrder/index'),
        meta: { title: '出口销售', icon: 'inventory' },
        hidenChild: true,
        children: [
          {
            path: 'Detail',
            name: 'fcExportOrderDetail',
            component: () => import('@/views/placeOrder/ficExport'),
            meta: { title: '出口销售详情', icon: 'inventory' }
          }]
      },
      {
        path: 'payApply',
        component: () => import('@/views/payApply/fictitious'),
        name: 'ficPayApply',
        meta: { title: '付款申请', icon: 'pay' },
        hidenChild: true,
        children: [
          {
            path: 'payApplyDetail',
            component: () => import('@/views/payApplyDetail/fictitious'),
            name: 'ficPayApplyDetail',
            meta: { title: '新增付款申请', icon: '' }
          }
        ]
      },
      {
        path: 'orderTrack',
        component: () => import('@/views/logistic/index'),
        meta: { title: '订单跟踪', icon: 'address' },
        children: [{
          path: 'objectTrack',
          name: 'objectTrack',
          component: () => import('@/views/objectTrack/index'),
          meta: { title: '项目跟踪', icon: '' },
          hidenChild: true,
          children: [
            {
              path: 'detail',
              component: () => import('@/views/orderTrackDetail/index'),
              name: 'orderTrackDetail',
              meta: { title: '项目跟踪详情', icon: '' }
            }]
        },
        {
          path: 'materialTrack',
          name: 'materialTrack',
          component: () => import('@/views/materialTrack/index'),
          meta: { title: '进口物料跟踪', icon: '' }
        },
        {
          path: 'workTrack',
          name: 'workTrack',
          component: () => import('@/views/workTrack/index'),
          meta: { title: '国内采购物料收票查询', icon: '' }
        }]
      },
      {
        path: 'setting',
        component: { template: '<router-view/>' },
        meta: { title: '账号管理', imgIcon: 'zhanghaoguanli' },
        name: 'fcSetting',
        children: [
          {
            path: 'setting2',
            component: () => import('@/views/setting/changePsworld'),
            name: 'fcSetting2',
            meta: { title: '修改密码', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting3',
            component: () => import('@/views/setting/reminding'),
            name: 'fcSetting3',
            meta: { title: '消息提醒', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting4',
            component: () => import('@/views/setting/bound'),
            name: 'fcSetting4',
            meta: { title: '微信绑定', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting5',
            component: () => import('@/views/setting/unbound'),
            name: 'fcSetting5',
            meta: { title: '解绑微信', imgIcon: 'zhanghaoguanli' }
          }
        ]

      }
    ]
  },
  {
    path: '/substitute',
    component: Layout,
    children: [
      {
        path: '',
        name: 'substituteIndex',
        component: () => import('@/views/index/substitute'),
        meta: { title: '数据看板', icon: 'home' }
      },
      {
        path: 'purchaseOrderList',
        component: () => import('@/views/purchaseOrderList/index'),
        name: 'purchaseOrderList',
        meta: { title: '入库订单', icon: 'repertory' },
        hidenChild: true,
        children: [
          {
            path: 'detail',
            component: () => import('@/views/placeOrder/substitute'),
            name: 'purchaseOrderListDetail',
            meta: { title: '新增入库订单', icon: '' }
          },
          {
            path: 'detail2',
            component: () => import('@/views/placeOrder/substitute2'),
            name: 'purchaseOrderListDetail2',
            meta: { title: '入库订单详情', icon: '' }
          }
        ]
      },
      {
        path: 'pickoutIndex',
        name: 'pickoutIndex',
        component: () => import('@/views/pickout/index'),
        meta: { title: '提货申请', icon: 'home' },
        hidenChild: true,
        children: [
          {
            path: 'add',
            component: () => import('@/views/pickout/add'),
            name: 'subPayApplyDetail',
            meta: { title: '新增提货指令', icon: '' }
          },
          {
            path: 'detail',
            component: () => import('@/views/pickout/detail'),
            name: 'purchaseOrderListDetail3',
            meta: { title: '提货详情', icon: '' }
          }
        ]

      },
      {
        path: 'outDictateList',
        component: () => import('@/views/outDictateList/index'),
        name: 'outDictateList',
        meta: { title: '出库申请', icon: 'out' },
        hidenChild: true,
        children: [
          {
            path: 'newOutDictate',
            component: () => import('@/views/newOutDictate/index'),
            name: 'newOutDictate2',
            meta: { title: '新增出库指令', icon: '' }
          },
          {
            path: 'detail',
            component: () => import('@/views/outDictateList/detail'),
            name: 'detail',
            meta: { title: '出库指令详情', icon: '' }
          }
        ]
      },
      {
        path: 'outDictateList2',
        component: () => import('@/views/outDictateList2/index'),
        name: 'outDictateList2',
        meta: { title: '交货申请', icon: 'out' },
        hidenChild: true,
        children: [
          {
            path: 'newOutDictate',
            component: () => import('@/views/outDictateList2/newOutDictate'),
            name: 'newOutDictate22',
            meta: { title: '新增交货', icon: '' }
          },
          {
            path: 'detail',
            component: () => import('@/views/outDictateList2/detail'),
            name: 'detail2',
            meta: { title: '交货详情', icon: '' }
          }
        ]
      },
      {
        path: 'inventory',
        component: () => import('@/views/logistic/index'),
        name: 'inventory',
        meta: { title: '库存查询', icon: 'inventory' },
        children: [
          {
            path: 'inventoryQuery',
            name: 'inventoryQuery',
            component: () => import('@/views/inventoryQuery/index'),
            meta: { title: '库存查询', icon: '' }
          },
          {
            path: 'enterQuery',
            name: 'enterQuery',
            component: () => import('@/views/enterQuery/index'),
            meta: { title: '入库查询', icon: '' }
          },
          {
            path: 'outQuery',
            name: 'outQuery',
            component: () => import('@/views/outQuery/index'),
            meta: { title: '出库查询', icon: '' }
          }
        ]
      },
      {
        path: 'setting',
        component: { template: '<router-view/>' },
        meta: { title: '账号管理', imgIcon: 'zhanghaoguanli' },
        name: 'setting',
        children: [
          {
            path: 'setting2',
            component: () => import('@/views/setting/changePsworld'),
            name: 'setting2',
            meta: { title: '修改密码', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting3',
            component: () => import('@/views/setting/reminding'),
            name: 'setting3',
            meta: { title: '消息提醒', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting4',
            component: () => import('@/views/setting/bound'),
            name: 'setting4',
            meta: { title: '微信绑定', imgIcon: 'zhanghaoguanli' }
          },
          {
            path: 'setting5',
            component: () => import('@/views/setting/unbound'),
            name: 'setting5',
            meta: { title: '解绑微信', imgIcon: 'zhanghaoguanli' }
          }
        ]

      }
    ]
  },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/register', component: () => import('@/views/register/index'), hidden: true },
  {
    path: '/',
    redirect: '/import/',
    component: Layout,
    name: 'loginIndex',
    hidden: true
  },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: routerMap
})
// 设置权限路由
