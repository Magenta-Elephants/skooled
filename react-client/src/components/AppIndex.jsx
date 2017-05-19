import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import Login from './Login.jsx';
import CreateUser from './CreateUser.jsx';
import Nav from './Nav.jsx';
import axios from 'axios';
import DocumentsList from './DocumentsList.jsx';
import CreateDocument from './CreateDocument.jsx';
import Video from './Video.jsx';
import Logout from './Logout.jsx';
import App from './App.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AppIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loggedIn: false,
      userType: '',
      firstName: ''
    }
    this.sendCredentials = this.sendCredentials.bind(this);
    this.revokeCredentials = this.revokeCredentials.bind(this);
  }

  sendCredentials(username, password) {
    axios.post('/login', {username: username, password: password})
    .then(response => {
      this.setState({
        loggedIn: response.data.isLoggedIn,
        userType: response.data.userRole,
        firstName: response.data.firstName
      });
      window.localStorage.accessToken = response.data.jwtToken;
    })
    .catch(error => {
      console.log('error, received no response from server');
    });
    event.preventDefault();
  }

  revokeCredentials() {
    this.setState({
      username: '',
      password: '',
      loggedIn: false,
      userType: '',
      firstName: ''
    });
    window.localStorage.accessToken = '';
  }

  componentWillMount() {
    var currentToken = window.localStorage.accessToken;
    var config = {
      headers: {'Authorization': currentToken}
    };

    axios.get('checkOnClientLoad', config)
    .then(response => {
      this.setState({
        loggedIn: true,
        userType: response.data.userRole,
        firstName: response.data.firstName
      });
      console.log(response);
    })
    .catch(error => {
      console.log('error, received no response from server');
    });
  }

  render () {
    return (
      <MuiThemeProvider>
        <BrowserRouter>
          <div>
            <Switch>
              <Route name="login" path="/login" component={() => (<Login enterCredentials={this.sendCredentials} isLoggedIn={this.state.loggedIn} /> )}/>
              <Route name="app" path="/" component={() => (<App isLoggedIn={this.state.loggedIn} revokeCredentials={this.revokeCredentials} userType={this.state.userType} firstName={this.state.firstName} /> )}/>
            </Switch>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default AppIndex;