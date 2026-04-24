/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_X_RAPIDAPI_KEY?: string;
  readonly VITE_X_RAPIDAPI_HOST?: string;
  readonly VITE_WEATHER_API?: string;
  readonly VITE_FORECAST_API?: string;
  readonly REACT_APP_X_RAPIDAPI_KEY?: string;
  readonly REACT_APP_X_RAPIDAPI_HOST?: string;
  readonly REACT_APP_WEATHER_API?: string;
  readonly REACT_APP_FORECAST_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
