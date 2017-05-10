import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {

  constructor() {
    super();
    this.state = {
      players: 'Benni',
      inputValue: '',
    };
  }

  componentDidMount() {
    var playersRef = firebase.database().ref("players/");

    playersRef.on("child_added", function(data) {
      var newPlayer = data.val();
      console.log("name: " + newPlayer.name);
      console.log("wins: " + newPlayer.wins);
      console.log("losses: " + newPlayer.losses);
    });

    playersRef.on("child_changed", function(data) {
      var player = data.val();
      console.log("The updated player name is " + player.name);
    });

    // const playersRef = rootRef.child('players/player1/name');
    // playersRef.on('value', snap => {
    //   this.setState({
    //     players: snap.val()
    //   });
    // });
  }

  setValue(field, e) {
    // TODO
  }

  newPlayer(e) {
    e.preventDefault();
    var playersRef = firebase.database().ref("players/");

    playersRef.push({
      name: 'test',
      wins: 0,
      losses: 0
    });
  }

  render() {
    return (
      <div className="App">
        <h1>{this.state.players}</h1>
        <form onSubmit={ (e) => this.newPlayer(e) }>
          <input onChange={this.setValue.bind(this, 'inputValue')} placeholder='New Player Name' />
          <button type="submit">Add</button>
        </form>
      </div>
    );
  }
}

export default App;
