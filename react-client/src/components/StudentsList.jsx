import React from 'react';
import axios from 'axios';
import Student from './Student.jsx';
// import CreateDocument from './CreateDocument.jsx';
import { BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';

class StudentsList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      students: []
      // renderCreateNew: false
    };
    // this.renderRedirect = this.renderRedirect.bind(this);
    let currentToken = window.localStorage.accessToken;
    // console.log('currentToken', currentToken);
  }

  componentDidMount () {
    let currentToken = window.localStorage.accessToken;

    let config = {
      headers: {'Authorization': currentToken}
    };

    axios.get('/students', config)
    .then(studs => {
      this.setState({
        students: [studs.data]
      });
    })
    .catch(error => {
      console.log('Error back from GET /students request.', error);
    });
  }

  render () {
    return (
      <div>
        <h1>{this.props.userFirstName}'s Students</h1>
        {this.state.students.map((stud, index) => 
          <Student student={stud} key={index}/>
        )}
      </div>
    )    
  }
}

const style = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
};

export default StudentsList;