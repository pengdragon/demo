import 'core-js/es6/string';
import 'core-js/es6/array';
import 'core-js/es6/object';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import FastClick from 'react-fastclick-alt';
import createHistory from 'history/createBrowserHistory';
import App from './App';
import rootReducer from './reducers/index';
import i18n from './i18n.js';
import getLang from './utils/getLang';

const history = createHistory();
const middleware = routerMiddleware(history);

const middlewares = [thunk, middleware];

const store = createStore(
  combineReducers({ routing: routerReducer, ...rootReducer }),
  composeWithDevTools(applyMiddleware(...middlewares))
);

const render = Component => ReactDOM.render(
  <FastClick>
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>
  </FastClick>,
  document.getElementById('root')
);

// 获取当前app语言参数，并初始化国际化和渲染页面。开发时，mock数据默认返回中文。
getLang().then((language)=>{
  i18n.initByLang(language === 'zh' ? 'zh_CN' : 'en_US');
  render(App);
  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextRootContainer = require('./App').default;
      render(NextRootContainer);
    });
  };
});
