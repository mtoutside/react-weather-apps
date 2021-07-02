import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button } from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.grey[300],
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[10],
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const ErrorText = () => <p className="App-error-text">geolocation IS NOT available</p>;

const GetCurrentPos = ({ position, setPosition }) => {
  const classes = useStyles();
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
    <Box p={2} className={classes.root}>
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
            <Button variant="contained" color="primary" onClick={() => clearPosition(watchStatus)}>
              Stop Watch Position
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={startWatch}>
              Start Watch Position
            </Button>
          )}
          <p>{isPosition ? "maybe ok..." : "now setting"}</p>
          <div>{position.latitude ? position.latitude : "loading"}</div>
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
