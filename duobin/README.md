# 微信小程序

> 目录结构

    .
    +-- _config                       -- 项目webpack设置(项目dev服务器设置)
    │   +-- dev.env.js                     -- 开发环境变量
    │   +-- index.js                       -- 项目配置文件
    │   +-- prod.env.js                    -- 生产环境变量
    +-- _build                        -- 构建脚本目录(webpack具体配置)
    │   +-- build.js                       -- 生产环境构建脚本
    │   +-- check-versions.js              -- node与npm版本检查
    │   +-- dev-client.js                  -- 开发服务器热重载脚本，主要用来实现开发阶段的页面自动刷新
    │   +-- dev-server.js                  -- 运行本地开发服务器
    │   +-- utils.js                       -- 构建相关工具方法
    │   +-- vue-loader.conf.js             -- vue-loader配置
    │   +-- webpack.base.conf.js           -- wabpack基础配置
    │   +-- webpack.dev.conf.js            -- wabpack开发环境配置
    │   +-- webpack.prod.conf.js           -- wabpack生产环境配置
    +-- _src
    |   +-- _component                     -- Vue组件
    |   +-- _pages                         -- 小程序(vue)单页
    |   |   +-- _action
    |   |   |   +-- main.js                -- 小程序单页配置
    |   |   |   +-- index.vue              -- 小程序组件
    |   |   ...
    |   +-- _store                      -- Vuex
    |   |   +-- pageData.js                -- 页面共享数据
    |   |   +-- permission.js              -- 权限模块
    |   |   +-- user.js                    -- 用户模块
    |   |   +-- store.js                   -- 主模块
    |   +-- _utils                      -- api工具
    |   |   +-- apiUtil.js                 -- 公用API
    |   |   +-- cookieApi.js               -- 存取storage数据
    |   |   +-- req.js                     -- fly请求/响应拦截器
    |   +-- App.vue                     -- Vue根组件
    |   +-- main.js                     -- 小程序所有页面入口配置
    +-- _static                       -- 静态目录(编译跳过)
    |   +-- _component                  -- 小程序原生组件
    |   |   +-- _btn
    |   |   |   +-- index.js               -- 小程序组件构造器
    |   |   |   +-- index.json             -- 小程序组件页面配置
    |   |   |   +-- index.wxml             -- 小程序组件html
    |   |   |   +-- index.wxss             -- 小程序组件css
    |   |   ...
    |   +-- _echarts                    -- 小程序echarts图表
    |   |   +-- echarts.js                 -- 图表库
    |   +-- _img                        -- 图片
    |   +-- _weui                       -- 小程序weui
    |   |   +-- weui.css
    +-- _dist                           -- 编译后项目(小程序开发者工具需指向该目录)
    +-- eslintgnore                     -- eslin忽略设置
    +-- eslintrc.js                     -- eslint设置
    +-- postcssrc.js                    -- postcss设置
    +-- package.json                    -- 项目描述/依赖

# PC端

> 目录结构

    .
    +-- _config                       -- 项目webpack设置(项目dev服务器设置)
    │   +-- dev.env.js                     -- 开发环境变量
    │   +-- index.js                       -- 项目配置文件
    │   +-- prod.env.js                    -- 生产环境变量
    +-- _build                        -- 构建脚本目录(webpack具体配置)
    │   +-- build.js                       -- 生产环境构建脚本
    │   +-- check-versions.js              -- node与npm版本检查
    │   +-- utils.js                       -- 构建相关工具方法
    │   +-- vue-loader.conf.js             -- vue-loader配置
    │   +-- webpack.base.conf.js           -- wabpack基础配置
    │   +-- webpack.dev.conf.js            -- wabpack开发环境配置
    │   +-- webpack.prod.conf.js           -- wabpack生产环境配置
    +-- _src
    |   +-- _api                     -- Vue组件
    |   |   +-- login.js                -- 请求获取用户信息
    |   +-- _assets                     -- 图片资源
    |   +-- _component                  -- Vue组件
    |   +-- _icons                      -- svg图标
    |   +-- _router                     -- Vue路由
    |   +-- _store                      -- Vuex
    |   |   +-- _modules                -- 页面共享数据
    |   |   |   +-- permission.js              -- 权限模块
    |   |   |   +-- tagsView.js                -- 标签模块
    |   |   |   +-- user.js                    -- user模块
    |   |   +-- getter.js                      -- Vuex-getter列表
    |   |   +-- index.js                       -- 主模块
    |   +-- _styles                   -- 主题样式
    |   |   +-- common.scss                    -- 通用样式
    |   |   +-- element-ui.scss                -- 清除element-UI样式问题
    |   |   +-- index.scss                     -- 全局样式
    |   |   +-- mixin.scss                     -- 样式混入设置
    |   |   +-- sidebar.scss                   -- 侧边栏样式
    |   |   +-- transition.scss                -- 缓动样式
    |   |   +-- variables.scss                 -- 覆盖element主题样式
    |   +-- _utils                    -- api工具
    |   |   +-- auth.js                    -- cookie设置token API
    |   |   +-- index.js                   -- 时间处理 API
    |   |   +-- permission.js              -- 鉴权 API
    |   |   +-- req.js                     -- axios请求/响应拦截器
    |   |   +-- validate.js                -- 正则校验 API
    |   +-- _views                         -- Vue单页
    |   |   +-- _login
    |   |   |   +-- index.vue              -- 组件
    |   |   ...
    |   +-- App.vue                        -- Vue根组件
    |   +-- main.js                        -- Vue入口配置
    |   +-- permission.js                  -- Vue路由守卫(用于权限检测/重定向/信息拉取)
    +-- eslintgnore                        -- eslin忽略设置
    +-- eslintrc.js                        -- eslint设置
    +-- postcssrc.js                       -- postcss设置
    +-- package.json                       -- 项目描述/依赖

### 项目运行
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```



### 辅助网址
> BUG

- mpvue问题仓库 —— [mpvue-issues](https://github.com/Meituan-Dianping/mpvue/issues)

- [Vue问题集锦](https://juejin.im/post/59fa9257f265da43062a1b0e)



> 小程序文档

- mpvue —— [mpvue](http://mpvue.com/)

- mpvue-github仓库 —— [mpvue-github](https://github.com/Meituan-Dianping/mpvue)

- [mpvue-依赖工具](https://github.com/mpvue/awesome-mpvue)

- 小程序文档 — [小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/)

- [Fly.js](https://wendux.github.io/dist/#/doc/flyio/readme)

- 组件库
  - [zan-ui](https://youzan.github.io/zanui-weapp/#/zanui/base/btn)
  - [mpvue-weui](http://kuangpf.com/mpvue-weui/#/picker)
  - [wux-ui](https://wux-weapp.github.io/wux-weapp/#/rater?id=%E8%A7%86%E9%A2%91%E6%BC%94%E7%A4%BA)
  - [min-ui](https://meili.github.io/min/docs/minui/#README)

> PC端文档

- 后台模板-github仓库 —— [后台模板-github](https://github.com/PanJiaChen/vue-element-admin)

- Vue.js —— [vue.js](https://cn.vuejs.org/)

- Vue.js-github仓库 —— [vue.js-github](https://github.com/vuejs/vue)


- [Lodash](http://www.css88.com/doc/lodash/)

- [Axios](https://www.kancloud.cn/yunye/axios/234845)

- 组件库
  - [Element-ui](http://element-cn.eleme.io/#/zh-CN)
