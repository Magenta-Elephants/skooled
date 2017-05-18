import React from 'react';
import Chart from './Chart.jsx';

class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStudent: { grades: [] }
    };
    this.changeStudent = this.changeStudent.bind(this);
  }

  changeStudent(index) {
    this.setState({
      currentStudent: this.props.students[index]
    });
  }

  render() {
    return (
      <div>
        <div>
          <Chart type="Student" item={this.state.currentStudent} />
          <ul>
            {
              this.props.students.map((element, index) => 
                <li onClick={ () => this.changeStudent(index) } key={index}>{element.F_Name + ' ' + element.L_Name}</li>
              )
            }
          </ul>
          <button>Add Student</button>
        </div>
      </div>
    )
  }
}

export default Students;