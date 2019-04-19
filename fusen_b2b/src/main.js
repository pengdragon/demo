import 'babel-polyfill'
import Vue from 'vue'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
import axios from 'axios'
Vue.prototype.$http = axios
import UUID from 'uuidjs'
Vue.prototype.$getid = () => UUID.genV4().toString()

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 引入陈波的请求类型
import '@/utils/commonRequest'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

// 引入并注册mButton组件
import mButton from '@/components/mBuuton'
Vue.component('mButton', mButton)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
