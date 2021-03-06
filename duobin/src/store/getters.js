const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permItems: state => state.user.permItems,
  loginDate: state => state.user.loginDate,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers, // 当前所有的路由对象
  addRouters: state => state.permission.addRouters
}
export default getters
