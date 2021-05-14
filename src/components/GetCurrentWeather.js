import React, { useState } from "react";
import axios from "axios";

const GetCurrentWeather = ({ position }) => {
  const apiKey = process.env.REACT_APP_X_RAPIDAPI_KEY;
  const apiHost = process.env.REACT_APP_X_RAPIDAPI_HOST;
  const options = {
    method: "GET",
    url: "https://community-open-weather-map.p.rapidapi.com/weather",
    params: {
      q: "London,uk",
      lat: position.latitude,
      lon: position.longitude,
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
    },
  };
  const [data, setData] = useState([
    {
      base: null,
      clouds: {},
      cod: null,
      coord: {},
      dt: null,
      id: null,
      main: {},
      name: null,
      sys: {},
      timezone: null,
      visibility: null,
      weather: [],
      wind: {},
    },
  ]);
  const [weatherIcon, setWeatherIcon] = useState("");

  const getWeatherApi = () => {
    console.log({ position });

    axios
      .request(options)
      .then((response) => {
        let d = response.data;
        console.log(d);
        setData({
          base: d.base,
          clouds: d.clouds,
          cod: d.cod,
          coord: d.coord,
          dt: d.dt,
          id: d.id,
          main: d.main,
          name: d.name,
          sys: d.sys,
          timezone: d.timezone,
          visibility: d.visibility,
          weather: d.weather,
          wind: d.wind,
        });
        setWeatherIcon(d.weather[0].icon);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <button onClick={getWeatherApi}>get weather</button>
      <div>
        {data && (
          <>
            <p>{data.base}</p>
          </>
        )}
        {weatherIcon && (
          <img src={`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`} alt="" />
        )}
      </div>
    </div>
  );
};

export default GetCurrentWeather;
