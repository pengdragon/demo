export default function WxLogin(a) {
  let c = 'default'
  a.self_redirect === !0 ? c = 'true' : a.self_redirect === !1 && (c = 'false')
  let d = document.createElement('iframe')
  let e = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + a.appid + '&scope=' + a.scope + '&redirect_uri=' + a.redirect_uri + '&state=' + a.state + '&login_type=jssdk&self_redirect=' + c
  e += a.style ? '&style=' + a.style : ''
  e += a.href ? '&href=' + a.href : ''
  d.src = e
  d.frameBorder = '0'
  d.allowTransparency = 'true'
  d.scrolling = 'no'
  d.width = '300px'
  d.height = '400px'
  let f = document.getElementById(a.id)
  f.innerHTML = ''
  f.appendChild(d)
}
