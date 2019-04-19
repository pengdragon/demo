import req from '@/utils/axios2'

export async function loginByUsername(name, password) {
  // 发送请求,获取用户信息
  let res = await req.post('/user/management/login', {
    userAccount: name,
    userPassword: password
  })
  console.log(res.data.cause)
  if (res.data.cause !== 'success') {
    return new Promise((resolve) => {
      resolve({
        status: 'error',
        msg: '登录失败'
      })
    })
  }

  return new Promise((resolve) => {
    resolve(res.data)
  })
}

export function logout() {
  // 发送登出请求
  return req({
    url: '/role/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  // 当页面存在token时,连带token,从而获取用户信息
  return req({
    method: 'get',
    headers: {
      'X-Token': token
    },
    url: '/system/getUserInfo'
  })
}

