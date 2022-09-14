import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Button } from "@material-ui/core/";

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
      units: "M",
      lang: "ja",
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
    },
  };
  const flexContainer = {
    display: "flex",
    flexDirection: "row",
    padding: 0,
  };
  const [times, setTimes] = useState([]);
  const daysOfWeekString = ["日", "月", "火", "水", "木", "金", "土"];

  const getForecastApi = () => {
    axios
      .request(options)
      .then((response) => {
        let d = response.data;
        console.log({ d });
        showTimeList(d.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const showTimeList = (d) => {
    const timeArray = [];
    d.forEach((day) => {
      const date = new Date(day.ts * 1000);
      const time = date.toLocaleString();
      const week = date.getDay();
      const icon = day.weather.icon;
      const condition = day.weather.description;

      timeArray.push({
        id: timeArray.length,
        zikan: time,
        youbi: week,
        icon: icon,
        condition: condition,
      });
    });
    setTimes(timeArray);
  };

  return (
    <div className="forecastWeather">
      <Button variant="contained" color="primary" onClick={getForecastApi}>
        get forecast weather
      </Button>
      <List style={flexContainer}>
        {times &&
          times.map((key) => (
            <ListItem key={key.id}>
              <ListItemText>
                {key.zikan}&nbsp;{daysOfWeekString[key.youbi]}
                <img src={`https://www.weatherbit.io/static/img/icons/${key.icon}.png`} alt={key.condition} />
              </ListItemText>
            </ListItem>
          ))}
      </List>
      <div>{times && console.log({ times })}</div>
    </div>
  );
};

export default GetForecastWeather;
