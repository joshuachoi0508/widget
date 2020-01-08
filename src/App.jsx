import React, { Component } from 'react';
import './reset.css'
import './App.css';

import Weather from './components/weather';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 id="App-welcome">Welcome to your Weather Widget</h1>
        <div id="App-widgets-div">
          <Weather />
        </div>
      </div>
    );
  }
}

export default App;
