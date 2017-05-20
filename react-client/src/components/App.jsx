import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, Redirect } from 'react-router-dom';
import CreateUser from './CreateUser.jsx';
import Nav from './Nav.jsx';
import axios from 'axios';
import DocumentsList from './DocumentsList.jsx';
import CreateDocument from './CreateDocument.jsx';
import Video from './Video.jsx';
import Logout from './Logout.jsx';
import TeacherClasses from './teacherSpecific/TeacherClasses.jsx';
import TeacherClass from './teacherSpecific/TeacherClass.jsx';
import Home from './Home.jsx';
import StudentsList from './StudentsList.jsx';
import StudentView from './StudentView.jsx';
import ClassView from './ClassView.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    console.log('HELLO', this.props);
  }

  render () {
    if (!this.props.isLoggedIn) {
      return (<Redirect to="login"/>);
    } else {
      return (
        <div>
          <Nav userType={this.props.userType}/>
          <div className="main container-fluid col-md-12">
              <Route name="home" exact path="/" component={() => (<Home firstName={this.props.firstName}/> )} />
              <Route name="nav" path="/nav" component={Nav} />
              <Route name="admin" path="/admin" component={() => (<CreateUser /> )} />
              <Route name="documents" path="/documents" component={() => (<DocumentsList userType={this.props.userType} /> )} />
              <Route name="createDocument" path="/createDocument" component={() => (<CreateDocument userType={this.props.userType} reRender={this.reRender}/>)} />
              <Route name="video" path="/video" component={() => (<Video /> )} />
              <Route name="logout" path="/logout" component={() => (<Logout revokeCredentials={this.props.revokeCredentials}/> )} />
              <Route name="createDocument" path="/createDocument" component={() => (<CreateDocument userType={this.props.userType} reRender={this.reRender}/>)} />
              <Route name="classes" exact path="/classes" component={TeacherClasses} />
              <Route exact path="/classes/:id" render={innerProps => (
                <TeacherClass id={innerProps.match.params.id} />
              )} />
            <Route name="students" exact path="/students" component={() => (
              <StudentsList 
                userType={this.props.userType} 
                userFirstName={this.props.firstName}
              /> 
            )} />
            <Route name="studentView" exact path="/students/:studentId" render={innerProps => (
              <StudentView studentId={innerProps.match.params.studentId} />
            )} />
            <Route name="classView" exact path="/students/:studentId/class/:classId" render={innerProps => (
              <ClassView 
                classId={innerProps.match.params.classId} 
                studentId={innerProps.match.params.studentId}
              />
            )} />
          </div>
        </div>
      )
    }
  }
}

export default App;