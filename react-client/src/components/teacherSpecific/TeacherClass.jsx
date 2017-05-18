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
  }

  componentWillMount() {
    var config = {
      headers: {'Authorization': window.localStorage.accessToken},
      id: this.props.id
    };
    axios.get('/teachers/class', config)
      .then((response) => {
        this.setState({
          students: response.data.students,
          assignments: response.data.assignments
        });
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

  render() {
    return (
      <div>
        <Tabs value={this.state.currentTab} onChange={this.handleChange} >
          <Tab label="Students" value="Students">
            <Students students={this.state.students} />
          </Tab>
          <Tab label="Assignments" value="Assignments">
            <Assignments assignments={this.state.assignments} />
          </Tab>
        </Tabs>
        <h1></h1>
      </div>
    )
  }
}

export default TeacherClass;