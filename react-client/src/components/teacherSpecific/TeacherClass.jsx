import React from 'react';
import axios from 'axios';
import { Tabs, Tab } from 'material-ui/Tabs';
import Students from './Students.jsx';
import Assignments from './Assignments.jsx';

class TeacherClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'Students',
      students: [],
      assignments: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.addStudent = this.addStudent.bind(this);
  }

  convertAssignments(assignments, students) {
    for (var t = 0; t < assignments.length; t++) {
      var assignment = assignments[t].id;
      // console.log('HERE 1')
      assignments[t].grades = []
      for (var s = 0; s < students.length; s++) {
        // console.log('HERE 2')
        for (var g = 0; g < assignments.length; g++) {
          // console.log('HERE 3')
          if (students[s].grades === undefined) {
            console.log('SHITS undefined')
              var studGrade = {
                F_Name: students[s].first_name,
                L_Name: students[s].last_name,
                Grade: undefined
              }
              assignments[t].grades.push(studGrade);
              if (t === assignments.length - 1) {
                this.setState({
                  students: students,
                  assignments: assignments
                })
              }
          } else if (assignment === students[s].grades[0][g].id_assignment) {
            console.log('PASSED THROUGH')
            var studGrade = {
              F_Name: students[s].first_name,
              L_Name: students[s].last_name,
              Grade: students[s].grades[0][g].grade
            }
            assignments[t].grades.push(studGrade);
            if (t === assignments.length - 1) {
              this.setState({
                students: students,
                assignments: assignments
              })
            }
            
          }
        }
      }
    }
  }

  getClassInfo() {
    axios.get('/teacher/class', config)
      .then((response) => {
        this.setState({
          students: response.data.students,
          assignments: response.data.assignments
        })
        this.convertAssignments(response.data.assignments, response.data.students);
      })
      .catch((err) => {
        console.log('error!', err);
      });
  }

  componentWillMount() {

    var config = {
      params:{ classId: this.props.id },
      headers: {'Authorization': window.localStorage.accessToken}
    };
    console.log('CONFIG', config);
    axios.get('/teacher/class', config)
      .then((response) => {
        this.setState({
          students: response.data.students,
          assignments: response.data.assignments
        })
        this.convertAssignments(response.data.assignments, response.data.students);
      })
      .catch((err) => {
        console.log('error!', err);
      });
  }

  handleChange(value) {
    this.setState({
      currentTab: value
    });
  }

  addStudent(student) {
    var students = this.state.students;
    students.push(student);
    this.setState({
      students: students
    });
  }

  render() {
    return (
      <div className="col-md-10 col-md-offset-1">
        <Tabs value={this.state.currentTab} onChange={this.handleChange} >
          <Tab label="Students" value="Students">
            <Students classId={this.props.id} students={this.state.students} addStudent={this.addStudent} />
          </Tab>
          <Tab label="Assignments" value="Assignments">
            <Assignments classId={this.props.id} assignments={this.state.assignments} students={this.state.students} />
          </Tab>
        </Tabs>
        <h1></h1>
      </div>
    )
  }
}

export default TeacherClass;