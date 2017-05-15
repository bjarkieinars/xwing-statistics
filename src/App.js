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
      results: [],
    };
  }

  componentDidMount() {
    var playersRef = firebase.database().ref("players/");
    var resRef = firebase.database().ref("results/");

    resRef.on("child_added", (data) => {
      var newRes = data.val();
      this.setState(prev => {
        prev.results.push(newRes)
        prev.results.sort((a,b) => a.date > b.date)
        return {results: prev.results.reverse()}
      })
    });

    playersRef.on("child_added", (data) => {
      var newPlayer = data.val();
      this.setState(prev => {
        prev.players.push(newPlayer)
        prev.players.sort((a,b) => a.wins > b.wins)
        return {players: prev.players.reverse()}
      })
    });

    playersRef.on("child_changed", (data) => {
      var player = data.val();
      this.setState(prev => {
        prev.players[prev.players.findIndex(p => p.name === player.name)] = player;
        prev.players.sort((a,b) => a.wins > b.wins)
        return {players: prev.players.reverse()}
      })
    });
  }

  newResult(e) {
    e.preventDefault();
    var resultsRef = firebase.database().ref("results/");
    var playersRef = firebase.database().ref("players/");
    var winnerName = document.getElementById('player1').value;
    var looserName = document.getElementById('player2').value;
    var winnersList = document.getElementById('winnerslist').value;
    var loosersList = document.getElementById('looserslist').value;
    var winnerScore = document.getElementById('winnersscore').value;
    var looserScore = document.getElementById('loosersscore').value;

    if (winnerName === looserName) {
      alert('error 1 - same winner/looser');
      return;
    }

    resultsRef.push({
      winner: winnerName,
      looser: looserName,
      winnerslist: winnersList,
      looserslist: loosersList,
      winnersscore: winnerScore,
      loosersscore: looserScore,
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

  formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    date = new Date(date);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  getTime(date) {
    date = new Date(date);
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var time = hour + ':' + min;

    return time;
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
            <div className='result-container'>
              <input className='input' id='winnerslist' placeholder='Winners List' />
              <input className='input input--small' id='winnersscore' placeholder='Score' />
            </div>
            <div className='result-container'>
              <input className='input' id='looserslist' placeholder='Loosers List' />
              <input className='input input--small' id='loosersscore' placeholder='Score' />
            </div>
            <button className='button' type='submit'>Add</button>
          </div>

        </form>
        <h2 className='header'>Results</h2>
        {this.state.results.map(result =>
          <div className='card' key={result.date}>
            <div className='card-row'>
              <h1 className='player-name'>{result.winner} beat {result.looser}</h1>
              <div className='stats-container'>
                <div className='stats'>
                  <span>{this.getTime(result.date)}</span>
                  <span>{this.formatDate(result.date)}</span>
                </div>
              </div>
            </div>
            <div className='card-row card-section'>
              <p className='result-info'>{result.winnerslist}</p>
              <p className='result-info'>{result.winnersscore}</p>
            </div>
            <div className='card-row'>
              <p className='result-info'>{result.looserslist}</p>
              <p className='result-info'>{result.loosersscore}</p>
            </div>
          </div>
        )}
        <h2 className='header'>Players</h2>
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
