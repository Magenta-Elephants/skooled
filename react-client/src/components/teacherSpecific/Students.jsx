import React from 'react';
import axios from 'axios';
import Chart from './Chart.jsx';
import AddToListModal from './AddToListModal.jsx';

class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStudent: { grades: [] },
      firstName: '',
      lastName: ''
    };
    this.changeProp = this.changeProp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  changeStudent(index) {
    this.setState({
      currentStudent: this.props.students[index]
    });
  }

  changeProp(key, val) {
    this.setState({
      [key]: val
    });
  }

  handleSubmit() {
    var data = {
      studentData: {
        firstName: this.state.firstName,
        lastName: this.state.lastName 
      },
      classId: this.props.classId
    };
    var config = {
      headers: {'Authorization': window.localStorage.accessToken},
    };

    axios.post('/teacher/class/addStudentToClass', data, config)
      .then((response) => {
        console.log('success!', response);
        this.props.addStudent(response.data);
      })
      .catch((err) => {
        console.log('error!', err);
      });
  }


  render() {

    const form = 
      <form>
        <label>First Name:
        <input type="text" onChange={ (e) => this.changeProp('firstName', e.target.value) } />
        </label>
        <label>Last Name:
        <input type="text" onChange={ (e) => this.changeProp('lastName', e.target.value) } />
        </label>
      </form>

    return (
      <div className="displayedTab">
        <div className="displayedList">
          <ul>
            {
              this.props.students.map((element, index) => 
                <li onClick={ () => this.changeProp('currentStudent', this.props.students[index]) } key={index}>{element.first_name + ' ' + element.last_name}</li>
              )
            }
          </ul>
          <AddToListModal title="Add a Student" buttonLabel="Add Student" modalContents={form} handleSubmit={this.handleSubmit} />

        </div>
        <div className="displayedGraph">
          <Chart type="Student" item={this.state.currentStudent} />
        </div>
      </div>
    )
  }
}

export default Students;