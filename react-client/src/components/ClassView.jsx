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
      params: {
        classId: this.props.classId,
        studentId: this.props.studentId
      },
      headers: {'Authorization': currentToken}
    };

    axios.get('/students/classDetail', config)
    .then(studentClasses => {
      console.log('STUDENT CLASSES: ', studentClasses.data)
      // studentClasses.data = [[current students grades for all assignments], [all assignments with all students grades]]
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
    console.log('CLASS VIEW PROPS: ',this.props)
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