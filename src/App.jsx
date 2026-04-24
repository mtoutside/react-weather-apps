import React, { useState } from "react";
import GetCurrentPos from "./components/GetCurrentPos.jsx";
import GetCurrentWeather from "./components/GetCurrentWeather.jsx";
import GetForecastWeather from "./components/GetForecastWeather.jsx";
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
