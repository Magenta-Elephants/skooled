import React from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton'
import axios from 'axios';

class TeacherClasses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      redirectToClass: false,
      showModal: false,
      description: '',
      name: ''
    }
    this.config = { headers: {'Authorization': window.localStorage.accessToken} };
    this.goToClass = this.goToClass.bind(this);
    this.cancelModal = this.cancelModal.bind(this);
    this.submitClass = this.submitClass.bind(this);
  }

  componentDidMount() {
    axios.get('/teacher/classes', this.config)
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

  changeProp(key, val) {
    this.setState({
      [key]: val
    });
  }

  cancelModal() {
    this.setState({
      showModal: false,
      name: '',
      description: ''
    });
  }

  submitClass() {
    var data = {
      description: this.state.description,
      name: this.state.name
    };
    this.cancelModal();

    axios.post('/teacher/addClass', data, this.config)
      .then((response) => {
        console.log('success!', response);
      })
      .catch((err) => {
        console.log('error!', err);
      });
  }

  render() {
    if (this.state.redirectToClass !== false) {
      return (<Redirect to={'/classes/' + this.state.redirectToClass} />);
    }

    const classActions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={this.cancelModal} />,
      <FlatButton label="Submit" primary={true} onTouchTap={this.submitClass} />
    ];

    return (
      <div>
        <h1>Classes</h1>
        <ul>
          {
            this.state.classes.map((element, index) => 
              <li key={index} onClick={ () => {this.goToClass(element.id)} } >{element.name}</li>
            )
          }
        </ul>
        <Dialog title="Add a Class" actions={classActions} modal={true} open={this.state.showModal} >
          <form>
            Name
            <input type="text" onChange={ e => this.changeProp('name', e.target.value )} />
            Description
            <input type="text" onChange={ e => this.changeProp('description', e.target.value )} />
          </form>
        </Dialog>
        <FloatingActionButton className="floatingActionButton" onClick={ () => this.changeProp('showModal', !this.state.showModal) }>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

export default TeacherClasses;