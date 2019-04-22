import React from 'react';
import './index.less';
import { Button, Form, FormCell, CellHeader, CellFooter, CellBody, Input, Label, Radio, Icon } from 'react-weui';
import user from '../../../public/images/user.png';

export default class Edit extends React.Component {

  componentWillMount() {
    window.HWH5.navTitle({ title: '资料修改' });
  }

  componentDidMount() {
  }

  render() {
    return (
        <Form>
          <FormCell>
            <CellHeader>
              <Label>头像：</Label>
            </CellHeader>
            <CellBody>
            </CellBody>
            <CellFooter><img src={user} alt="" /></CellFooter>
          </FormCell>

          <FormCell>
            <CellHeader>
              <Label>手机：</Label>
            </CellHeader>
            <CellBody>
              <Input type='tel' placeholder="12345678912" />
            </CellBody>
          </FormCell>
          <FormCell>

            <CellHeader>
              <Label>昵称：</Label>
            </CellHeader>
            <CellBody>
              曾一一
            </CellBody>
          </FormCell>

          <FormCell>
            <CellHeader>
              <Label>邮箱：</Label>
            </CellHeader>
            <CellBody>
              <Input type='email' placeholder="1234567891@qq.com" />
            </CellBody>
          </FormCell>

          <FormCell>
            <CellHeader>
              <Label>性别：</Label>
            </CellHeader>
            <div className="sex">
              <span>男<input type="radio" name="sex" value="1" checked /></span>
              <span>女<input type="radio" name="sex" value="2" /></span>
            </div>
          </FormCell>
           
           <Button className="weui-btn_primary button">保存</Button>

        </Form>
    );
  }
};
