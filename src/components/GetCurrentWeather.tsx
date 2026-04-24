import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";
import { List, ListItem, ListItemText, Box, Button, Card } from "@mui/material";
import type { Position } from "../App";

const apiKey = import.meta.env.VITE_X_RAPIDAPI_KEY ?? import.meta.env.REACT_APP_X_RAPIDAPI_KEY;
const apiHost = import.meta.env.VITE_X_RAPIDAPI_HOST ?? import.meta.env.REACT_APP_X_RAPIDAPI_HOST;
const weatherApi = import.meta.env.VITE_WEATHER_API ?? import.meta.env.REACT_APP_WEATHER_API;

const getRequiredEnv = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
};

interface WeatherApiEntry {
  app_temp: number;
  temp: number;
  rh: number;
  pres: number;
  city_name: string;
  weather: {
    description: string;
    icon: string;
  };
  wind_cdir: string;
  wind_spd: number;
}

interface WeatherData {
  feels_like: number | "";
  temp: number | "";
  humidity: number | "";
  pressure: number | "";
  name: string;
  condition: string;
  icon: string;
  windDeg: string;
  windSpeed: number | "";
}

interface GetCurrentWeatherProps {
  position: Position;
}

const paramsName: Record<keyof WeatherData, string> = {
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

const GetCurrentWeather = ({ position }: GetCurrentWeatherProps) => {
  const [data, setData] = useState<WeatherData>({
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
  const [response, setResponse] = useState<WeatherApiEntry>();
  const [error, setError] = useState(false);
  const setWeatherData = useCallback((nextResponse: WeatherApiEntry) => {
    return setData({
      feels_like: nextResponse.app_temp,
      temp: nextResponse.temp,
      humidity: nextResponse.rh,
      pressure: nextResponse.pres,
      name: nextResponse.city_name,
      condition: nextResponse.weather.description,
      icon: nextResponse.weather.icon,
      windDeg: nextResponse.wind_cdir,
      windSpeed: nextResponse.wind_spd,
    });
  }, []);

  const getWeatherApi = useCallback(async () => {
    const resolvedWeatherApi = getRequiredEnv(weatherApi, "VITE_WEATHER_API");
    const resolvedApiKey = getRequiredEnv(apiKey, "VITE_X_RAPIDAPI_KEY");
    const resolvedApiHost = getRequiredEnv(apiHost, "VITE_X_RAPIDAPI_HOST");
    const options = {
      method: "GET",
      url: resolvedWeatherApi,
      params: {
        lat: position.latitude,
        lon: position.longitude,
        units: "M",
        lang: "ja",
      },
      headers: {
        "x-rapidapi-key": resolvedApiKey,
        "x-rapidapi-host": resolvedApiHost,
      },
    };
    axios
      .request(options)
      .then((res: AxiosResponse<{ data: WeatherApiEntry[] }>) => {
        setResponse(res.data.data[0]);
      })
      .catch((requestError) => {
        console.error(requestError);
        setError(true);
      });
  }, [position.latitude, position.longitude]);

  // 位置情報を取得したらAPI実行
  useEffect(() => {
    if (position.latitude !== null || position.longitude !== null) getWeatherApi();
  }, [position, getWeatherApi]);

  useEffect(() => {
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
              <div className="weather__detailInner"></div>
            </Box>
            {position.latitude !== null && (
              <Card sx={{ maxWidth: 600 }}>
                <Box
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
                  allowFullScreen
                  loading="lazy"
                />
              </Card>
            )}
            <List>
              {(Object.keys(data) as Array<keyof WeatherData>).map((key) => (
                <ListItem key={key}>
                  <ListItemText>
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
