import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'// 进度条样式
// import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie' // cookie中获取token

NProgress.configure({ showSpinner: false })// 进度条

const whiteList = ['/login', '/register']// 无需重定向的白名单页面

router.beforeEach((to, from, next) => {
  NProgress.start() // 开启进度条动画
  if (Cookies.get('sessionid')) { // 判断是否存在token
    // 存在token
    if (to.path === '/login') { // 当进入的页面为login时重定向至主页
      next({ path: '/import/' })
      NProgress.done() // 结束进度条动画
    } else {
      next()
      // 用户信息存储于vuex,当页面销毁,则信息跟随销毁
      // 需在cookie中存储用户token,以免用户重复登录
      // 发送token请求,拉取路由信息
      // 拼接路由进行addRouter
      // 判断当前vuex是否存在路由列表,不存在则重新拉取
      // if (store.getters.permission_routers === undefined || store.getters.permission_routers.length === 5) { // 判断用户信息是否完全,当不存在roles信息时,进行重新获取用户信息
      //   store.dispatch('GetUserInfo').then(res => { // 拉取user_info
      //     // let data = res
      //     // const premissionItem = data.permItems
      //     // const premissionRouter = JSON.parse(data.menuItems)
      //     // store.dispatch('GenerateRoutes', { premissionRouter, premissionItem }).then(() => { // 根据roles权限生成可访问的路由表
      //     //   next({ ...to, replace: true }) // 确保addRoutes已完成 ,设置重定向,router对象的历史记录中不会存在该条记录
      //     // })
      //     store.dispatch('GenerateRoutes', []).then(() => {
      //       next({ ...to, replace: true })
      //     })
      //   }).catch((err) => {
      //     store.dispatch('FedLogOut').then(() => {
      //       Message.error(err || 'Verification failed, please login again')
      //       next({ path: '/' })
      //     })
      //   })
      // } else {
      //   // 进入对应页面
      //   next()
      // }
    }
  } else {
    // 不存在token时,重定向处理
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
