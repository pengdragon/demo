/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */

import React from 'react';
import './index.less';
import { Tab, TabBar, TabBarItem } from 'react-weui';
import { Link } from 'react-router-dom';
import UnTabBarlist from '../../../public/images/meeting.png';
import TabBarlist from '../../../public/images/meeting2.png';
import UnTabBarmeet from '../../../public/images/room.png';
import TabBarmeet from '../../../public/images/room2.png';
import UnTabBarordain from '../../../public/images/ordain.png';
import TabBarordain from '../../../public/images/ordain2.png';
import UnTabBarmy from '../../../public/images/my.png';
import TabBarmy from '../../../public/images/my2.png';
export default class Footer extends React.Component {

  componentWillMount(props) {
   
  }

  componentDidMount(props) {
    // console.log('componentDidMount' + this.props.tab);
  }

  render() {
    return (
      <div className="footer-container"> 
        <Tab>
          <TabBar>
            <div className="weui-tabbar__item">
              <Link to="/home" replace>
                <TabBarItem
                  // eslint-disable-next-line react/destructuring-assignment
                  active={this.props.tab === 0}
                 
                  icon={this.props.tab === 0 ? <img src={TabBarlist} alt="" /> : <img src={UnTabBarlist} alt="" />}
                  label="会议室"
                />
              </Link>
            </div>
            <div className="weui-tabbar__item">
              <Link to="/meeting" replace>
                <TabBarItem
                  // eslint-disable-next-line react/destructuring-assignment
                  active={this.props.tab === '1'}
                 
                  icon={this.props.tab === '1' ? <img src={TabBarmeet} alt="" /> : <img src={UnTabBarmeet} alt="" />}
                  label="预定"
                />
              </Link>
            </div>
            <div className="weui-tabbar__item">
              <Link to="/schedule" replace>
                <TabBarItem
                  // eslint-disable-next-line react/destructuring-assignment
                  active={this.props.tab === '2'}
                 
                  icon={this.props.tab === '2' ? <img src={TabBarordain} alt="" /> : <img src={UnTabBarordain} alt="" />}
                  label="日程"
                />
              </Link>
            </div>
            <div className="weui-tabbar__item">
              <Link to="/my" replace>
                <TabBarItem
                  // eslint-disable-next-line react/destructuring-assignment
                  active={this.props.tab === '3'}
                  
                  icon={this.props.tab === '3' ? <img src={TabBarmy} alt="" /> : <img src={UnTabBarmy} alt="" />}
                  label="我的"
                />
              </Link>
            </div>
            
          </TabBar>
        </Tab>
      </div>
    );
  }
};
