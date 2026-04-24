import { Button, List, ListItem, ListItemText } from "@mui/material";
import type { AxiosResponse } from "axios";
import axios from "axios";
import type { CSSProperties } from "react";
import { useState } from "react";
import type { Position } from "../App";

interface ForecastApiEntry {
  ts: number;
  weather: {
    icon: string;
    description: string;
  };
}

interface ForecastTime {
  id: number;
  zikan: string;
  youbi: number;
  icon: string;
  condition: string;
}

interface GetForecastWeatherProps {
  position: Position;
}

const getRequiredEnv = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
};

const GetForecastWeather = ({ position }: GetForecastWeatherProps) => {
  const apiKey = import.meta.env.VITE_X_RAPIDAPI_KEY ?? import.meta.env.REACT_APP_X_RAPIDAPI_KEY;
  const apiHost = import.meta.env.VITE_X_RAPIDAPI_HOST ?? import.meta.env.REACT_APP_X_RAPIDAPI_HOST;
  const forecastApi = import.meta.env.VITE_FORECAST_API ?? import.meta.env.REACT_APP_FORECAST_API;
  const flexContainer: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    padding: 0,
  };
  const [times, setTimes] = useState<ForecastTime[]>([]);
  const daysOfWeekString = ["日", "月", "火", "水", "木", "金", "土"];

  const getForecastApi = () => {
    const resolvedForecastApi = getRequiredEnv(forecastApi, "VITE_FORECAST_API");
    const resolvedApiKey = getRequiredEnv(apiKey, "VITE_X_RAPIDAPI_KEY");
    const resolvedApiHost = getRequiredEnv(apiHost, "VITE_X_RAPIDAPI_HOST");
    const options = {
      method: "GET",
      url: resolvedForecastApi,
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
      .then((response: AxiosResponse<{ data: ForecastApiEntry[] }>) => {
        showTimeList(response.data.data);
      })
      .catch((requestError) => {
        console.error(requestError);
      });
  };

  const showTimeList = (entries: ForecastApiEntry[]) => {
    const timeArray: ForecastTime[] = [];
    entries.forEach((day) => {
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
        {times.map((time) => (
          <ListItem key={time.id}>
            <ListItemText>
              {time.zikan}&nbsp;{daysOfWeekString[time.youbi]}
              <img
                src={`https://www.weatherbit.io/static/img/icons/${time.icon}.png`}
                alt={time.condition}
              />
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default GetForecastWeather;
