import axios from 'axios'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import Vue from 'vue'
import router from '../router'
!(() => {
  let baseURL = window.g.baseUrl
  let timeout = window.g.timeOut
  // 创建正常的axios实例
  Vue.prototype.$axios = axios.create({
    baseURL,
    timeout
  })
  // request拦截器
  Vue.prototype.$axios.interceptors.request.use(config => {
    let sessionId = Cookies.get('sessionid')
    config.headers.sessionid = sessionId
    console.log('龙哥')
    return config
  }, error => {
    console.log(error)
    Promise.reject(error)
  })

  // respone拦截器
  Vue.prototype.$axios.interceptors.response.use(
    response => {
      // 忽略获取资料请求
      console.log('小彭')
      const res = response.data
      if (res.result === 'success' || res.msg === 'success') {
        return response.data
      } else if (res.result === 'error') {
        if (response.config.url.indexOf('/system/getUserInfo') === -1) {
          Message({
            type: 'warning',
            message: res.msg
          })
        }
        return res
      } else if (res.exception === '401') {
        // session失效重定向至登录页面
        console.log('sessionid失效')
        Cookies.remove('sessionid')
        // router.push('/login')
        Message({
          message: '请重新登录',
          type: 'warning'
        })
      } else {
        // Message({
        //   message: res.result || '网络故障请重试!',
        //   type: 'error',
        //   duration: 5 * 1000
        // })
        return Promise.reject('error')
      }
    },
    error => {
      console.log('err' + error)
      // let msg = error.message
      // if (error.message.indexOf('15000') !== -1) {
      //   msg = '响应超时请重试!'
      // }
      // Message({
      //   message: msg,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      return Promise.reject(error)
    }
  )
})()

