import React from 'react';
import './index.less';
import { TabBarIcon, TabBarLabel } from 'react-weui';
import { Link } from 'react-router-dom';
export default class MyTabIcon extends React.Component {

  componentWillMount() {
  }

  componentDidMount() {

  }

  render() {
  
    return (
      <div>
        <Link to={this.props.url}>
          <TabBarIcon>
            <img src={this.props.imgUrl} alt="" />
          </TabBarIcon>
          <TabBarLabel>{this.props.label}</TabBarLabel>
        </Link>
      </div>
    );
  }
};
