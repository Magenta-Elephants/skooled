import React from 'react';
import axios from 'axios';
import Class from './Class.jsx';

class StudentView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      classes: [],
      student: {}
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
      this.setState({
        classes: studentClasses.data
      });
      console.log('Success from GET /students/classes DOOODOO');
    })
    .catch(error => {
      console.log('Error from GET /students/classes', error);
    });

    axios.get('/students', config)
    .then(studs => {
      this.setState({
        student: studs.data
      });
    })
    .catch(error => {
      console.log('Error back from GET /students request.', error);
    });
  }

  render () {
    return (
      <div className="StudentView">
        <h1>Student View</h1>
        <h2>Student: {this.state.student.first_name}</h2>
        <h3>classes:</h3>
        {this.state.classes.map((studentClass, index) => 
          <Class 
            className={studentClass.name} 
            key={index}
            studentId={this.props.studentId}
            class={studentClass}
          />
        )}
      </div>
    )
  }
}

export default StudentView;