/**
 * 路由配置文件
 * 如果需要按需加载，可使用asyncComponent加载，用法请参考README.md文件
*/

import { AsyncComponent } from '@wecode/wlk-react-template-util';
import Home from './Home';
import Meeting from './Meeting';
import Schedule from './Schedule';
import My from './My';
import Pick from './Pick';
import Edit from './Edit';
// webpackChunkName 可指定模块名称，访问路由按需加载
const routes = [
  { path: '/', component: Home, exact: true },
  { path: '/home', component: Home, exact: true },
  { path: '/meeting', component: Meeting, exact: true },
  { path: '/schedule', component: Schedule, exact: true },
  { path: '/my', component: My, exact: true },
  { path: '/pick', component: Pick, exact: true },
  { path: '/desc', component: AsyncComponent(() => import('./Desc')) },
  { path: '/details', component: AsyncComponent(() => import('./Details')) },
  { path: '/company', component: AsyncComponent(() => import('./Company')) },
  { path: '/edit', component: Edit, exact: true },
];

export default routes;
