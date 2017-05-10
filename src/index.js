import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAbShmVUIyxHl5_gE68XnReUKK2lhX6c_E",
  authDomain: "xwing-statistics.firebaseapp.com",
  databaseURL: "https://xwing-statistics.firebaseio.com",
  projectId: "xwing-statistics",
  storageBucket: "xwing-statistics.appspot.com",
  messagingSenderId: "928710780628"
};

firebase.initializeApp(config);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
