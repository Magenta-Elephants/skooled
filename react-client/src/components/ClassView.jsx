import React from 'react';
import axios from 'axios';

class ClassView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      assignmentData: [],
      assignmentsName: '',
      assignmentsGrade: '',
      overallGrade: ''
    }
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
        assignmentData: studentClasses.data,
        assignmentsName: studentClasses.data[1][0].name,
        assignmentsGrade: studentClasses.data[0][0].grade
      });
      console.log('Success from GET /students/classes POOOOOOOOOOP');
    })
    .catch(error => {
      console.log('Error from GET /students/classes', error);
    });
  }

  getThisStudentsOverallGrade () {
    var gradeArray = this.state.assignmentData[0];
    var total = 0;

    for (var i = 0; i < gradeArray.length; i++) {
      total += parseInt(gradeArray[i].grade);
    }

    this.setState({overallGrade: total / gradeArray.length}) 
  }

  render () {
    var assignmentData = this.state.assignmentData[1] || [];
    return (
      <div>
        <h1>ClassView</h1>
        <h2>Class ID: {this.props.classId}</h2>
        <h2>overall grade: {this.getThisStudentsOverallGrade}</h2>
        <h3>Past Assignments:</h3>
        {assignmentData.map((assgn, index) =>
          <h4 key={index}>{assgn.name}</h4> 
        )}      
      </div>
    )
  }
}

export default ClassView;