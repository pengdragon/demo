import axios from 'axios'
import { Message } from 'element-ui'
import Qs from 'qs'
import Cookies from 'js-cookie'
import router from '../router'

let service = ''

!(() => {
  let baseURL = window.g.baseUrl
  let timeout = window.g.timeOut
  // 创建axios实例
  service = axios.create({
    baseURL,
    timeout
  })
  // request拦截器
  service.interceptors.request.use(config => {
    let sessionId = Cookies.get('sessionid')
    config.headers.sessionid = sessionId
    // 将post请求数据跟改为form-data形式
    if (config.method.toLowerCase() === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    if (config.url.indexOf('import/order/orderinfo/saveexcelorder') !== -1) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    if (config.url.indexOf('/logistics/base/querylogistics') !== -1 || config.url.indexOf('logistics/delivery/szdeliverylist') !== -1 || config.url.indexOf('logistics/delivery/deliverygoodslist') !== -1 || config.url.indexOf('/logistics/base/tplsf') !== -1 || config.url.indexOf('/user/login') !== -1) {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    }
    if (config.url.indexOf('/logistics/base/querylogistics') === -1 && config.url.indexOf('logistics/delivery/szdeliverylist') === -1 && config.url.indexOf('logistics/delivery/deliverygoodslist') === -1 && config.url.indexOf('/logistics/base/tplsf') === -1 && config.url.indexOf('/user/login') === -1) {
      config.transformRequest = [function (data) {
        data = Qs.stringify(data)
        return data
      }]
    }
    return config
  }, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  })

  // respone拦截器
  service.interceptors.response.use(
    response => {
      // 忽略获取资料请求
      const res = response.data
      // console.log(res)
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
      } else if (res.msg === '失效') {
        console.log('sessionid失效')
        Cookies.remove('sessionid')
        alert('sessionid失效')
        // router.push('/login')
      } else if (res.result === 'fail') {
        // Message({
        //   message: res.cause || res.data,
        //   type: 'error',
        //   duration: 5 * 1000
        // })
        return Promise.reject('error')
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
      console.log('err' + error)// for debug
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

export default service
