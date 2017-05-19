import React from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({
      showMenu: !this.state.showMenu
    });
  }

  render() {
    if (this.props.userType === 'teacher') {
      return (
        <div id="menuToggle">
          <input type="checkbox" checked={this.state.showMenu} onClick={this.toggleMenu} />
          <span></span>
          <span></span>
          <span></span>
            <ul className="nav nav-pills nav-stacked col-md-3" id="menu" onClick={this.toggleMenu}>
              <li role="presentation"><Link to="logout">Sign Out</Link></li>
              <li role="presentation"><Link to="documents">Documents</Link></li>
              <li role="presentation" type="checkbox"><Link to="video">Video</Link></li>
              <li role="presentation"><Link to="admin">Settings</Link></li>
              <li role="presentation"><Link to="classes">Classes</Link></li>
            </ul>
        </div>
      )
    } else {
      return (
        <div id="menuToggle">
          <input type="checkbox" checked={this.state.showMenu} onClick={this.toggleMenu} />
          <span></span>
          <span></span>
          <span></span>
            <ul className="nav nav-pills nav-stacked col-md-3" id="menu" onClick={this.toggleMenu}>
              <li role="presentation"><Link to="logout">Sign Out</Link></li>
              <li role="presentation"><Link to="documents">Documents</Link></li>
              <li role="presentation"><Link to="video">Video</Link></li>
            </ul>
        </div>
      )
    }
  }
}

export default Nav;