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
  const [times, setTimes] = useState({
    id: "",
    zikan: "",
    youbi: "",
  });

  const getForecastApi = () => {
    axios
      .request(options)
      .then((response) => {
        let d = response.data;
        console.log({ d });
        showTimeList(d.list);
        console.log(times);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const showTimeList = (d) => {
    // console.log(d)
    d.forEach(day => {
      const date = new Date(day.dt * 1000);
      const time = date.toLocaleString();
      const week = date.getDay();
      
      setTimes({
        ...times,
        id: times.length,
        zikan: time,
        youbi: week,
      });
    });
    // console.log(date.toLocaleString(), date.getDay());
    // times.push(time);
  };

  return (
    <div className="forecastWeather">
      <button onClick={getForecastApi}>get forecast weather</button>
      {data.feels_like === "" ? <>not set</> : <>set</>}
      {times &&
        Object.keys(times).map((time, index) => (
          <div key={index}>
            {time.zikan} {time.youbi} id:{time.id}
          </div>
        ))}
    </div>
  );
};

export default GetForecastWeather;
