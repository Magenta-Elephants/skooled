import React from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

const Nav = (props) => {
  if (props.userType === 'teacher') {
    return (
      <div id="menuToggle">
      <input type="checkbox" />
      <span></span>
      <span></span>
      <span></span>
        <ul className="nav nav-pills nav-stacked col-md-3" id="menu">
        <li role="presentation"><Link to="logout">Sign Out</Link></li>
        <li role="presentation"><Link to="documents">Documents</Link></li>
        <li role="presentation"><Link to="video">Video</Link></li>
        <li role="presentation"><Link to="admin">Settings</Link></li>
        <li role="presentation"><Link to="classes">Classes</Link></li>
        </ul>
      </div>
    )
  } else {
    return (
      <div id="menuToggle">
      <input type="checkbox" />
      <span></span>
      <span></span>
      <span></span>
        <ul className="nav nav-pills nav-stacked col-md-3" id="menu">
        <li role="presentation"><Link to="logout">Sign Out</Link></li>
        <li role="presentation"><Link to="documents">Documents</Link></li>
        <li role="presentation"><Link to="video">Video</Link></li>
        </ul>
      </div>
    )
  }
  
}

export default Nav;