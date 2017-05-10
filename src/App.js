import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {

  constructor() {
      super();
      this.state = {
        players: 'Loading',
      };
  }

  componentDidMount() {
    const rootRef = firebase.database().ref();
    const playersRef = rootRef.child('players/player1/name');
    playersRef.on('value', snap => {
      this.setState({
        players: snap.val()
      });
    });
  }

  render() {
    return (
      <div className="App">
        <h1>{this.state.players}</h1>
      </div>
    );
  }
}

export default App;
