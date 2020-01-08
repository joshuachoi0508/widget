import React from 'react';
import WeatherTable from './weather_table.jsx';

class Weather extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      location: "",
      weatherLocation: "",
      lat: "",
      lng: "",
      weather: {},
      frame: "",
      dataIdx: 0
    }

    this.decrementIdx = this.decrementIdx.bind(this);
    this.incrementIdx = this.incrementIdx.bind(this);
    this.setFrame = this.setFrame.bind(this);
  }

  getLatLong(e){
    e.preventDefault();

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.location}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;

        this.setState({ 
          lat, 
          lng,
          weatherLocation: data.results[0].formatted_address
        }, this.getWeather)
      })
  }

  getWeather(){
    fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${process.env.REACT_APP_WEATHER_API_KEY}/${this.state.lat},${this.state.lng}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ weather: data })
      })
  }

  setFrame(type) {
    this.setState({ frame: type });
  }

  decrementIdx() {
    let { dataIdx } = this.state;

    dataIdx -= 6;
    if (dataIdx <= 0) dataIdx = 0;
    this.setState({ dataIdx });
  }

  incrementIdx() {
    let { dataIdx } = this.state;
    const maxIdx = this.state.weather[this.state.frame].data.length - 1;

    dataIdx += 6;
    if (dataIdx >= maxIdx) dataIdx = dataIdx -= 6;
    this.setState({ dataIdx });
  }

  render() {
    return (
      <div id="Weather">
        <h2>Weather</h2>

        <form 
          className="Weather-location-input-div"
          onSubmit={e => this.getLatLong(e)}
        >
          <p>Enter Address</p>
          <textarea 
            onChange={(e) => this.setState({location: e.currentTarget.value})} 
            value={this.state.location}
          />
          <button type="submit">Get Weather</button>
        </form>

        <div className="Weather-weather-detail">
          {this.state.weather.currently ? 
            <div>
              <h3>{this.state.weatherLocation}</h3> 

              <div className="Weather-current-weather-div">
                <h4>Current Weather</h4>
                <p>{this.state.weather.currently.summary} {Math.round(this.state.weather.currently.apparentTemperature)}°F</p>
              </div>

              <WeatherTable 
                weatherInfo={this.state}
                incrementIdx={this.incrementIdx}
                decrementIdx={this.decrementIdx}
                setFrame={this.setFrame}
              />
              <canvas 
                id="weather-chart"
                style={{ display: 'none' }}
              ></canvas>
            </div>
              :
            <p>Please enter location to get weather information</p>
          }
        </div>
      </div>
    );
  }
}

export default Weather;