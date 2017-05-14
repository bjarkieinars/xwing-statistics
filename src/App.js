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
        prev.players.sort((a,b) => a.wins > b.wins)
        prev.players.reverse();
        return {players: prev.players}
      })
    });

    playersRef.on("child_changed", (data) => {
      var player = data.val();
      this.setState(prev => {
        const idx = prev.players.findIndex(p => p.name === player.name)
        const newArray = [...prev.players.slice(0, idx), ...prev.players.slice(idx + 1, prev.players.length)]
        newArray.push(player)
        newArray.sort((a,b) => a.wins > b.wins)
        newArray.reverse();
        return {players: newArray}
      })
    });
  }

  newResult(e) {
    e.preventDefault();
    var resultsRef = firebase.database().ref("results/");
    var playersRef = firebase.database().ref("players/");
    var winnerName = document.getElementById('player1').value;
    var looserName = document.getElementById('player2').value;

    if (winnerName === looserName) {
      alert('error 1 - same winner/looser');
      return;
    }

    resultsRef.push({
      winner: winnerName,
      looser: looserName,
      date: + new Date()
    });

    playersRef.once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnap) {
        if (childSnap.child('name').val() === winnerName) {
          var winnerRef = firebase.database().ref("players/" + childSnap.key);
          winnerRef.update({
            'wins': childSnap.child('wins').val() + 1
          })
        }
        else if (childSnap.child('name').val() === looserName) {
          var looserRef = firebase.database().ref("players/" + childSnap.key);
          looserRef.update({
            'losses': childSnap.child('losses').val() + 1
          })
        }
      })
    })
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
        <h2 className='header'>New Result</h2>
        <form className='form' onSubmit={ (e) => this.newResult(e) }>
          <div className='result'>
            <div className='result-container'>
              <label className='label'>Winner</label>
              <select className='input' id='player1'>
                {this.state.players.map(player =>
                  <option key={player.name}>{player.name}</option>
                )}
              </select>
            </div>
            <div className='result-container'>
              <label className='label'>Looser</label>
              <select className='input' id='player2'>
                {this.state.players.map(player =>
                  <option key={player.name}>{player.name}</option>
                )}
              </select>
            </div>
          </div>
          <button className='button' type='submit'>Add</button>
        </form>
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
        <form className='form' onSubmit={ (e) => this.newPlayer(e) }>
          <input className='input' id='newplayer' placeholder='New Player Name' />
          <button className='button' type='submit'>Add</button>
        </form>

      </div>
    );
  }
}

export default App;
