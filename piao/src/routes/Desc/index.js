/* eslint-disable react/sort-comp */
import React from 'react';
import { Link } from 'react-router-dom';
import './index.less';

import { Button } from 'react-weui'

export default class Desc extends React.Component {

  componentWillMount() {
    window.HWH5.navTitle({ title: '搜索会议室' });
  }

  componentDidMount() {

    HWH5.getAuthCode({
      clientId: '20190226111443945'
    }).then(data => {
      console.log(data)
    }).catch(error => {
      console.log('获取异常' + error)
    })

  }

  handleClick = () => {

  }
  constructor(props) {
    super(props);
    this.state = {
      flag: false
    }
    this.checkbox = this.checkbox.bind(this);
  }

  checkbox(e) {
    e.stopPropagation()
    this.setState(prevState => ({
      flag: !prevState.flag
    }));

    // 取消input焦点
    this.refs.num.blur()
    this.refs.inputext.blur()
    // console.log(num,guanjian)
    // console.log(this.state.flag);
  }



  render() {
    return (
      <div>
        <div className="search">
          <div className="inp">
            <span>人&emsp;数:</span>
            <input type="number" placeholder="请输入参会人数" ref="num" />
            <p></p>
          </div>
          <div className="inp">
            <span>关键字:</span>
            <input type="text" placeholder="请输入关键字" ref="inputext" />
            <p></p>
          </div>
          <div className="inp" style={{ height: (this.state.flag) ? "100px" : "45px" }}>
            <span className="gongneng" onClick={this.checkbox}>功&emsp;能:
              <div style={{ transform: (this.state.flag) ? "rotate(90deg)" : "rotate(0deg)" }}></div>
            </span>
            <div className="checkbox" style={{ bottom: (this.state.flag) ? "0" : "-80px" }}>
              <label className="check">
                <input type="checkbox" id="check1" />
                <label for="check1"></label>视频会议
              </label>
              <label className="check">
                <input type="checkbox" id="check2" />
                <label for="check2"></label>电话会议
              </label>
              <label className="check">
                <input type="checkbox" id="check3" />
                <label for="check3"></label>无线投屏
              </label>
              <label className="check">
                <input type="checkbox" id="check4" />
                <label for="check4"></label>本地扩声
              </label>
              <label className="check">
                <input type="checkbox" id="check5" />
                <label for="check5"></label>电子白板
              </label>
              <label className="check">
                <input type="checkbox" id="check6" />
                <label for="check6"></label>语音识别
              </label>
            </div>
            <p style={{ width: (this.state.flag) ? "100%" : "0" }}></p>
          </div>
        </div>
        <div className="CasePanel">
          <Button className="serbtn">查询</Button>
        </div>
      </div>
    );
  }
}
