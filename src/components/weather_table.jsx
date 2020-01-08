import React from 'react';
import Chart from 'chart.js';

const WeatherTable = (props) => {
  //Creates labels for chartjs chart
  const createLabels = () => {
    let labels = [];
    if (props.weatherInfo.frame === 'hourly') {
      //Get current label (upto 6) and map them to be labels.
      labels = props.weatherInfo.weather[props.weatherInfo.frame].data.slice(props.weatherInfo.dataIdx, props.weatherInfo.dataIdx + 6).map(weatherInfo => {
        //Convert the time into a string and slice only the hour / minute
        return new Date(weatherInfo.time * 1000).toGMTString().slice(17, 22);
      })
    } 
    
    if (props.weatherInfo.frame === 'daily') {
      //Get current 6 weather data and map them to be labels.
      labels = props.weatherInfo.weather[props.weatherInfo.frame].data.slice(props.weatherInfo.dataIdx, props.weatherInfo.dataIdx + 6).map(weatherInfo => {
        //Convert the time into a string and slice only the month / day
        return new Date(weatherInfo.time * 1000).toGMTString().slice(5, 11);
      })
    }
    return labels;
  }

  //Creates data matching the labels for chatsjs chart
  const createData = () => {
    let data = [];

    //Get weather data (upto 6) and map them to be labels.
    if (props.weatherInfo.frame === 'hourly') {
       //Get hourly temperature
      data = props.weatherInfo.weather[props.weatherInfo.frame].data.slice(props.weatherInfo.dataIdx, props.weatherInfo.dataIdx + 6).map(weatherInfo => {
        return Math.round(weatherInfo.apparentTemperature);
      })
    } 
    
    if (props.weatherInfo.frame === 'daily') {
      //Get average of daily temperature
      data = props.weatherInfo.weather[props.weatherInfo.frame].data.slice(props.weatherInfo.dataIdx, props.weatherInfo.dataIdx + 6).map(weatherInfo => {
        return Math.round((weatherInfo.apparentTemperatureHigh + weatherInfo.apparentTemperatureLow) / 2)
      })
    }

    return data;
  }

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
    
    if (props.weatherInfo.frame === "daily") {
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

  if (!props.weatherInfo.frame) {
    return (
      <div className="Weather-future-weather-div">
        <h4>Future Weather</h4>
        <button onClick={() => props.setFrame("hourly")}>Hourly</button>
        <button onClick={() => props.setFrame("daily")}>Daily</button>
      </div>
    )
  }

  //Chartjs 
  if (window.myBarChart && window.myBarChart !== null) {
    window.myBarChart.destroy();
  }

  document.getElementById('weather-chart').style.display = 'block';
  var ctx = document.getElementById('weather-chart').getContext('2d');

  const labels = createLabels();
  const data = createData();

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
  //Chartjs end 

  return (
    <div id="Weather-Table">
      <div className="Weather-future-weather-div">
        <h4>Future Weather</h4>
        <button onClick={() => props.setFrame("hourly")}>Hourly</button>
        <button onClick={() => props.setFrame("daily")}>Daily</button>
      </div>

      <h3>Showing {props.weatherInfo.frame} Weather Info</h3>

      <div className="Weather-Table-tables-div">
        {createTable()}

        <div className="Weather-table-arrow-div">
          <p
            className="Weather-table-arrow"
            onClick={props.decrementIdx}
          >⇦</p>

          <p
            className="Weather-table-arrow"
            onClick={props.incrementIdx}
          >⇨</p>

        </div>
      </div>
    </div>
  )
}

export default WeatherTable;
