# WeatherWidget

Live site: [WeatherWidget](https://joshuachoi0508.github.io/widget/)

Weather Widget is a simple single-page web-app that provides daily and hourly weather information based on location.

## Installation
- `npm install`
- `npm run start`

## Technologies
1. Google Maps Geocode API is used to get the latitude and longitude of the address the user inputs.
2. Dark Sky API is used to retrieve the weather information from the latitude and longitude obtained by the Google Maps Geocode API.
3. Chart.js is used to render the interactive/responsive bar chart.

## Implementations
#### The API Calls
Upon the user's submission of the address, `getLatLong()` is called to find the latitude/longitude and call `getWeather()` to find the weather information from the latitude/longitude.
```javascript
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
```
#### Data Filtering
To allow users to filter through the data sent from the Dark Sky API, `dataIdx` is used in the main Weather Component. When user presses the right arrow, it increments the dataIdx and when user presses the left arrow, it decrements the dataIdx.

```javascript
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
  ```
Later, the `dataIdx` is used to slice the array data when creating data table (`createTable()`), getting chart lables (`createLabels()`), and getting chart data (`createData()`)
```javascript
  //Creates a table based on the frame and dataIdx
  const createTable = () => {
    const dataIdx = props.weatherInfo.dataIdx;
    //diaplayData is used to selected the weather data that will be represented on the table. Upto 6 data sets.
    const displayData = props.weatherInfo.weather[props.weatherInfo.frame].data.slice(dataIdx, dataIdx + 6);

    if (props.weatherInfo.frame === "hourly") {
      return displayData.map(weatherData => (
        <div
          key={weatherData.time}
          className="Weather-Table-individual-data"
        >
          {/* Gets each hour's temperature*/}
          <p>{new Date(weatherData.time * 1000).toGMTString().slice(5, 22)}</p>
          <p>{Math.round(Number(weatherData.apparentTemperature))}°F</p>
        </div>
      ))
    } 
```
#### Chart.js
With Chart.js, with every render, old chart is destroyed and a new chart is created.
```javascript
  if (window.myBarChart && window.myBarChart !== null) {
    window.myBarChart.destroy();
  }
```
Labels and the dataset matching the labels are created using `createLabels()` and `createData()` methods which use dataIdx to slice the fetched weather data.
```javascript
  const labels = createLabels();
  const data = createData();
```

Styling properties are used to style the chart and make it responsive. Chart.js documentation can be found here: https://www.chartjs.org/docs/latest/
```javascript
  window.myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: `${props.weatherInfo.frame[0].toLocaleUpperCase()}${props.weatherInfo.frame.slice(1)} Weather`,
        backgroundColor: 'white',
        fontColor: 'white',
        data: data
      }]
    },
    options: {
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            min: 1
          },
          gridLines: {
            color: '#ffffff66'
          }
        }]
      },
      xAxes: [{
        gridLines: {
          color: '#ffffff66'
        }
      }]
    },
    responsive: true
  });

  Chart.defaults.global.defaultFontColor = 'white';
  Chart.defaults.global.defaultColor = 'white';
```

## credits
Josh Choi
- joshuachoi0508@gmail.com
- https://github.com/joshuachoi0508
