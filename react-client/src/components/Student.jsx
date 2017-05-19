import React from 'react';
import { Redirect } from 'react-router-dom';

class Student extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      redirectToClass: false
    }
    this.goToStudentView = this.goToStudentView.bind(this)
  }

  goToStudentView (id) {
    this.setState({ redirectToClass: id })
  }

  render () {
    if (this.state.redirectToClass !== false) {
      return (<Redirect to={/students/ + this.state.redirectToClass} />)
    }
    return (
      <div className="stud">
        <h3 onClick={ () => this.goToStudentView(this.props.student.id)} >
          {this.props.student.name}
        </h3>
      </div>
    )
  }
}

export default Student;