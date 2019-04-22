import React from 'react';
import { Link } from 'react-router-dom';
import { Cells, Cell, CellBody, CellFooter, CellHeader } from 'react-weui';
import './index.less';
import Footer from '../../components/Footer';
// import Myimg from '../../../public/images/mine.png';
import user from '../../../public/images/user.png';
import set from '../../../public/images/set.png';
import fk from '../../../public/images/fk.png';
import help from '../../../public/images/help.png';
import kf from '../../../public/images/kf.png';
import ls from '../../../public/images/ls.png';
import meeting from '../../../public/images/meeting.png';
import phone from '../../../public/images/phone.png';


export default class My extends React.Component {

  componentWillMount() {
    window.HWH5.navTitle({ title: '我的信息' });
  }

  componentDidMount() {
  }

  constructor(props){
    super(props);
    this.state={
      // timer:"xixi"
    }

  }
  render() {
    return (
        <div>
          <div className="myprofile">
            <div className="set">
              <Link to="./edit">
              <span><img src={set} alt="" /></span>
              <span>编辑</span>
              </Link>
            </div>
            <div className="user_info">
              <div className="userimg"><img src={user} alt="" /></div>
              <div className="user_text">
                <span>曾总</span>
                <span>用户账号：12345678912</span>
              </div>
            </div>
          </div> 
          <div>
            <Cells>
                <Cell href="javascript:;" access>
                    <CellHeader><img src={meeting} alt=""/></CellHeader>
                    <CellBody>我的会议</CellBody>
                    <CellFooter/>
                </Cell>
                <Cell access>
                    <CellHeader><img src={ls} alt=""/></CellHeader>
                    <CellBody>历史记录</CellBody>
                    <CellFooter/>
                </Cell>
                <Cell access>
                    <CellHeader><img src={help} alt=""/></CellHeader>
                    <CellBody>使用帮助</CellBody>
                    <CellFooter/>
                </Cell>
                <Cell access>
                    <CellHeader><img src={fk} alt=""/></CellHeader>
                    <CellBody>意见反馈</CellBody>
                    <CellFooter/>
                </Cell>
                <Cell access>
                    <CellHeader><img src={phone} alt=""/></CellHeader>
                    <CellBody>电话客服</CellBody>
                    <CellFooter>12345678912</CellFooter>
                </Cell>
                <Cell access>
                    <CellHeader><img src={kf} alt=""/></CellHeader>
                    <CellBody>在线客服</CellBody>
                    <CellFooter/>
                </Cell>
            </Cells>
          </div>
          <Footer tab="3" />
        </div>
    );
  }
};

