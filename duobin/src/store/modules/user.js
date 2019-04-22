import { loginByUsername, logout, getUserInfo } from '@/api/login'
import Cookies from 'js-cookie'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    permItems: [],
    loginDate: '',
    company: '',
    dept: '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    // SET_STATUS: (state, status) => {
    //   state.status = status
    // },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMITEMS: (state, permItems) => {
      state.permItems = permItems
    },
    SET_LOGINDATE: (state, loginDate) => {
      state.loginDate = loginDate
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit, dispatch }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        // 此处传递用户名密码,从而获取用户数据
        loginByUsername(username, userInfo.password).then(response => {
          if (response.status === 'error') {
            resolve(response)
            return
          }
          // 在vuex与cookie中存储用户token
          const data = response
          Cookies.set('sessionid', data.data.sessionId)
          // 存用户信息
          // commit('SET_ROLES', data.roles)
          // commit('SET_PERMITEMS', data.permItems)
          // commit('SET_NAME', data.name)
          Cookies.set('name', data.data.name)
          Cookies.set('permission', data.data.permission)
          Cookies.set('lastLoginTime', data.data.lastLoginTime)
          // commit('SET_LOGINDATE', data.loginDate)
          // commit('SET_AVATAR', data.photo)
          // commit('SET_INTRODUCTION', data.introduction)
          // 此处触发路由拼接 root action
          // const premissionRouter = data.menuItems
          // const premissionItem = data.permItems
          dispatch('GenerateRoutes', [], { root: true })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 存在token,传入,并获取用户信息,存储于vuex中
        getUserInfo(state.token).then(response => {
          if (!response) { // 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data
          // 此处将用户权限/用户信息等存储于vuex中
          commit('SET_ROLES', data.roles)
          commit('SET_PERMITEMS', data.permItems)
          commit('SET_NAME', data.name)
          commit('SET_LOGINDATE', data.loginDate)
          commit('SET_AVATAR', data.photo)
          commit('SET_COMPANY', data.companyName)
          commit('SET_DEPT', data.officeName)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          // 清空vuex中token与权限
          commit('SET_ROLES', [])
          // 清空cookie中token
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
