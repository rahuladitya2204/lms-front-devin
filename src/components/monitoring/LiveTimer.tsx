import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const LiveTimer = ({ startedAt, idleTime }) => {
  const [timeLogged, setTimeLogged] = useState("00:00:00");

  useEffect(() => {
    const startTime = dayjs(startedAt);

    const updateTimer = () => {
      const currentTime = dayjs();
      const diffInMilliseconds = currentTime.diff(startTime);
      const timeDuration = dayjs.duration(diffInMilliseconds);

      const hours = String(timeDuration.hours()).padStart(2, "0");
      const minutes = String(timeDuration.minutes()).padStart(2, "0");
      const seconds = String(timeDuration.seconds()).padStart(2, "0");

      setTimeLogged(`${hours}:${minutes}:${seconds}`);
    };

    updateTimer(); // Update immediately on mount
    const intervalId = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [startedAt]);

  return <div>{timeLogged}</div>;
};
