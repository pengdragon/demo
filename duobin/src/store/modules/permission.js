// import { addRouterList, invalidPage, routerMap, b2bRouterList } from '@/router'
import { routerMap } from '@/router'
import router from '@/router'
// import _ from 'lodash'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles 权限
 * @param route 路由对象
 */
// function hasPermission(roles, route) {
//   // 判断传入的路由对象权限是否与当前用户的权限匹配
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     // 当页面不存在权限信息时,也直接放行
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap 所有的路由
 * @param roles 当前用户的权限
 */
// function filterAsyncRouter(asyncRouterMap, roles) {
//   此处修改需添加的路由,可在此处修改过滤条件
//   const accessedRouters = asyncRouterMap.filter(route => {
//     判断传入的路由对象与当前权限是否匹配
//     if (hasPermission(roles, route)) {
//       通过递归来判断路由对象子页面是否有符合权限的页面
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   返回过滤后的router列表数组
//   return accessedRouters
// }
/**
 * 修饰路由数组
 * @param routerArr 获取的路由数据
 * */
// function routeArrHandle(routerArr) {
//   // 映射函数
//   let res = ''
//   addRouterList.map((v) => {
//     if (v.name === routerArr.name) {
//       res = v
//       return
//     }
//   })
//   let clearArr = _.differenceBy(res.children, routerArr.children, 'name')
//   if (clearArr.length) {
//     res.children = _.differenceBy(res.children, clearArr, 'name')
//   }
//   if (res) {
//     return res
//   }
// }
const permission = {
  state: {
    routers: routerMap, // 当前的路由列表
    addRouters: [] // 动态添加的路由列表
  },
  mutations: {
    SET_ROUTERS: (state, routers) => { // 修改动态路由参数
      // 当前路由总对象,用于修改侧边栏的主要对象
      // 通过修改routers,来定制侧边栏的可选项,可在此处完成删除或添加操作
      // 当权限变更时,需进行判断,后生产对应的路由列表
      state.routers = routers
    },
    SET_ADDROUTER: (state, addRouter) => {
      // 此处修改需添加的路由
      state.addRouters = addRouter
    }
  },
  actions: {
    /**
     * 生成路由
     * @param data 代表路由数据
     * */
    GenerateRoutes({ state, commit }, data) {
      if (state.routers === undefined) {
        commit('SET_ROUTERS', routerMap)
      }
      return new Promise(resolve => {
        let arr = []
        // data.premissionRouter.map((v) => {
        //   arr.push(routeArrHandle(v))
        // }
        data.map((v) => {
          arr.push(v)
        })
        commit('SET_ADDROUTER', arr)
        // 拼接完整路由数组
        let mergeRouter = routerMap.concat(arr)
        // vuex存储完整路由数组
        commit('SET_ROUTERS', mergeRouter)
        // 执行router.addRouter方法,添加路由
        router.addRoutes(state.addRouters)
        resolve()
      })
    },
    // GenerateRoutes({ state, commit }, data) { // 动态更改路由(侧边栏)
    //   if (state.routers === undefined) {
    //     commit('SET_ROUTERS', routerMap)
    //   }
    //   return new Promise(resolve => {
    //     // 执行路由映射与过滤,获得需添加路由
    //     let arr = []
    //     // data.premissionRouter.map((v) => {
    //     //   arr.push(routeArrHandle(v))
    //     // })
    //     // vuex存储需添加路由数组
    //     b2bRouterList.map((v) => {
    //       arr.push(v)
    //     })
    //     commit('SET_ADDROUTER', arr)
    //     // 拼接完整路由数组
    //     let mergeRouter = state.routers.concat(arr)
    //     // vuex存储完整路由数组
    //     commit('SET_ROUTERS', mergeRouter)
    //     // 执行router.addRouter方法,添加路由
    //     router.addRoutes(state.addRouters)
    //     resolve()
    //   })
    // },
    dynamicRouters({ commit }, data) {
      // 当权限发生改变时,动态的修改路由对象
      // 即通过当前权限roles => 改变当前routers
    }
  }
}

export default permission
