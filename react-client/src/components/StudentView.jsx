import React from 'react';
import axios from 'axios';
import Class from './Class.jsx';

class StudentView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      classes: []
    }
  }

  componentDidMount () {
    let currentToken = window.localStorage.accessToken;

    let config = {
      params: {studentId: this.props.studentId},
      headers: {'Authorization': currentToken}
    };

    axios.get('/students/classes', config)
    .then(studentClasses => {
      // console.log('STUDENT CLASSES: ', studentClasses);
      this.setState({
        classes: [studentClasses.data]
      });
      console.log('Success from GET /students/classes');
    })
    .catch(error => {
      console.log('Error from GET /students/classes', error);
    });
  }

  render () {
    return (
      <div className="StudentView">
        <h1>Student View</h1>
        <h2>Student ID: {this.props.studentId}</h2>
        <h3>classes:</h3>
        {this.state.classes.map((studentClass, index) => 
          <Class 
            class={studentClass} 
            key={index}
            studentId={this.props.studentId}
          />
        )}
      </div>
    )
  }
}

export default StudentView;