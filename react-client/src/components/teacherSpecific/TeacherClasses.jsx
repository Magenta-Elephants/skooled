import React from 'react';
import axios from 'axios';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

class TeacherClasses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      redirectToClass: false
    }
    this.goToClass = this.goToClass.bind(this);
  }

  componentDidMount() {
    var config = {
      headers: {'Authorization': window.localStorage.accessToken}
    };

    axios.get('/teachers', config)
      .then((response) => {
        this.setState({ classes: response.data })
      })
      .catch((err) => {
        console.log('err!', err);
      });
  }

  goToClass(id) {
    this.setState({ redirectToClass: id });
  }

  render() {
    if (this.state.redirectToClass !== false) {
      return (<Redirect to={'/classes/' + this.state.redirectToClass} />);
    }
    return (
      <div>
        <h1>Classes</h1>
        <ul>
          {
            this.state.classes.map((element, index) => 
              <li key={index} onClick={ () => this.goToClass(element.id) } >{element.name}</li>
            )
          }
        </ul>
      </div>
    )
  }
}

export default TeacherClasses;