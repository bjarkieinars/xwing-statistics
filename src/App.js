import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {

  constructor() {
      super();
      this.state = {
        name: 'Loading'
      };
  }

  componentDidMount() {
    const rootRef = firebase.database().ref();
    const nameRef = rootRef.child('name');
    nameRef.on('value', snap => {
      this.setState({
        name: snap.val()
      });
    });
  }

  render() {
    return (
      <div className="App">
        <h1>{this.state.name}</h1>
      </div>
    );
  }
}

export default App;
