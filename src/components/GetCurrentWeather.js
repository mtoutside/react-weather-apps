import React, { useState } from "react";
import axios from "axios";

const GetCurrentWeather = ({ position }) => {
  const apiKey = process.env.REACT_APP_X_RAPIDAPI_KEY;
  const apiHost = process.env.REACT_APP_X_RAPIDAPI_HOST;
  const options = {
    method: "GET",
    url: "https://community-open-weather-map.p.rapidapi.com/weather",
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
  const paramsName = {
    feels_like: "体感温度",
    temp: "気温",
    temp_max: "最高気温",
    temp_min: "最低気温",
    humidity: "湿度",
    pressure: "気圧",
    name: "名前",
    condition: "天気",
    icon: "アイコン",
    windDeg: "風向き",
    windSpeed: "風速",
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

  const getWeatherApi = () => {
    console.log({ position });

    axios
      .request(options)
      .then((response) => {
        let d = response.data;
        console.log(d);
        setData({
          feels_like: d.main.feels_like,
          temp: d.main.temp,
          temp_max: d.main.temp_max,
          temp_min: d.main.temp_min,
          humidity: d.main.humidity,
          pressure: d.main.pressure,
          name: d.name,
          condition: d.weather[0].description,
          icon: d.weather[0].icon,
          windDeg: d.wind.deg,
          windSpeed: d.wind.speed,
        });
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
            <p>{data.name}</p>
            <p>{data.condition}</p>
            <p>風力{data.windSpeed}</p>
            <ul>
              {Object.keys(data).map((key, index) => (
                <li key={index}>
                  {paramsName[key]}: {data[key]}
                </li>
              ))}
            </ul>
          </>
        )}
        {data.icon && <img src={`http://openweathermap.org/img/wn/${data.icon}@2x.png`} alt="" />}
      </div>
    </div>
  );
};

export default GetCurrentWeather;
