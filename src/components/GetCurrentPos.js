import React, { useState, useEffect } from "react";
import { Box, Button } from "@material-ui/core/";

const ErrorText = () => <p className="App-error-text">geolocation IS NOT available</p>;

const GetCurrentPos = ({ position, setPosition }) => {
  const [isOk, setIsOk] = useState(false);
  const [isPosition, setIsPosition] = useState(false);
  const [watchStatus, setWatchStatus] = useState({
    isWatching: false,
    watchId: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsOk(false);
    } else {
      setIsOk(true);
      getPos();
    }
    // eslint-disable-next-line
  }, []);

  const getPos = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setPosition({ latitude, longitude });
      setIsPosition(true);
    });
  };

  const startWatch = () => {
    console.log("watch start");
    const watchId = navigator.geolocation.watchPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setPosition({ latitude, longitude });
      setIsPosition(true);
      createHref();

      setWatchStatus({ isWatching: true, watchId });
    });
  };

  const createHref = () =>
    `https://www.google.com/maps/@${position.latitude},${position.longitude},16z`;

  const clearPosition = (watchStatus) => {
    navigator.geolocation.clearWatch(watchId);
    setWatchStatus({ isWatching: false, watchId });
  };
  const { isWatching, watchId } = watchStatus;

  return (
    <Box p={2} m={2} className="currentPos">
      {isOk ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              getPos();
            }}
          >
            get position
          </Button>
          {isWatching ? (
            <Button
              variant="contained"
              color="primary"
              p={1}
              onClick={() => clearPosition(watchStatus)}
            >
              Stop Watch Position
            </Button>
          ) : (
            <Button variant="contained" color="primary" m={1} onClick={startWatch}>
              Start Watch Position
            </Button>
          )}
          <p>{isPosition ? "maybe ok..." : "now setting"}</p>
          <div className="">{position.latitude ? position.latitude : "loading"}</div>
          <div className="">{position.longitude ? position.longitude : "loading"}</div>
          <a href={createHref()} target="_blank" rel="noopener noreferrer">
            maps at google {createHref()}
          </a>
          <div className="mode">
            <h3>Watch Mode</h3>
            <p>Watch Status: {isWatching ? "Watching" : "Not Watching"}</p>
            <p>Watch ID: {watchId}</p>
          </div>
        </>
      ) : (
        <ErrorText />
      )}
    </Box>
  );
};

export default GetCurrentPos;
