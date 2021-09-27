import React, { useState } from "react";
import axios from "axios";

const GetForecastWeather = ({ position }) => {
  const apiKey = process.env.REACT_APP_X_RAPIDAPI_KEY;
  const apiHost = process.env.REACT_APP_X_RAPIDAPI_HOST;
  const forecastApi = process.env.REACT_APP_FORECAST_API;
  const options = {
    method: "GET",
    url: forecastApi,
    params: {
      lat: position.latitude,
      lon: position.longitude,
      units: "metric",
      lang: "ja",
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
    },
  };
  const [data, setData] = useState({
    feels_like: "",
    temp: "",
    temp_max: "",
    temp_min: "",
    humidity: "",
    pressure: "",
    name: "",
    condition: "",
    icon: "",
    windDeg: "",
    windSpeed: "",
  });
  const [times, setTimes] = useState([]);
  const daysOfWeekString = ["日", "月", "火", "水", "木", "金", "土"];

  const getForecastApi = () => {
    axios
      .request(options)
      .then((response) => {
        let d = response.data;
        console.log({ d });
        showTimeList(d.list);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const showTimeList = (d) => {
    const timeArray = [];
    d.forEach((day) => {
      const date = new Date(day.dt * 1000);
      const time = date.toLocaleString();
      const week = date.getDay();
      // console.log({ time }, { week });

      timeArray.push({
        id: timeArray.length,
        zikan: time,
        youbi: week,
      });
    });
    console.log(timeArray);
    setTimes(timeArray);
  };

  return (
    <div className="forecastWeather">
      <button onClick={getForecastApi}>get forecast weather</button>
      <ul>
        {times &&
          times.map((key, index) => (
            <li key={key.id}>
              <p> zikan: {key.zikan}</p>
              <p> youbi: {daysOfWeekString[key.youbi]}</p>
            </li>
          ))}
      </ul>
      <div>{times && console.log({ times })}</div>
    </div>
  );
};

export default GetForecastWeather;
