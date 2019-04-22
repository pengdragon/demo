/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-undef */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './index.less';
import Footer from '../../components/Footer';

// 图片
import search from '../../../public/images/search.png';

// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import * as home from '../../actions/home';
// import * as global from '../../actions/global';

// @connect(
//   state => ({ ...state.home }),
//   dispatch => bindActionCreators({ ...home, ...global }, dispatch)
// )
export default class Home extends React.Component {
  async componentWillMount() {
    // window.HWH5.navTitle({ title: 'Hello World' });
    HWH5.navTitle({ title: 'UBAINS会议' }).catch(error => {
      console.log('设置标题异常', error);
    });
    // const {
    //   homeInfo, dataList, getHomeInfo, getFetchDemo
    // } = this.props;
    // if (!homeInfo) {
    //   getHomeInfo().then(data => {
    //     document.title = data.title;
    //   });
    // }
    // if (!dataList || dataList.length === 0) {
    //   getFetchDemo();
    // }
  }
  // 打开新的窗口
  // openWebview(url) {
  //   window.HWH5.openWebview({ uri: url });
  // }

  componentDidMount() { }

  componentWillUnmount() { }

  constructor(props) {
    super(props);
    this.state = {
      huiyi: [
        {
          imgurl: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554715557&di=1b4ad90e0ef89827aa76bb93db8313b2&src=http://www.yw2005.com/baike/uploads/allimg/160618/1-16061Q52129649.jpg",
          virtue: ["无线投屏", "本地扩声", "视屏会议", "电话会议"],
          flag: true,
          num: 10
        },
        {
          imgurl: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554715557&di=1b4ad90e0ef89827aa76bb93db8313b2&src=http://www.yw2005.com/baike/uploads/allimg/160618/1-16061Q52129649.jpg",
          virtue: ["视屏会议", "电话会议"],
          flag: true,
          num: 20
        },
        {
          imgurl: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554715557&di=1b4ad90e0ef89827aa76bb93db8313b2&src=http://www.yw2005.com/baike/uploads/allimg/160618/1-16061Q52129649.jpg",
          virtue: ["无线投屏", "本地扩声", "视屏会议", "电话会议"],
          flag: true,
          num: 30
        },
        {
          imgurl: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554715557&di=1b4ad90e0ef89827aa76bb93db8313b2&src=http://www.yw2005.com/baike/uploads/allimg/160618/1-16061Q52129649.jpg",
          virtue: ["无线投屏", "本地扩声"],
          flag: true,
          num: 40
        },
        {
          imgurl: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554715557&di=1b4ad90e0ef89827aa76bb93db8313b2&src=http://www.yw2005.com/baike/uploads/allimg/160618/1-16061Q52129649.jpg",
          virtue: ["无线投屏", "本地扩声", "电话会议"],
          flag: true,
          num: 50
        },
        {
          imgurl: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554715557&di=1b4ad90e0ef89827aa76bb93db8313b2&src=http://www.yw2005.com/baike/uploads/allimg/160618/1-16061Q52129649.jpg",
          virtue: ["视屏会议", "电话会议"],
          flag: false,
          num: 60
        },
        {
          imgurl: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554715557&di=1b4ad90e0ef89827aa76bb93db8313b2&src=http://www.yw2005.com/baike/uploads/allimg/160618/1-16061Q52129649.jpg",
          virtue: ["无线投屏", "本地扩声"],
          flag: false,
          num: 70
        },
        {
          imgurl: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554715557&di=1b4ad90e0ef89827aa76bb93db8313b2&src=http://www.yw2005.com/baike/uploads/allimg/160618/1-16061Q52129649.jpg",
          virtue: ["无线投屏", "本地扩声", "视屏会议", "电话会议"],
          flag: false,
          num: 80
        },
      ]
    }
  }

  render() {

    return (
      <div className="container">
        <div className="banner">
          <div className="seach">
            <Link to="/desc" className="search_a">
              <img src={search} />
              <span>请输入会议室名称、状态…</span>
            </Link>
          </div>
        </div>
        <div className="meetinglist">
          <p>会议室列表
            <span>———</span>
          </p>
        </div>
        <div className="meetlist">
          <ul>
            {
              this.state.huiyi.map((item, i) => (

                <li key={i}>
                  <Link to={item.flag ? "/details" : "#"} replace>
                    <img src={item.imgurl} title="" />
                    <div className="meetfunk">
                      <p>功能:{item.virtue.join(',')}</p>
                      <div>
                        <span style={{ background: (item.flag) ? 'blue' : 'red' }}>{item.flag ? '可用' : '已满'}</span>
                        <span>{item.num}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <Footer tab={0} />
      </div>
    );
  }
}

Home.propTypes = {
  homeInfo: PropTypes.object,
  dataList: PropTypes.array,
  getHomeInfo: PropTypes.func,
  getFetchDemo: PropTypes.func
};
