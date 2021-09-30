import React, { useState } from "react";
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
      units: "metric",
      lang: "ja",
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
    },
  };
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

      timeArray.push({
        id: timeArray.length,
        zikan: time,
        youbi: week,
      });
    });
    setTimes(timeArray);
  };

  return (
    <div className="forecastWeather">
      <Button variant="contained" color="primary" onClick={getForecastApi}>
        get forecast weather
      </Button>
      <List>
        {times &&
          times.map((key, index) => (
            <ListItem key={key.id}>
              <ListItemText>
                zikan: {key.zikan}
                youbi: {daysOfWeekString[key.youbi]}
              </ListItemText>
            </ListItem>
          ))}
      </List>
      <div>{times && console.log({ times })}</div>
    </div>
  );
};

export default GetForecastWeather;
