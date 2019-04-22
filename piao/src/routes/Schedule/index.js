/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
import React from 'react';
import './index.less';
import {
  Tab, TabBody, NavBar, NavBarItem, Article, Button
} from 'react-weui';
import Footer from '../../components/Footer';
// import Scheduleimg from '../../../public/images/Schedule.png';


export default class Schedule extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tab: 0,
    };
  }

  componentWillMount() {
    window.HWH5.navTitle({ title: '我的日程' });
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        {/* <div className="Scheduleimg">
          <img src={Scheduleimg} alt="" />
        </div> */}
        <Tab>
          <NavBar>
            <NavBarItem active={this.state.tab === 0} onClick={e=>this.setState({ tab: 0 })}>我的预定</NavBarItem>
            <NavBarItem active={this.state.tab === 1} onClick={e=>this.setState({ tab: 1 })}>我的日程</NavBarItem>
          </NavBar>
          <TabBody>
            <Article style={{ display: this.state.tab === 0 ? null : 'none' }}>
              <div className="mymeetList">
                  <div className="meetinginfo">
                      <span>会议名称：日常会议12355565555aaaaaaa</span>
                      <span>主持人：曾一一</span>
                  </div>
                  <div className="meetinginfo">
                      <span>会议时间：14:30 - 15:30</span>
                      <span>部 门：组织部</span>
                  </div>
                  <div className="meetinginfo">
                      <div className="operat">会议操作：
                        <span className="modify">修改会议</span>
                        <span className="cancel">取消会议</span>
                      </div>
                  </div>
                  <div className="meetinginfo">
                      <div className="operat">地点：多功能战斗室</div>
                  </div>
              </div>
              
            </Article>
            <Article style={{ display: this.state.tab === 1 ? null : 'none' }}>
              <div className="mymeetList">
                  <div className="meetinginfo">
                      <span>会议名称：日常会议12355565555aaaaaaa</span>
                      <span>主持人：曾一一</span>
                  </div>
                  <div className="meetinginfo">
                      <span>会议时间：14:30 - 15:30</span>
                      <span>部 门：组织部</span>
                  </div>
                  <div className="meetinginfo">
                      <div className="operat">会议操作：
                        <span className="schedule">未开始</span>
                        <span className="modify">会议纪要</span>
                      </div>
                  </div>
                  <div className="meetinginfo">
                      <div className="operat">地点：多功能战斗室</div>
                  </div>
              </div>
            </Article>
          </TabBody>
        </Tab>

        <Footer tab="2" />
      </div>
    );
  }
};
