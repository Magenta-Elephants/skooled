import React from 'react';
import axios from 'axios';

class ClassView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    let currentToken = window.localStorage.accessToken;

    let config = {
      headers: {'Authorization': currentToken}
    };

    axios.get('/students/classDetail', config)
    .then(studentClasses => {
      this.setState({
        classes: studentClasses.data
      });
      console.log('Success from GET /students/classes');
    })
    .catch(error => {
      console.log('Error from GET /students/classes', error);
    });
  }

  render () {
    return (
      <div>
        <h1>ClassView</h1>
        <h2>Class ID: {this.props.classId}</h2>
        <h3>Past Assignments</h3>
          <p>Pop Quiz</p>
          <p>Test 1</p>
          <p>Midterm</p>
      </div>
    )
  }
}

export default ClassView;