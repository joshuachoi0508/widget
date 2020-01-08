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
      //dataIdx is used to select which portion of the weather data will be shown.
      dataIdx: 0
    }

    this.decrementIdx = this.decrementIdx.bind(this);
    this.incrementIdx = this.incrementIdx.bind(this);
    this.setFrame = this.setFrame.bind(this);
  }

  //Get latitude / longtitude from Google Maps Geocode API based on the location the user enters.
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

  //Get current location's weather using darksky api. Uses cors-anywhere.herokuapp.com 
  //since darksky doesn't allow cors, I'm using https://cors-anywhere.herokuapp.com/ reverse proxy
  getWeather(){
    fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${process.env.REACT_APP_WEATHER_API_KEY}/${this.state.lat},${this.state.lng}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ weather: data })
      })
  }

  //Sets weather the user selected to see "daily" or "hourly" weather
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

        <div style={{ width: '100%' }}>
          {this.state.weather.currently ? 
            <div className="Weather-weather-detail">
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

              <div className="chart-div" style={{width: "90%"}}>
                <canvas 
                  id="weather-chart"
                  style={{ display: 'none' }}
                ></canvas>
              </div>

            </div>
              :
            <p style={{ textAlign: "center" }}>Please enter location to get weather information</p>
          }
        </div>
      </div>
    );
  }
}

export default Weather;