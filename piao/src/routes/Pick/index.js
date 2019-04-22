import React from 'react';
import { Link } from 'react-router-dom';
import './index.less';
import Pickimg from '../../../public/images/pick.png';

export default class Pick extends React.Component {

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <div className="Pickimg">
          <Link to="./desc">
            <img src={Pickimg} alt="" />
          </Link>
        </div>
      </div>
    );
  }
};
