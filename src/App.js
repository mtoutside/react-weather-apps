import React, { useState } from "react";
import GetCurrentPos from "./components/GetCurrentPos";
import GetCurrentWeather from "./components/GetCurrentWeather";
import GetForecastWeather from "./components/GetForecastWeather";
import "./App.css";

function App() {
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  return (
    <div className="App">
      <GetCurrentPos setPosition={setPosition} position={position} />
      <GetCurrentWeather position={position} />
      <GetForecastWeather position={position} />
    </div>
  );
}

export default App;
