/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Route from 'react-router-dom/Route';
import Router from 'react-router-dom/Router';
import createHistory from 'history/createHashHistory';
const history = createHistory();
// import { BrowserRouter } from 'react-router-dom';

/*
 全局导入less
 */
import './app.less';
import * as global from 'actions/global';
import routes from './routes';
import 'antd-mobile/dist/antd-mobile.css'


@connect(
  state => ({ ...state.global }),
  dispatch => bindActionCreators(global, dispatch)
)
export default class App extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {

  //   }
  // }

  state = {
    // eslint-disable-next-line react/no-unused-state
    tab: 0
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
    });
    window.HWH5.addEventListener({
      type: 'back',
      func: () => {
        // 监听页面返回事件，return true直接返回，return false，拒绝返回。只支持安卓
        const flag = true;
        return flag;
      }
    }).catch((error) => {
      console.log('监听事件发生异常', error);
    });
  }

  render() {
    return (
      // Provider 已经在入口文件写了
      <div className="appContainer">
        {/* <Router history={history}>
          <Route render={({ location })=>{
            return 
          }}/> */}

        <Route render={({ location }) => {

          return routes.map(route => (
            <Route
              key={route.path}
              location={location}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ));



        }
        }
        />

        </Router>

      </div >
    );
  }
};
