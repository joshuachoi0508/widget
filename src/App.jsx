import React, { Component } from 'react';
import logo from './logo.svg';
import './reset.css'
import './App.css';

import Weather from './components/weather';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Welcome to your Widgets</h1>

        {/* <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        <div id="App-widgets-div">
          <Weather />
        </div>
      </div>
    );
  }
}

export default App;
