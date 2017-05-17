import React from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class CreateDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: ''
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.createDoc = this.createDoc.bind(this);
  }

  handleTitleChange (event) {
    console.log('this.state.title', this.state.title);
    this.setState ({
      title: event.target.value
    });
    event.preventDefault();
  }

  handleBodyChange (event) {
    console.log('this.state.body', this.state.body);
    this.setState ({
      body: event.target.value
    });
    event.preventDefault();
  }

  createDoc () {
    console.log('createDoc invoked');
    var currentToken = window.localStorage.accessToken;

    var config = {
      headers: {'Authorization': currentToken}
    };

    axios.post('/doc/documents', this.state, config)
    .then(response => {
      window.alert('Document created in database!');
    })
    .catch(error => {
      window.alert('Error creating document in database.')
    });
  }

  render () {
    return (
      <div>
        <h2>Request permission from all students</h2>
        <br></br>
        <TextField
          id="permissionname"
          placeholder="Permission Name"
          value={this.state.password}
          onChange={this.handleTitleChange}
          className="createDocumentTitle"
        />
        <br></br>
        <TextField
          id="permissiondesc"
          placeholder="Permission Description"
          value={this.state.body}
          onChange={this.handleBodyChange}
          className="createDocumentTitle"
          rows={10}
          rowsMax={20}
          multiLine={true}
        />
        <br></br>
        <RaisedButton
          label="Require permission"
          primary={true}
          style={style}
          onClick={this.createDoc} 
        />
      </div>
    )
  }
}

const style = {
  margin: 12,
};

export default CreateDocument;
