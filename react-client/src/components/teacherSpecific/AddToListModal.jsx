import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  handleSubmit() {
    console.log(this);
    this.handleClose();
    this.props.handleSubmit();
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={this.handleClose} />,
      <FlatButton label="Submit" primary={true} onTouchTap={this.handleSubmit} />
    ];

    return (
      <div>
        <RaisedButton label={this.props.buttonLabel} onTouchTap={this.handleOpen} />
        <Dialog title={this.props.title} actions={actions} modal={true} open={this.state.open}>
          {this.props.modalContents}
        </Dialog>
      </div> 
    )
  }
}

