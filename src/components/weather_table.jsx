import React from 'react';

class WeatherTable extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      frame: "",
      dataIdx: 0
    };

    this.decrementIdx = this.decrementIdx.bind(this);
    this.incrementIdx = this.incrementIdx.bind(this);
  }

  decrementIdx(){
    let { dataIdx } = this.state;

    dataIdx -= 6;
    if (dataIdx <= 0) dataIdx = 0;
    this.setState({dataIdx});
  }

  incrementIdx() {
    let { dataIdx } = this.state;
    const maxIdx = this.props.weatherInfo.weather[this.state.frame].data.length - 1;

    dataIdx += 6;
    if (dataIdx >= maxIdx) dataIdx = dataIdx -= 6;
    this.setState({ dataIdx });
  }

  createTable(){
    const { dataIdx } = this.state;
    const displayData = this.props.weatherInfo.weather[this.state.frame].data.slice(dataIdx, dataIdx + 6);

    if (this.state.frame === "hourly") {
      return displayData.map(weatherData => (
        <div 
          key={weatherData.time}
          className="Weather-Table-individual-data"
        >
          <p>{new Date( weatherData.time * 1000).toGMTString().slice(5, 22)}</p>
          <p>{Math.round(Number(weatherData.apparentTemperature))}°F</p>
        </div>
      ))
    }

    if (this.state.frame === "daily") {
      return displayData.map(weatherData => (
        <div
          key={weatherData.time}
          className="Weather-Table-individual-data"
        >
          <p>{new Date(weatherData.time * 1000).toGMTString().slice(5, 16)}</p>
          {/* Get the average of high/low temp of the day */}
          <p>{Math.round((Number(weatherData.apparentTemperatureHigh) + Number(weatherData.apparentTemperatureLow)) / 2)}°F</p>
        </div>
      ))
    }
  }

  render(){
    if (!this.state.frame) {
      return (
        <div className="Weather-future-weather-div">
          <h4>Future Weather</h4>
          <button onClick={() => this.setState({ frame: "hourly" })}>Hourly</button>
          <button onClick={() => this.setState({ frame: "daily" })}>Daily</button>
        </div>
      )
    }

    return(
      <div id="Weather-Table">
        <div className="Weather-future-weather-div">
          <h4>Future Weather</h4>
          <button onClick={() => this.setState({ frame: "hourly", dataIdx: 0 })}>Hourly</button>
          <button onClick={() => this.setState({ frame: "daily", dataIdx: 0 })}>Daily</button>
        </div>

        <h3>Showing {this.state.frame} Weather Info</h3>

        <div className="Weather-Table-tables-div">
          {this.createTable()}

          <div className="Weather-table-arrow-div">
            <p 
              className="Weather-table-arrow"
              onClick={this.decrementIdx}
            >⇦</p> 

            <p 
              className="Weather-table-arrow"
              onClick={this.incrementIdx}
            >⇨</p>
          </div>

        </div>
      </div>
    )
  }
}

export default WeatherTable;
