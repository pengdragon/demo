import axios from 'axios'
import Cookies from 'js-cookie'
// axios 配置
axios.defaults.timeout = window.g.timeOut
axios.defaults.baseURL = window.g.baseUrl
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
//请求拦截器
axios.interceptors.request.use(
    config => {
        // 读取登录成功后后台返回的token值
        let data = Cookies.get('sessionid')

        // 如果有所有请求头中添加token值
        if (data) {
            // 此请求头不能随意更改，需和后台沟通
            config.headers.sessionid = data
        }
        // config.headers.sessionid='891101a2-83ed-45e0-bc60-039f56f86297';

        return config
    }, error => {
        return Promise.reject(error)
    })
// 响应拦截器
// axios.interceptors.response.use(
//     response => {
//         if (response.data.msg == '失效') {
//             console.log(response.data.msg)
//                 // alert('登陆失效请重新登陆')
//             sessionStorage.removeItem('sessionid');
//             window.location.href = window.g.url
//             return

//         } else if (response.data.msg == 'fail') {
//             alert(response.data.result)
//         }
//         return response;
//     },
//     error => {
//         console.log(error)
//         switch (error.response.status) {
//             //token失效当服务器返回401，路由跳转登录页
//             case 400:

//                 alert("参数错误，请重新填写")
//         }
//     });

export default axios