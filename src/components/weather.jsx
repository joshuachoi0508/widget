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
      frame: ""
    }
  }

  getLatLong(e){
    e.preventDefault();

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;

        this.setState({ lat, lng }, this.getWeather)
      })
  }

  getWeather(){
    fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${process.env.REACT_APP_WEATHER_API_KEY}/${this.state.lat},${this.state.lng}`)
      .then(response => response.json())
      .then(data => {
        debugger;
        this.setState({ 
          weather: data,
          weatherLocation: this.state.location
        })
      })
  }

  render() {
    return (
      <div id="Weather">
        <h2>Weather</h2>

        <form 
          className="Weather-location-input-div"
          onSubmit={e => this.getLatLong(e)}
        >
          <p>Enter Location</p>
          <input 
            onChange={(e) => this.setState({location: e.currentTarget.value})} 
            value={this.state.location}
          />
          <button type="submit">Get Weather</button>
        </form>

        <div className="Weather-weather-detail">
          {this.state.weather.currently ? 
            <div>
              <h3>{this.state.weatherLocation}'s Weather Information</h3> 

              <div className="Weather-current-weather-div">
                <h4>Current Weather</h4>
                <p>{this.state.weather.currently.summary} {this.state.weather.currently.apparentTemperature}°F</p>
              </div>

              <div className="Weather-future-weather-div">
                <h4>Future Weather</h4>
                <button onClick={() => this.setState({ frame: "minutely" })}>minutely</button>
                <button onClick={() => this.setState({ frame: "hourly" })}>Hourly</button>
                <button onClick={() => this.setState({ frame: "daily" })}>Daily</button>
              </div>


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