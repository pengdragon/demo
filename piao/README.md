# 移动端工程模板

## 目录

- [下载移动模板](#下载移动模板)
- [设置内网源](#设置内网源)
- [项目目录结构](#项目目录结构)
- [可用脚本](#可用脚本)
  - [npm start](#npm-start)
  - [npm run lint](#npm-run-lint)
  - [npm run lint-css](#npm-run-lint-css)
  - [npm run build](#npm-run-build)
- [引入图片和文件](#引入图片和文件)
- [public文件夹的使用](#public文件夹的使用)
  - [引入外部资源](#引入外部资源)
- [添加路由](#添加路由)
  - [路由跳转](#路由跳转)
- [引用样式](#引用样式)
- [引用 weui 组件](#引用-weui-组件)
- [国际化](#国际化)
- [模板生成](#模板生成)
  - [生成组件](#生成组件)
  - [生成路由](#生成路由)
  - [生成action](#生成action)
  - [生成reducer](#生成reducer)
- [通过fetch获取数据](#通过fetch获取数据)
- [在开发环境中配置代理](#在开发环境中配置代理)
- [本地调试生产环境接口](#本地调试生产环境接口)

## 下载移动模板

请访问[We码官方注册地址](http://w3.huawei.com/wecode/)，注册We码应用后即可下载工程模板

## 设置内网源

为了能安装依赖包，请设置内网源：

```bash
npm config set registry http://3ms-beta.huawei.com/km-srv/npm/
```

## 项目目录结构

下载模板后，将看到以下项目文件夹结构：

```
└───wlk-react-template/
  ├───package.json // node相关环境的配置文件
  └───src/
    ├───actions    // 请求处理
    ├───config     // 接口地址配置，可生产、uat和开发环境配置
    ├───components // 页面组件
    ├───locales    // 国际化信息
    ├───reducers   // 存放state
    ├───routes     // 组件路由
    ├───utils      // 提供一些小工具
    ├───App.js     // 根react组件
    ├───app.less   // 公共样式
    ├───entry.js   // webpack打包入口
    ├───i18n.js    // 国际化处理
    ├───index.html // html模板文件
  └───test         // jest测试集
    ├───__snapshots__
  ├───.eslintrc    // eslint代码检查配置
  ├───.stylelintrc // css语法检测配置
  └───webpack.config.js // webpack配置文件
```

当项目构建时，**这些文件必须存在**：

* `src/index.html` 是页面模板;
* `src/entry.js` 是入口文件。

你可以在 `src` 目录创建子目录，为了更快地重新构建，Webpack只处理 `src` 中的文件。**你需要将JS和CSS放到 `src` 里面**，否则Webpack将不会处理它们。


## 可用脚本

在项目根目录，你可以执行以下命令：


### `npm start`

启动项目，将会自动检查jsapi是否有新版本，若有新版本，将自动下载并将文件复制至`build/common`路径下。
在浏览器中打开[http://dev.huawei.com:3000/apps/appId/1/html/index.html](http://dev.huawei.com:3000/apps/appId/1/html/index.html) 访问。

当你修改文件时，页面将会重新加载。<br>
您还将在控制台中看到任何lint错误。


### `npm run lint`

> 备注：部分JS语法规范需手动。

JS代码规范检查并自动修复：

```bash
npm run lint
```

### `npm run lint-css`

> 备注：部分CSS语法规范需手动。

CSS代码规范检查并自动修复：

```bash
npm run lint-css
```

### `npm run build`

构建测试环境:

```
npm run buld -- uat
```

构建生产：

```
npm run build -- prod
```

`build` 文件夹是打包项目后的目录。<br>

`build/zip` 文件夹里文件用于上传服务器。

你的应用已经准备好部署了!



## 引入图片和文件

使用静态模块，比如图片和样式等，通过Webpack编译。

你可以通过**`import` 引入JavaScript模块**，告知Webpack打包时需要包含这些文件。
最终这些文件的路径最终将在html自动引用，比如通过 图片的 `src` 属性或者通过 `href` 引入样式。

为了减少页面请求，导入的图片小于 1000 bytes 将返回一个[data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) 替换图片地址。支持格式：bmp, gif, jpg, jpeg, 和 png。

以下有个例子：

```js
import React from 'react';
import logo from './logo.png'; // Tell Webpack this JS file uses this image

console.log(logo); // /logo.84287d09.png

function Header() {
  // Import result is the URL of your image
  return <img src={logo} alt="Logo" />;
}

export default Header;
```

当项目构建完，确保Webpack将图片放到 `build` 目录中，以及提供给我们正确的访问地址。

同样适合在CSS中：

```css
.Logo {
  background-image: url(./logo.png);
}
```

## public文件夹的使用

### `引入外部资源`

你可以通过`public` 文件夹引入其他模块代码。

注意，我们通常鼓励您使用JavaScript文件中的`import`引入。
例如，请参阅[#引用样式](#引用样式)和[引入图片和文件](#引入图片和文件)部分。

这种机制提供了许多好处:

* 脚本和样式表被压缩并打包在一起，以避免额外的网络请求。
* 丢失的文件会导致编译错误，而不是为您的用户造成404错误。

如果你将一个文件放入 `public` 文件夹，它将不会被Webpack处理。相反，它将被复制到build文件夹中。

要引用 `public` 文件夹中的文件，您需要使用一个名为 `PUBLIC_URL` 的特殊变量。

在 `index.html` 里面，你可以这也使用：

```html
<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
```

当你执行 `npm run build`，模板将会替换正确的路径。

在js代码中，你可以使用 `process.env.PUBLIC_URL`达到类似的目的。

```js
render() {
  // Note: this is an escape hatch and should be used sparingly!
  // Normally we recommend using `import` for getting asset URLs
  // as described in “Adding Images and Fonts” above this section.
  return <img src={process.env.PUBLIC_URL + '/img/logo.png'} />;
}
```

请记住这种方法的缺点:

* `public` 文件夹内的所有文件都不会被处理或压缩。
* 在编译时将不会因为丢失的文件或js语法问题，而提示错误。

### 什么时候适合使用public文件夹

`public`文件夹对于一些不太常见的情况是有用的:

* 您有数千个图像，需要动态地引用它们的路径。
* 你想要引入一段小的脚本比如[`pack.js`]而不经过webpack打包编译。
* 有些库可能与Webpack不兼容，您没有其他选择，只能将它通过`<script>`标签引入。


## 添加路由

在 `src/routes/index.js` 配置，如果添加路由`'/wlk-ui'`，添加对应的 `component` 逻辑组件，指定模块生成的名称 `webpackChunkName: 'wlkUI'`

```js
import Home from './Home';
import { AsyncComponent } from '@wlk/wlk-react-template';

const routes = [
  { path: '/', component: Home, exact: true },
  { path: '/wlk-ui', component: AsyncComponent(() => import(/* webpackChunkName: 'wlkUI' */ './wlkUI')) }
];

export default routes;
```

### `路由跳转`

方法一：使用Link组件进行跳转

```js
import { Link } from 'react-router-dom';
<Link to="/desc" className="desc-link">使用说明</Link>
```

方法二：使用history进行跳转

```js
import createHistory from 'history/createBrowserHistory';
const history = createHistory();
history.push("/desc"); // 跳转路由
history.goForward(); // 访问前一个页面
history.goBack(); // 后退
```

## 样式引用

项目使用[Webpack](https://webpack.js.org/) 对所有模块进行处理。
Webpack提供了一种自定义的方式来“扩展”，通过JavaScript的`import`。
要表示JavaScript文件依赖于CSS文件，您需要**从JavaScript文件**导入CSS:
### `Button.css`

```css
.Button {
  padding: 20px;
}
```

### `Button.js`

```js
import React, { Component } from 'react';
import './Button.css'; // Tell Webpack that Button.js uses these styles

class Button extends Component {
  render() {
    // You can use them as regular CSS styles
    return <div className="Button" />;
  }
}
```

## 引用 weui 组件

```jsx
import React from 'react';
import {
  Tab,
  TabBody,
  TabBar,
  TabBarItem,
  TabBarIcon,
  TabBarLabel,
  Article
} from '@wlk/react-weui';
```

使用 AsyncComponent 按需加载组件
```jsx
import Home from './Home';
import { AsyncComponent } from '@wlk/wlk-react-template';

// webpackChunkName 指定webpack打包模块名称，访问路由按需加载
const routes = [
  { path: '/', component: Home, exact: true },
  { path: '/test', component: AsyncComponent(() => import(/* webpackChunkName: 'wlk-ui' */ './test')) }
];

export default routes;
```

## 国际化

输出src/locales中common.json配置的国际化字段appName信息，国际化初始化判断请参考 [src/entry.js](src/entry.js)

使用：

```jsx
import i18n from 'i18n';
i18n.t('common:appName');
```


## 模板生成

通过命令行可生成Action，Component，Reducer和Route模板，代替人工新增或复制文件或目录，减少冗余操作，提高工作效率。

### `生成组件`

```bash
  npm run add component Demo
```

执行完命令后，将在 `src/components` 下生成文件夹 `Demo`。 

### `生成路由`

```bash
  npm run add route demo
```

执行完命令后，将在 `src/routes` 下生成文件夹 `Demo`。 

### `生成action`

```bash
  npm run add route demo
```

执行完命令后，将在 `src/actions` 下生成文件 `demo.js`。 


### `生成reducer`

```bash
  npm run add reducer demo
```

执行完命令后，将在 `src/reducers` 下生成文件 `demo.js`。

reducer生成完，需要将它挂在根reducer上，在 `src/reducers/index.js` 添加：

```js
import { demo } from './demo';
const rootReducer = {
  demo
};
export default rootReducer;
```

## 通过fetch获取数据

**We码开发数据请求只能通过 fetch/fetchInternet。**

在开发环境，`window.HWH5.fetch` 或 `window.HWH5.fetchInternet` 使用的是浏览器的fetch能力。但在We码中，利用的是原生能力去请求。

## 在开发环境中配置代理

在开发平台faq中有相关问题解答，请查阅。

## 本地调试生产环境接口

本地调试默认使用 `uat` 的 `sso` 登录认证，方便调用含用`sso`认证的 `uat` 接口。 如果想在本地调试生产含有 `sso` 认证的接口，可通过修改 `package.json` 文件的 `scripts` 配置中 `start` 脚本。

`Window` 和 `Linux, macOS` 执行命令有所不同:

### `Window(cmd.exe)`

```json
{
  // ...
 "scripts": {
      "start": "set NODE_ENV=production&&wlk-cli start",
      // ...
  },
  // ...
}
```

### `Linux, macOS(Bash)`

```json
{
  // ...
 "scripts": {
      "start": "export NODE_ENV=production&&wlk-cli start",
      // ...
  },
  // ...
}
```


