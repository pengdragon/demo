import React from 'react';
import './index.less';

import { Link } from 'react-router-dom';

import { Tabs } from 'antd-mobile'
import { Button } from 'react-weui'

export default class Meeting extends React.Component {

  constructor(props){
    super(props);
    this.state={
      isSecrecy:false, //是否保密
      inpLength:0, //文本域长度
      tabs:[
        { title: '今天',selected:0 },
        { title: '明天',selected:1 },
        { title: '后天',selected:2 },
      ],
      optionTime:["00","01","02","03","04","05","06","07","08","09",10,11,12,13,14,15,16,17,18,19,20,21,22,23],
      optiontime:["00",15,30,45],
      Modeflag:false
    }
  }
  componentWillMount() {
    window.HWH5.navTitle({ title: '预定会议' });
  }

  componentDidMount() {
  }

  componentDidUpdate(){
  }
  // 添加议题 
  AddSetting = () => {
    // console.log("xixi")
    var inpBox = this.refs.input;
    var div = document.createElement("div");
    var inp = document.createElement("input");
    var p = document.createElement("p");
    var remove = document.createElement("div");
    remove.className="meeting_remove"
    remove.innerHTML="×"
    inp.type="text";
    inp.placeholder="输入议题";
    div.className="setting_s setting_p"
    div.appendChild(inp);
    div.appendChild(p);
    div.appendChild(remove);
    inpBox.appendChild(div);
    // 删除议题
    remove.onclick = function(){
      this.parentNode.remove()
    }
  }

  // 是否保密(常规)
  convention = (e) =>{
    e.stopPropagation()
    this.setState({
      isSecrecy: false
    })
    // var _this = this
    // setTimeout(function(){
    //   console.log(_this.state.isSecrecy)
    // },10)
  }

  // 是否保密(保密)
  secrecy = (e) =>{
    e.stopPropagation()
    this.setState({
      isSecrecy: true
    })
    // var _this = this
    // setTimeout(function(){
    //   console.log(_this.state.isSecrecy)
    // },10)
  }

  // 文本域长度显示
  inpLength = () =>{
    var inplen = this.refs.inpLength.value.length
    console.log(inplen)
    this.setState({
      inpLength:inplen
    })
  }

  // 方式选择
  Modeflag = (e) =>{
    e.stopPropagation()
    this.setState(prevState => ({
      Modeflag: !prevState.Modeflag
  }))
  }
  render() {
    return (
      <div id="meeting">

        {/* 预定会议基本信息 */}
        <div className="meeting_input" >

          {/* 会议名称 */}
          <div className="meeting_inp">
            <span>*会议名称:</span>
            <input type="text" placeholder="请输入会议名称" />
            <p></p>
          </div>

          {/* 发起人 */}
          <div className="meeting_inp">
            <span>*发&ensp;起&ensp;人:</span>
            <input type="text" placeholder="嘻嘻" />
            <p></p>
          </div>

          {/* 添加议题 */}
          <div className="setting" ref="input">
            <div className="setting_s">
              <span>添加议题:</span>
              <input type="text" placeholder="输入议题" />
              <div className="addSetting" onClick={ this.AddSetting }>+</div>
              <p></p>
            </div>
          </div>  
          
          {/* 是否保密 */}
          <div className="meeting_inp meeting_secrecy" style={{ height:(this.state.isSecrecy) ? "90px":"49px" }}>
            <span>是否保密:</span>
            <div className="secrecy" >
              <label onClick={this.convention}>
                <input type="radio" name="secrecy" value="" defaultChecked />&emsp;常规
                <span></span>
              </label>
              <label onClick={this.secrecy}>
                <input type="radio" name="secrecy" value="" />&emsp;保密
                <span></span>
              </label>
            </div>
            {/* <div className="secrecy_pwd" style={{ bottom:(this.state.isSecrecy)? "15px" : "-80px" }}> */}
            <div className="secrecy_pwd" style={{ opacity:(this.state.isSecrecy)? 1 : 0 }}>
              <span>会议密码:</span>
              <input type="text" placeholder="请输入会议密码" />
            </div>
            <p style={{ width:(this.state.isSecrecy)? "100%":"0"}}></p>
          </div>
        
          {/* 会议信息 */}
          <div className="conference">
            <span>会议信息:</span>
            <textarea onChange={ this.inpLength } placeholder="输入内容"  maxLength="140" name="输入内容" ref="inpLength"></textarea>
            <div>{ this.state.inpLength }<p>/140</p></div>
          </div>
        </div>
      
        {/* 预定会议时间 */}
        <div className="meeting_time">

          {/* 选择日期 */}
          <div className="meeting_date">
            {/* <ul>
              <li>今天</li>
              <li>明天</li>
              <li>后天</li>
              <li>选择日期</li>
            </ul> */}
            <Tabs className="dateTab" tabs={this.state.tabs}
              initalPage={'t2'}
            >
            </Tabs>
            <div className="optionDate">选择日期</div>
          </div>
            
          {/* 选择时间 */}
          <div className="optionTime">

            {/* 分钟 */}
            <ul className="time_minute">
              { this.state.optiontime.map((item,i) => (
                <li key={i}>{item}分钟</li>
              )) }
            </ul>

            <div className="time_box">

              {/* 小时 */}
              <ul className="time_hour">
                { this.state.optionTime.map((item,i) => (
                  <li key={i}>{item}:00</li>
                )) }
              </ul>

              {/* 具体时间(小格子) */}
              <ul className="precise_time">
                  { this.state.optionTime.map((item1,i) => (
                    <li key={i}>
                      { this.state.optiontime.map((item2,i) => (
                        <div key={i}>{ item1 }:{ item2 }</div>
                      )) }
                    </li>
                  )) }
              </ul>
            </div>
          </div>
          
          {/* 会议时间 */}
          <div className="MeetingTime">会议时间:&ensp;0分钟</div>
        </div>
        
        {/* 参与人员 */}
        <div className="participant">
          <Link to="/company">公司参与人员</Link>
          <Link to="#">邀请外部人员</Link>
        </div>

        {/* 方式or提醒 */}
        <div className="ModeOrReminder">
          <span style={{ height:(this.state.Modeflag)? "100px":"60px" }} onClick={this.Modeflag}>
            <p>*</p>&nbsp;方式
            <div style={{ transform:(this.state.Modeflag) ? "rotate(90deg)":"rotate(0deg)" }}></div>
          </span>
          <span>
            <p>*</p>&nbsp;提醒
            <div></div>
          </span>
        </div>
      
        {/* 预定按钮 */}
        <div className="meeting_Btn">
          <Button className="meeting_btn">预定</Button>
        </div>
      </div>
    );
  }
};
