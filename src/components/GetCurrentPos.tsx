import LaunchIcon from "@mui/icons-material/Launch";
import { Box, Button } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";
import type { Position } from "../App";

const ErrorText = () => <p className="App-error-text">geolocation IS NOT available</p>;

interface GetCurrentPosProps {
  position: Position;
  setPosition: Dispatch<SetStateAction<Position>>;
}

interface WatchStatus {
  isWatching: boolean;
  watchId: number | null;
}

const GetCurrentPos = ({ position, setPosition }: GetCurrentPosProps) => {
  const [isOk, setIsOk] = useState(false);
  const [isPosition, setIsPosition] = useState(false);
  const [watchStatus, setWatchStatus] = useState<WatchStatus>({
    isWatching: false,
    watchId: null,
  });

  const getPos = useCallback(() => {
    navigator.geolocation.getCurrentPosition((currentPosition) => {
      const latitude = currentPosition.coords.latitude;
      const longitude = currentPosition.coords.longitude;
      setPosition({ latitude, longitude });
      setIsPosition(true);
    });
  }, [setPosition]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsOk(false);
    } else {
      setIsOk(true);
      getPos();
    }
  }, [getPos]);

  const startWatch = () => {
    console.log("watch start");
    const nextWatchId = navigator.geolocation.watchPosition((currentPosition) => {
      const latitude = currentPosition.coords.latitude;
      const longitude = currentPosition.coords.longitude;
      setPosition({ latitude, longitude });
      setIsPosition(true);

      setWatchStatus({ isWatching: true, watchId: nextWatchId });
    });
  };

  const createHref = () =>
    `https://www.google.com/maps/@${position.latitude},${position.longitude},16z`;

  const clearPosition = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    setWatchStatus({ isWatching: false, watchId: null });
  };
  const { isWatching, watchId } = watchStatus;

  return (
    <Box
      p={2}
      sx={{
        backgroundColor: "grey.300",
        borderRadius: 1,
        boxShadow: 10,
        "& > *": {
          m: 1,
        },
      }}
    >
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
            <Button variant="contained" color="primary" onClick={clearPosition}>
              Stop Watch Position
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={startWatch}>
              Start Watch Position
            </Button>
          )}
          <p>{isPosition ? "settled" : "now setting"}</p>
          <div>{position.latitude ? position.latitude : "loading"}</div>
          <div className="">{position.longitude ? position.longitude : "loading"}</div>
          <a href={createHref()} target="_blank" rel="noopener noreferrer">
            現在地 <LaunchIcon className="link__external" fontSize="small" />
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
