import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';

const winRatio = player => {
  const games = player.wins + player.losses
  return games > 0 ? +(Math.round((player.wins / games) + 'e+2') + 'e-2') : 0
}
class App extends Component {

  constructor() {
    super();
    this.state = {
      players: [],
    };
  }

  componentDidMount() {
    var playersRef = firebase.database().ref("players/");

    playersRef.on("child_added", (data) => {
      var newPlayer = data.val();
      this.setState(prev => {
        prev.players.push(newPlayer)
        prev.players.sort((a,b) => a.wins < b.wins)
        return {players: prev.players}
      })
    });

    playersRef.on("child_changed", (data) => {
      var player = data.val();
      console.log(player);
      this.setState(prev => {
        const idx = prev.players.findIndex(p => p.name === player.name)
        const newArray = [...prev.players.slice(0, idx), ...prev.players.slice(idx + 1, prev.players.length)]
        newArray.push(player)
        newArray.sort((a,b) => a.wins < b.wins)
        return {players: newArray}
      })
    });

    // const playersRef = rootRef.child('players/player1/name');
    // playersRef.on('value', snap => {
    //   this.setState({
    //     players: snap.val()
    //   });
    // });
  }

  update() {

  }

  newPlayer(e) {
    e.preventDefault();
    var playersRef = firebase.database().ref("players/");
    var newPlayerName = document.getElementById('newplayer').value;

    playersRef.push({
      name: newPlayerName,
      wins: 0,
      losses: 0,
      mov: 0
    });

    document.getElementById('newplayer').value = '';
  }

  render() {
    return (
      <div className="App">
        {this.state.players.map(player =>
          <div className='card' key={player.name}>
            <h1 className='player-name'>{player.name}</h1>
            <div className='stats-container'>
              <div className='stats'>
                <span>Games: {player.wins + player.losses}</span>
                <span>Win rate: {winRatio(player)}</span>
              </div>
              <div className='stats'>
                <span>Wins: {player.wins}</span>
                <span>Losses: {player.losses}</span>
              </div>
            </div>
          </div>
        )}
        <form className='add-player' onSubmit={ (e) => this.newPlayer(e) }>
          <input className='input' id='newplayer' placeholder='New Player Name' />
          <button className='button' type='submit'>Add</button>
        </form>
      </div>
    );
  }
}

export default App;
