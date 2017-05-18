import React from 'react';
import Chart from './Chart.jsx';

class Assignments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentAssignment: { grades: []}
    };
    this.changeAssignment = this.changeAssignment.bind(this);
  }

  changeAssignment(index) {
    this.setState({
      currentAssignment: this.props.assignments[index]
    });
  }

  render() {
    return (
      <div>
        <div>
          <Chart type="Assignment" item={this.state.currentAssignment} />
          <ul>
            {
              this.props.assignments.map((element, index) => 
                <li key={index} onClick={ () => this.changeAssignment(index) }>{element.Name}</li>
              )
            }
          </ul>
          <button>Add Assignment</button>
        </div>
      </div>
    )
  }
}

export default Assignments;