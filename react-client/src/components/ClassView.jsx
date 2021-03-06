import React from 'react';
import axios from 'axios';
import StudentClassChart from './StudentClassChart.jsx';

class ClassView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      assignmentData: [],
      overallGrade: null,
      eachGrade: [],
      class: {},
      student: {}
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
      this.setState({
        assignmentData: studentClasses.data,
      });
      console.log('Success from GET /students/classes');
    })
    .catch(error => {
      console.log('Error from GET /students/classes', error);
    });
  
    axios.get('/students/classes', config)
    .then(studentClasses => {
      this.setState({
        class: studentClasses.data[0]
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

  getThisStudentsOverallGrade () {
    var gradeArray = this.state.assignmentData[0];
    var total = 0;

    for (var i = 0; i < gradeArray.length; i++) {
      total += parseInt(gradeArray[i].grade);
    }

    var overallGrade = total / gradeArray.length;

    this.setState({overallGrade: overallGrade}) 
  }

  getStudentsGradeEachAssignment () {
    var gradeArray = this.state.assignmentData[0];
    var eachGradeArray = [];

    for (var i = 0; i < gradeArray.length; i++) {
      eachGradeArray.push(parseInt(gradeArray[i].grade));
    }

    this.setState({eachGrade: eachGradeArray})
  }

  render () {
    var assignmentData = this.state.assignmentData[1] || [];
    var thisStudentGrades = this.state.assignmentData[0] || [];
    var eachGrade = this.state.eachGrade || [];
    return (
      <div>
        <h1>ClassView</h1>
        <h2>Class : {this.state.class.name}</h2>
        <h2 onClick={ () => this.getThisStudentsOverallGrade()} >
          Overall Grade: {this.state.overallGrade || '[click]'}
        </h2>
        <h3>Past Assignments:</h3>
        {assignmentData.map((assgn, index) =>
          <h4 key={index}>{index}: {assgn.name}</h4>  
        )}
        <h3 onClick={ () => this.getStudentsGradeEachAssignment()} >
          Chart Grades [click]
        </h3>
        <div className="displayedGraph">
          <StudentClassChart type="Class" 
            grades={this.state.eachGrade} 
            studentId={this.props.studentId}
            studentName={this.state.student.first_name}
          />
        </div>
      </div>
    )
  }
}

export default ClassView;