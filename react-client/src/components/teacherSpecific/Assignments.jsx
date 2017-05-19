import React from 'react';
import Chart from './Chart.jsx';
import AddToListModal from './AddToListModal.jsx'; 
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';

class Assignments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentAssignment: { grades: []},
      assignmentName: '',
      showGradeModal: false,
      studentName: '',
      grade: ''
    };
    this.changeProp = this.changeProp.bind(this);
    this.submitGrade = this.submitGrade.bind(this);
    this.submitAssignment = this.submitAssignment.bind(this);
  }

  changeProp(key, val) {
    this.setState({
      [key]: val
    });
  }

  openGradeModal(index) {
    this.setState({
      showGradeModal: true,
      currentAssignment: this.props.assignments[index]
    });
  }

  submitGrade() {
    var data = {
      studentName: this.state.studentName,
      Ass_Id: this.state.currentAssignment.id,
      Grade: this.state.grade
    };
    var config = {
      headers: {'Authorization': window.localStorage.accessToken},
    };

    axios.post('/teacher/class/addGrade', data, config)
      .then((response) => {
        console.log('success!', response);
        this.setState({
          grade: ''
        });
      })
      .catch((err) => {
        console.log('error!', err);
      });
  }

  submitAssignment() {
    var data = {
      name: this.state.name
    };
    var config = {
      headers: {'Authorization': window.localStorage.accessToken},
    };

    axios.post('/teacher/class/addAssignment', data, config)
      .then((response) => {
        console.log('success!', response);
      })
      .catch((err) => {
        console.log('error!', err);
      });
  }

  render() {
    const gradeActions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={ e => this.changeProp('showGradeModal', false) } />,
      <FlatButton label="Submit" primary={true} onTouchTap={this.submitGrade} />
    ];

    var assignmentForm = 
      <form>
        <label>Assignment Name:
        <input type="text" onChange={ e => this.changeProp('assignmentName', e.target.value) } />
        </label>
      </form>

    return (
      <div className="displayedTab">
        <div className="displayList">
          <ul>
            {
              this.props.assignments.map((element, index) => 
                <div key={index}>     
                  <li onClick={ () => this.changeProp('currentAssignment', this.props.assignments[index]) }>{element.Name}</li>
                  <button onClick={ () => this.openGradeModal(index) }>Add Grade</button>
                </div>
              )
            }
          </ul>
          <AddToListModal title="Add an Assigment" buttonLabel="Add Assignment" modalContents={assignmentForm} handleSubmit={this.submitAssignment} />
          <Dialog title="Add a Grade" actions={gradeActions} modal={true} open={this.state.showGradeModal}>
            <form>
              Select Student
              <select onChange={ e => this.changeProp('studentName', e.target.value) } >
                {
                 this.props.students.map((element, index) => {
                    return <option key={index} value={element.id}>{element.F_Name + ' ' + element.L_Name}</option>
                  })
                }
              </select>
              Grade
              <input type="text" value={this.state.grade} onChange={ e => this.changeProp('grade', e.target.value) } />
            </form>
          </Dialog>

        </div>
        <div className="displayedGraph">
          <Chart type="Assignment" item={this.state.currentAssignment} />
        </div>
      </div>
    )
  }
}

export default Assignments;