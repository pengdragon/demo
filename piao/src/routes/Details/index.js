import React from 'react';
import './index.less';

import { Link } from 'react-router-dom';

// ui框架
import { Button } from 'react-weui'

// 图片
import huiyiimg from '../../../public/images/list-banner.png' ;

export default class details extends React.Component {

  async componentWillMount() {
    HWH5.navTitle({ title: '会议室详情' }).catch(error => {
      console.log('设置标题异常', error);
    });
  }

  constructor(props){

    super(props);

    this.state={
      huiyixinxi:{
        imgurl:huiyiimg,
        huiyishiName : '福州小会议室',
        huiyigongneng : [
          '视频会议',
          '电话会议',
          '无线投屏',
          '本地扩声',
          '哈哈哈哈'
        ],
        renshu:10,
        didian:[
          '深圳',
          '宝安区'
        ],
        huiyi:[
          {
            huiyimingcheng:'哈哈哈哈哈哈哈哈嗝',
            faqiren:'嘻嘻',
            huiyishijian:'15:30-16:00'
          },
          {
            huiyimingcheng:'测试2',
            faqiren:'呵呵',
            huiyishijian:'16:01-16:30'
          },
          {
            huiyimingcheng:'测试3',
            faqiren:'哈哈',
            huiyishijian:'16:31-16:32'
          }
        ]
      }
    }
  }
  componentDidMount() {
  }

  render() {
    return (
      <div className="details">
        <img src={ this.state.huiyixinxi.imgurl } />
        <div className="meetingroom">
          <h3>{ this.state.huiyixinxi.huiyishiName }</h3>
          <ul>
            <li>功能:&ensp;{ this.state.huiyixinxi.huiyigongneng.join(',') }</li>
            <li>人数:&ensp;{ this.state.huiyixinxi.renshu }人</li>
            <li>地点:&ensp;{ this.state.huiyixinxi.didian.join(' | ') }</li>
          </ul>
        </div>
        <h3 className="daymeeting">当天会议</h3>
        <span className="meetingtime">2019-04-12</span>
        <ul className="meetingmsg">
          { 
            this.state.huiyixinxi.huiyi.map((item,i) => (
              <li key={ i }>
                <div>
                  <span>会议名称:&ensp;{ item.huiyimingcheng }</span>
                  <span>发起人:&ensp;{ item.faqiren }</span>
                </div>
                <div>会议时间:&ensp;{ item.huiyishijian }</div>
              </li>
            ))
           }
        </ul>
        <Link to="/meeting" className="button">
          <Button className="btn">添加预定</Button>
        </Link>
      </div>
    );
  }
};
