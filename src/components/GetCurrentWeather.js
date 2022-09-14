import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Box, Button, Card, CardMedia } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    maxWidth: 600,
  },
});
const apiKey = process.env.REACT_APP_X_RAPIDAPI_KEY;
const apiHost = process.env.REACT_APP_X_RAPIDAPI_HOST;
const weatherApi = process.env.REACT_APP_WEATHER_API;
const paramsName = {
  feels_like: "体感温度",
  temp: "気温",
  humidity: "湿度",
  pressure: "気圧",
  name: "名前",
  condition: "天気",
  icon: "アイコン",
  windDeg: "風向き",
  windSpeed: "風速",
};

const GetCurrentWeather = ({ position }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    feels_like: "",
    temp: "",
    humidity: "",
    pressure: "",
    name: "",
    condition: "",
    icon: "",
    windDeg: "",
    windSpeed: "",
  });
  const [response, setResponse] = useState();
  const [error, setError] = useState(false);
  const setWeatherData = useCallback((response) => {
    return setData({
      feels_like: response.app_temp,
      temp: response.temp,
      humidity: response.rh,
      pressure: response.pres,
      name: response.city_name,
      condition: response.weather.description,
      icon: response.weather.icon,
      windDeg: response.wind_cdir,
      windSpeed: response.wind_spd,
    });
  }, []);

  const getWeatherApi = useCallback(async () => {
    console.log("get weather called");
    const options = {
      method: "GET",
      url: weatherApi,
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
    axios
      .request(options)
      .then((res) => {
        setResponse(res.data.data[0]);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  }, [position.latitude, position.longitude]);

  // 位置情報を取得したらAPI実行
  useEffect(() => {
    if (position.latitude !== null || position.longitude !== null) getWeatherApi();
  }, [position, getWeatherApi]);

  useEffect(() => {
    console.log(`useEffect called`, { response });
    if (response === undefined || error) return;
    setWeatherData(response);
  }, [response, error, setWeatherData]);

  return (
    <div className="currentWeather">
      <Button variant="contained" color="primary" onClick={getWeatherApi}>
        get weather
      </Button>
      <div>
        {data.feels_like !== "" && (
          <>
            <p>
              {data.name} の天気 / {data.condition} {data.temp}℃
            </p>
            <Box className="weather__detail" display="flex">
              <div className="weather__detailInner">
                {data.icon && (
                  <img src={`https://www.weatherbit.io/static/img/icons/${data.icon}.png`} alt={data.condition} />
                )}
              </div>
              <div className="weather__detailInner">
              </div>
            </Box>
            {position.latitude !== null && (
              <Card className={classes.root}>
                <CardMedia
                  component="iframe"
                  src={
                    "https://www.google.com/maps?output=embed&q=" +
                    position.latitude +
                    "," +
                    position.longitude +
                    "&t=m"
                  }
                  width="600"
                  height="450"
                  title="maps"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></CardMedia>
              </Card>
            )}
            <List>
              {Object.keys(data).map((key, index) => (
                <ListItem key={index}>
                  <ListItemText>
                    {" "}
                    {paramsName[key]}: {data[key]}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </div>
    </div>
  );
};

export default GetCurrentWeather;
