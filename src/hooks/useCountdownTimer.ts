import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

function useCountdownTimer(targetEndDate: string) {
  const [percentLeft, setPercentLeft] = useState(100);
  const [timeLeft, setTimeLeft] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    // Calculate the total duration only once when the component mounts
    const end = dayjs(targetEndDate);
    const totalDurationSeconds = end.diff(dayjs(), 'second');

    const interval = setInterval(() => {
      const now = dayjs();
      const secondsLeft = Math.max(end.diff(now, 'second'), 0); // Ensure we don't go negative

      if (secondsLeft > 0) {
        // Calculate percent left based on the initial total duration
        setPercentLeft((secondsLeft / totalDurationSeconds) * 100);

        const hours = Math.floor(secondsLeft / 3600)
          .toString()
          .padStart(2, '0');
        const minutes = Math.floor((secondsLeft % 3600) / 60)
          .toString()
          .padStart(2, '0');
        const seconds = Math.floor(secondsLeft % 60)
          .toString()
          .padStart(2, '0');

        setTimeLeft({ hours, minutes, seconds });
      } else {
        clearInterval(interval);
        setPercentLeft(0);
        setTimeLeft({
          hours: '00',
          minutes: '00',
          seconds: '00'
        });
      }
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetEndDate]); // Dependency array includes only targetEndDate which is expected to not change

  return { percentLeft, timeLeft };
}

export default useCountdownTimer;
