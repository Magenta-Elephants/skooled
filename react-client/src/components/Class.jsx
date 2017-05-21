import React from 'react';
import { Redirect } from 'react-router-dom';

class Class extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      redirectToClassView: false
    }
  
  }

  goToClassView (id) {
    this.setState({ redirectToClassView: id })
  }

  render () {
    if (this.state.redirectToClassView !== false) {
      return (<Redirect to={/students/ + this.props.studentId + /class/ + this.state.redirectToClassView} />)
    }
    return (
      <div>
        <h3 onClick={ () => this.goToClassView(this.props.class.id)}>
          {this.props.class.name}
        </h3>
      </div>
    )
  }

}

export default Class;