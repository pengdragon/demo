import React from 'react';
import './index.less';
import { SearchBar } from 'react-weui';

export default class Seach extends React.Component {
  // state={
  //   searchText: 'a'
  // };

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="search">
        <SearchBar
          // onChange={this.handleChange.bind(this)}
          // defaultValue={this.state.searchText}
          placeholder="请输入会议室名称"
          // lang={{
          //   cancel: 'Cancel'
          // }}
        />
      </div>
    );
  }
};
